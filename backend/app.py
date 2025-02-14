from flask import Flask, jsonify, request, render_template_string, Blueprint # Importe Blueprint
import yaml
import os
from datetime import datetime
import mistune

from pydantic import BaseModel, Field
from flask_openapi3 import OpenAPI, Info, Tag

# Importar exemplos da pasta docs
from docs.request_examples import request_examples
from docs.response_examples import response_examples


info = Info(title="Eventos API", version="1.0.0")
app = OpenAPI(__name__, info=info)

event_tag = Tag(name="eventos", description="Operações relacionadas a eventos")

# Caminho para a pasta com os arquivos YAML
DATA_EVENTS_FOLDER = 'data_events'
README_FILE = 'README.md' # Nome do arquivo README
aggregated_events = []

def load_events_from_yaml():
    """Carrega eventos de todos os arquivos YAML na pasta data_events."""
    global aggregated_events
    aggregated_events = []
    for filename in os.listdir(DATA_EVENTS_FOLDER):
        if filename.endswith('.yml') or filename.endswith('.yaml'):
            filepath = os.path.join(DATA_EVENTS_FOLDER, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                try:
                    event_data = yaml.safe_load(file)
                    aggregated_events.append(event_data)
                except yaml.YAMLError as e:
                    print(f"Erro ao ler o arquivo YAML {filename}: {e}")
    return aggregated_events

def get_numeric_price(price_str):
    """Extrai o valor numérico do preço, removendo símbolos e letras."""
    price_numeric_str = ''.join(filter(str.isdigit, price_str))
    try:
        return float(price_numeric_str) / 100.0 if price_numeric_str else 0.0 # Assume centavos se não tiver decimal
    except ValueError:
        return 0.0

class EventQuery(BaseModel):
    """
    Modelo para os parâmetros de consulta de filtro de eventos.
    """
    tags: list[str] | None = Field(None, description="Filtra eventos por tags (múltiplas tags permitidas)")
    name: str | None = Field(None, description="Filtra eventos por nome (case-insensitive, busca parcial)")
    org: str | None = Field(None, description="Filtra eventos por organização (case-insensitive, busca parcial)")
    online: bool | None = Field(None, description="Filtra por eventos online (true) ou presenciais (false)")
    price_type: str | None = Field(None, description="Filtra por tipo de preço ('free' ou 'paid')", enum=['free', 'paid'])
    price_min: float | None = Field(None, description="Filtra eventos pagos com preço mínimo")
    price_max: float | None = Field(None, description="Filtra eventos pagos com preço máximo")
    address: str | None = Field(None, description="Filtra eventos por endereço (case-insensitive, busca parcial)")
    date_start_range: str | None = Field(None, description="Filtra eventos a partir desta data (YYYY-MM-DD)")
    date_end_range: str | None = Field(None, description="Filtra eventos até esta data (YYYY-MM-DD)")
    date_from: str | None = Field(None, description="Filtra eventos a partir desta data (YYYY-MM-DD)")


def filter_events(filters: EventQuery):
    """Filtra a lista de eventos com base nos filtros fornecidos."""
    filtered_events = aggregated_events
    if filters.tags:
        tags_filter = filters.tags
        filtered_events = [
            event for event in filtered_events
            if 'tags' in event and any(tag in event['tags'] for tag in tags_filter)
        ]
    if filters.name:
        name_filter = filters.name.lower()
        filtered_events = [
            event for event in filtered_events
            if 'event_name' in event and name_filter in event['event_name'].lower()
        ]
    if filters.org:
        org_filter = filters.org.lower()
        filtered_events = [
            event for event in filtered_events
            if 'organization_name' in event and org_filter in event['organization_name'].lower()
        ]
    if filters.online is not None: # Alterado para aceitar boolean diretamente
        filtered_events = [
            event for event in filtered_events
            if 'online' in event and event['online'] == filters.online
        ]
    if filters.price_type:
        price_type = filters.price_type.lower()
        if price_type == 'free':
            filtered_events = [
                event for event in filtered_events
                if 'intl' in event and 'pt-br' in event['intl'] and event['intl']['pt-br'].get('cost', '').lower() == 'grátis'
            ]
        elif price_type == 'paid':
            filtered_events = [
                event for event in filtered_events
                if 'intl' in event and 'pt-br' in event['intl'] and event['intl']['pt-br'].get('cost', '').lower() != 'grátis'
            ]
    if filters.price_min:
        min_price_num = filters.price_min
        filtered_events = [
            event for event in filtered_events
            if 'intl' in event and 'pt-br' in event['intl'] and 'cost' in event['intl']['pt-br']
            and not event['intl']['pt-br']['cost'].lower() == 'grátis' # Exclui eventos gratuitos
            and get_numeric_price(event['intl']['pt-br']['cost']) >= min_price_num
        ]
    if filters.price_max:
        max_price_num = filters.price_max
        filtered_events = [
            event for event in filtered_events
            if 'intl' in event and 'pt-br' in event['intl'] and 'cost' in event['intl']['pt-br']
            and not event['intl']['pt-br']['cost'].lower() == 'grátis' # Exclui eventos gratuitos
            and get_numeric_price(event['intl']['pt-br']['cost']) <= max_price_num
        ]
    if filters.address:
        address_filter = filters.address.lower()
        filtered_events = [
            event for event in filtered_events
            if 'address' in event and address_filter in event['address'].lower()
        ]
    if filters.date_start_range and filters.date_end_range:
        start_date_str = filters.date_start_range
        end_date_str = filters.date_end_range
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
            filtered_events = [
                event for event in filtered_events
                if 'start_datetime' in event and 'end_datetime' in event
                and datetime.strptime(event['start_datetime'][:10], '%Y-%m-%d').date() >= start_date.date()
                and datetime.strptime(event['end_datetime'][:10], '%Y-%m-%d').date() <= end_date.date()
            ]
        except ValueError:
            pass # Ignora se as datas não estiverem no formato correto
    if filters.date_from:
        from_date_str = filters.date_from
        try:
            from_date = datetime.strptime(from_date_str, '%Y-%m-%d')
            filtered_events = [
                event for event in filtered_events
                if 'start_datetime' in event
                and datetime.strptime(event['start_datetime'][:10], '%Y-%m-%d').date() >= from_date.date()
            ]
        except ValueError:
            pass # Ignora se a data não estiver no formato correto

    return filtered_events


@app.get('/api/data_events', tags=[event_tag], summary="Listar eventos", description="Retorna uma lista de eventos filtrados de acordo com os parâmetros de consulta.")
def get_events(query: EventQuery):
    """
    Endpoint para retornar eventos filtrados.

    Este endpoint permite filtrar eventos por diversos critérios como tags, nome, organização, tipo (online/presencial),
    faixa de preço, endereço e datas. Os filtros podem ser combinados para refinar a busca.

    **Exemplos de Requisição:**
    (Veja os exemplos detalhados abaixo e na documentação interativa Swagger UI)

    **Exemplo de Resposta (200 - Sucesso):**
    (Veja o exemplo detalhado abaixo e na documentação interativa Swagger UI)
    """
    filtered_events = filter_events(query) # Passa o objeto EventQuery diretamente
    return jsonify(filtered_events)

@app.route('/', methods=['GET'])
def index():
    """Rota para a página inicial que exibe o README formatado e link para a documentação."""
    try:
        with open(README_FILE, 'r', encoding='utf-8') as readme_file:
            readme_content = readme_file.read()
            html_readme = mistune.html(readme_content) # Renderiza Markdown para HTML
            # CSS básico incorporado para estilizar o README
            estilo_readme = """
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                color: #f0f0f0; /* Cor de texto clara */
                                background-color: #121212; /* Fundo bem escuro */
                                margin: 20px;
                            }
                            .container {
                                max-width: 800px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #1e1e1e; /* Fundo um pouco mais claro para o container */
                                border-radius: 8px; /* Bordas arredondadas para o container */
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Sombra suave para o container */
                            }
                            h1, h2, h3 {
                                color: #bb86fc; /* Cor de destaque roxa para títulos */
                            }
                            h1 {
                                border-bottom: 2px solid #bb86fc;
                                padding-bottom: 10px;
                            }
                            h2 {
                                border-bottom: 1px solid #bb86fc;
                                padding-bottom: 5px;
                                margin-top: 25px;
                            }
                            h3 {
                                margin-top: 20px;
                            }
                            p, li {
                                line-height: 1.6;
                                color: #e0e0e0; /* Cor de texto um pouco menos clara para parágrafos */
                            }
                            code {
                                background-color: #272727; /* Fundo escuro para blocos de código inline */
                                color: #dcdcdc; /* Cor de texto clara para código inline */
                                padding: 2px 5px;
                                border-radius: 3px;
                                font-family: monospace;
                            }
                            pre code {
                                display: block;
                                padding: 10px;
                                overflow-x: auto;
                                background-color: #272727; /* Fundo escuro para blocos de código pre */
                                color: #dcdcdc; /* Cor de texto clara para código pre */
                                border: 1px solid #444; /* Borda para blocos de código pre */
                            }
                            a {
                                color: #03dac5; /* Cor de destaque verde-azulada para links */
                                text-decoration: none;
                            }
                            a:hover {
                                text-decoration: underline;
                                color: #03dac5; /* Mantém a cor no hover */
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                                color: #e0e0e0; /* Cor de texto clara para tabelas */
                            }
                            th, td {
                                border: 1px solid #555; /* Bordas mais escuras para a tabela */
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #333; /* Fundo um pouco mais claro para o cabeçalho da tabela */
                                font-weight: bold;
                                color: #f0f0f0; /* Cor de texto clara para o cabeçalho da tabela */
                            }
                        </style>
                        """
            # Adiciona um link para a documentação da API e o CSS ao topo do README renderizado, e envolve em um container
            html_com_estilo = f"""
            <div class="container">
                <div style="text-align: right; margin-bottom: 20px;">
                    <a href="/openapi/swagger" target="_blank">Documentação da API (Swagger UI)</a>
                </div>
                {estilo_readme}
                {html_readme}
            </div>
            """
            return render_template_string(html_com_estilo) # Renderiza com estilo
    except FileNotFoundError:
        return "README.md não encontrado.", 404


# Carregar os eventos ao iniciar a aplicação
load_events_from_yaml()


if __name__ == '__main__':
    app.run(debug=True)