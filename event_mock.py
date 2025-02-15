import yaml
from faker import Faker
from datetime import datetime, timedelta
import random
import os

def gerar_dados_fake_evento(data_inicio_range, data_fim_range):
    """
    Gera dados fake para um evento no formato YAML.

    Args:
        data_inicio_range (str): Data de início do range no formato AAAA-MM-DD.
        data_fim_range (str): Data de fim do range no formato AAAA-MM-DD.

    Returns:
        dict: Um dicionário contendo dados fake do evento.
    """
    fake = Faker('pt_BR') # Configura o Faker para dados em português do Brasil

    data_inicio = datetime.strptime(data_inicio_range, '%Y-%m-%d')
    data_fim = datetime.strptime(data_fim_range, '%Y-%m-%d')

    # Gerar data e hora de início e fim aleatórias dentro do range
    delta_range = data_fim - data_inicio
    dias_range = delta_range.days
    data_evento = data_inicio + timedelta(days=random.randint(0, dias_range))

    hora_inicio = datetime.strptime(f'{random.randint(8, 12):02}:{random.randint(0, 59):02}', '%H:%M').time() # Hora entre 08:00 e 12:00
    hora_fim = datetime.strptime(f'{random.randint(14, 18):02}:{random.randint(0, 59):02}', '%H:%M').time() # Hora entre 14:00 e 18:00 (após o almoço)

    start_datetime_obj = datetime.combine(data_evento.date(), hora_inicio)
    end_datetime_obj = datetime.combine(data_evento.date(), hora_fim)

    nome_organizacao = fake.company()
    nome_evento = fake.catch_phrase().title() # Frase chamativa para nome do evento
    endereco_fake = fake.street_address() + ', ' + fake.city() + ', ' + fake.country()

    cost = random.choice(['Grátis', f'R${random.randint(0, 500)},00']), # Custo do evento
    edition = random.randint(1, 10) # Edição do evento
    dados_evento = {
        'organization_name': nome_organizacao,
        'event_name': nome_evento,
        'start_datetime': start_datetime_obj.isoformat(),
        'end_datetime': end_datetime_obj.isoformat(),
        'address': endereco_fake,
        'maps_link': f'https://maps.google.com/?q={endereco_fake.replace(" ", "+")}', # Link genérico do Google Maps
        'online': random.choice([True, False]),
        'event_link': fake.url(),
        'intl': {
            'pt-br': {
                'event_edition': f'Edição {edition}', # Edição do evento
                'cost': cost,
                'banner_link': 'https://via.placeholder.com/600x200.png?text=Banner+do+Evento', # Banner genérico
                'short_description': fake.sentence(nb_words=10) # Descrição curta
            },
            'en-us': {
                'event_edition': f'Edition {edition}',
                'cost': cost,
                'banner_link': 'https://via.placeholder.com/600x200.png?text=Event+Banner',
                'short_description': fake.sentence(nb_words=10)
            }
        }
    }
    return dados_evento, data_evento, nome_evento

def gerar_arquivos_yml_eventos(quantidade_arquivos, data_inicio_range, data_fim_range):
    """
    Gera múltiplos arquivos YAML com dados fake de eventos.

    Args:
        quantidade_arquivos (int): O número de arquivos YAML a serem gerados.
        data_inicio_range (str): Data de início do range para os eventos (AAAA-MM-DD).
        data_fim_range (str): Data de fim do range para os eventos (AAAA-MM-DD).
    """
    diretorio_output = 'events' # Nome do diretório para salvar os arquivos
    if not os.path.exists(diretorio_output):
        os.makedirs(diretorio_output) # Cria o diretório se não existir

    for i in range(quantidade_arquivos):
        dados_evento, data_evento, nome_evento = gerar_dados_fake_evento(data_inicio_range, data_fim_range)
        nome_arquivo = f"{data_evento.strftime('%Y%m%d')}_{''.join(e for e in nome_evento if e.isalnum()).lower()}.yml" # Formato: AAAAMMDD_nomedoevento.yml
        caminho_arquivo = os.path.join(diretorio_output, nome_arquivo)

        with open(caminho_arquivo, 'w', encoding='utf-8') as arquivo_yml:
            yaml.dump(dados_evento, arquivo_yml, allow_unicode=True, sort_keys=False) # Salva em YAML

        print(f"Arquivo YAML '{nome_arquivo}' gerado com sucesso em '{diretorio_output}'.")

if __name__ == "__main__":
    quantidade = 20
    data_inicio_range = "2025-02-01"
    data_fim_range = "2025-03-30"

    gerar_arquivos_yml_eventos(quantidade, data_inicio_range, data_fim_range)
    print("Processo de geração de arquivos YAML concluído.")