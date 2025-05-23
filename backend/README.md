# API de Eventos Baseada em Flask com Filtros, Tema Escuro e Documentação OpenAPI (Scalar)

Este projeto consiste em uma API RESTful construída com Flask que fornece dados de eventos armazenados em arquivos YAML. A API permite filtrar eventos por diversos critérios, apresenta uma página inicial estilizada com tema escuro e gera documentação interativa utilizando OpenAPI (Scalar).

## Sumário

1.  [Visão Geral](#visão-geral)
2.  [Demonstração](#demonstração)
3.  [Começando](#começando)
    * [🐳 Executando a API com Docker](#-executando-a-api-com-docker)
    * [Instalação Manual](#instalação-manual)
4.  [Endpoints da API](#endpoints-da-api)
    * [`/events` [GET]](#events-get)
        * [Parâmetros de Filtro](#parâmetros-de-filtro)
        * [Tabela de Filtros](#tabela-de-filtros)
        * [Exemplos de Requisição](#exemplos-de-requisição)
5.  [Documentação da API (OpenAPI - Scalar)](#documentação-da-api-openapi---scalar)
6.  [Página Inicial com README Estilizado](#página-inicial-com-readme-estilizado)
8.  [Próximos Passos e Contribuições](#próximos-passos-e-contribuições)

## Visão Geral

Esta API foi desenvolvida para agregar e fornecer informações sobre eventos. Ela oferece um endpoint principal que retorna uma lista de eventos em formato JSON, com a capacidade de filtrar esses eventos utilizando vários parâmetros de consulta.  A API também se destaca por apresentar:

  * **Página Inicial Estilizada:** A URL raiz (`/`) renderiza este `README.md` formatado com um tema escuro elegante, proporcionando uma apresentação visualmente agradável e um ponto de acesso central para a documentação.
  * **Documentação Interativa OpenAPI (Scalar):** Utilizando `flask-openapi3`, a API gera automaticamente documentação interativa e completa no padrão OpenAPI (Scalar), acessível através do endpoint `/openapi/scalar`. Isso facilita a exploração dos endpoints, parâmetros e modelos de dados da API.
  * **Filtragem Robusta:** Permite filtrar eventos por tags, nome, organização, tipo (online/presencial), faixa de preço, endereço e datas, com a possibilidade de combinar múltiplos filtros para buscas precisas.

## Demonstração

*Página inicial da API (`/`) renderizando o README.md com tema escuro e link para a documentação Scalar.*

*Documentação interativa da API gerada pelo Scalar, acessível em `/openapi/scalar`.*

## Começando

### 🐳 Executando a API com Docker

A forma mais prática de rodar a API é utilizando Docker. Com o Docker instalado, basta executar os seguintes comandos na raiz do projeto:

```bash
docker compose up --build
```

Isso criará e executará o container `backend`, que estará acessível em:

```
http://localhost:8000
```

A API automaticamente escolherá entre rodar em modo **desenvolvimento** (`flask run --reload`) ou **produção** (`gunicorn`) com base na variável de ambiente `APP_ENV`.

Você pode configurar isso em um arquivo `.env` (já esta assim no repo). Exemplo:

```env
# .env
APP_ENV=development
FLASK_ENV=development
FLASK_APP=app.py
```

Para produção, altere para:

```env
APP_ENV=production
FLASK_ENV=production
```

<details>
<summary><b>Instalação Manual (alternativa ao Docker)</b></summary>

### Pré-requisitos

Certifique-se de ter o Python 3 instalado em sua máquina. É recomendado utilizar Python 3.7 ou superior. Você também precisará do `pip`, gerenciador de pacotes do Python.

Verifique se o Python e o `pip` estão instalados corretamente abrindo o terminal e executando:

```bash
python --version
pip --version
````

Se você não tiver o Python instalado, você pode baixá-lo em https://www.python.org/downloads/.

### Instalação

1.  **Clone o repositório (se aplicável):**

    Se você recebeu o código através de um repositório Git, clone-o para sua máquina local. Caso contrário, pule este passo e prossiga para o próximo.

    ```bash
    git clone [https://github.com/VStahelin/calendario-tech.git](https://github.com/VStahelin/calendario-tech.git)
    cd backend_api_eventos
    ```

2.  **Crie um ambiente virtual (recomendado):**

    É uma boa prática trabalhar em um ambiente virtual Python para isolar as dependências do projeto.

    ```bash
    python -m venv venv
    ```

    Ative o ambiente virtual:

      * **No Linux/macOS:**

        ```bash
        source venv/bin/activate
        ```

      * **No Windows:**

        ```bash
        venv\Scripts\activate
        ```

3.  **Instale as dependências:**

    Utilize o `pip` para instalar as bibliotecas necessárias listadas no arquivo `requirements.txt`.

    ```bash
    pip install -r requirements.txt
    ```

    O arquivo `requirements.txt` deve conter:

    ```
    Flask
    PyYAML
    flask-openapi3
    pydantic
    mistune
    gunicorn # Adicionado Gunicorn à lista de dependências
    ```

### Executando a API

Para iniciar o servidor Flask da API, abra o terminal no diretório raiz do projeto **(`backend` folder)** (onde o arquivo `app.py` e `gunicorn.conf.py` estão localizados) e execute o seguinte comando **para usar Gunicorn em produção (ou simular produção)**: **(Comando de execução atualizado para Gunicorn)**

```bash
gunicorn -c gunicorn.conf.py app:app
```

Para executar em **modo de desenvolvimento (com hot-reload e debug)**, você ainda pode usar (mas **não recomendado para produção**):

```bash
python app.py
```

Você deverá ver uma saída no terminal indicando que o servidor Gunicorn/Flask está rodando. Por padrão, ao usar Gunicorn com a configuração de exemplo, ele estará disponível em:

```
[... logs do Gunicorn ...]
[INFO] Listening at: [URL inválido removido] (process <pid>)
```

Abra um navegador web e acesse o endereço `http://localhost:8000` ou `http://127.0.0.1:8000` (dependendo da configuração do `bind` no `gunicorn.conf.py`) para visualizar a página inicial com o README estilizado e o link para a documentação.  Se estiver usando `python app.py`, acesse `http://127.0.0.1:5000`.

</details>

### 📦 Banco de Dados Versionado

* O banco de dados SQLite (`events.sqlite3`) está incluso no repositório. Isso permite que qualquer pessoa clone e tenha acesso imediato aos eventos cadastrados.
* Todo versionamento de schema é feito através do **Alembic**, que está configurado no projeto.

#### ⚙️ Como rodar migrações Alembic

1. Criar uma nova revisão (quando modificar models):

```bash
alembic revision --autogenerate -m "Mensagem da revisão"
```

2. Aplicar a migração:

```bash
alembic upgrade head
```

3. Verificar status das migrações:

```bash
alembic current
```

> 🔥 Isso garante que o arquivo `events.sqlite3` esteja sempre sincronizado com o schema do projeto. Você pode commitar o banco junto no git normalmente.


## Endpoints da API

### `/events` [GET]

Este é o endpoint principal da API. Ele retorna uma lista de eventos em formato JSON. É possível utilizar parâmetros de consulta na URL para filtrar os eventos retornados.

#### Parâmetros de Filtro

A tabela abaixo detalha todos os parâmetros de consulta disponíveis para filtrar os eventos.

#### Tabela de Filtros

| Parâmetro            | Tipo               | Valores Aceitos       | Descrição                                                                                                                                                                                                                                | Exemplo                                                                       |
| :------------------- | :----------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| `tags`               | Array de Strings   | Qualquer tag         | Filtra eventos por tags. Aceita múltiplas tags para inclusão de eventos que possuam *qualquer uma* das tags fornecidas.                                                                                                               | `tags=python&tags=devops`                                                    |
| `name`               | String             | Qualquer nome         | Filtra eventos por nome do evento. A busca é *case-insensitive* e verifica se o nome do evento *contém* o valor fornecido.                                                                                                                | `name=Python`                                                                |
| `org`                | String             | Qualquer nome         | Filtra por nome da organização promotora do evento. A busca é *case-insensitive* e verifica se o nome da organização *contém* o valor fornecido.                                                                                              | `org=TechCorp`                                                               |
| `online`             | Booleano           | `true`, `false`      | Filtra por eventos online (`true`) ou presenciais (`false`).                                                                                                                                                                              | `online=true`                                                                |
| `price_type`         | String             | `free`, `paid`       | Filtra por tipo de preço. `free` para eventos gratuitos e `paid` para eventos pagos (qualquer valor diferente de "Grátis" no YAML).                                                                                                   | `price_type=free`                                                            |
| `price_min`          | Número (float)     | Valor numérico       | Filtra eventos pagos com preço mínimo (valor numérico). Retorna eventos com custo igual ou superior ao valor fornecido. *Funciona apenas em conjunto com `price_type=paid`*.                                                              | `price_type=paid&price_min=20`                                               |
| `price_max`          | Número (float)     | Valor numérico       | Filtra eventos pagos com preço máximo (valor numérico). Retorna eventos com custo igual ou inferior ao valor fornecido. *Funciona apenas em conjunto com `price_type=paid`*.                                                              | `price_type=paid&price_max=50`                                               |
| `address`            | String             | Qualquer endereço     | Filtra por endereço do evento. A busca é *case-insensitive* e verifica se o endereço do evento *contém* o valor fornecido.                                                                                                                | `address=Paulista`                                                           |
| `date_start_range`   | String (date)      | Formato `YYYY-MM-DD` | Filtra eventos cujo *início* esteja dentro do intervalo de datas definido. Utilize em conjunto com `date_end_range` para definir o intervalo completo (data de início e data de fim do intervalo).                                       | `date_start_range=2025-04-09&date_end_range=2025-04-11`                      |
| `date_end_range`     | String (date)      | Formato `YYYY-MM-DD` | Filtra eventos cujo *término* esteja dentro do intervalo de datas definido. Utilize em conjunto com `date_start_range` para definir o intervalo completo (data de início e data de fim do intervalo).                                         | `date_start_range=2025-04-09&date_end_range=2025-04-11`                      |
| `date_from`          | String (date)      | Formato `YYYY-MM-DD` | Filtra eventos que começam a partir da data fornecida, incluindo a data informada e datas posteriores.                                                                                                                                   | `date_from=2025-04-10`                                                        |

#### Exemplos de Requisição

  * **Obter todos os eventos (sem filtros):**

    ```
    http://localhost:8000/events  # Ou [http://127.0.0.1:5000](http://127.0.0.1:5000) se usar `python app.py`
    ```

  * **Filtrar por eventos com a tag "python" e "django":**

    ```
    http://localhost:8000/events?tags=python&tags=django
    ```

  * **Filtrar por eventos com nome contendo "Python":**

    ```
    http://localhost:8000/events?name=Python
    ```

  * **Filtrar por eventos online e gratuitos:**

    ```
    http://localhost:8000/events?online=true&price_type=free
    ```

  * **Filtrar por eventos pagos com preço entre R$20 e R$50:**

    ```
    http://localhost:8000/events?price_type=paid&price_min=20&price_max=50
    ```

  * **Filtrar por eventos que começam a partir de 10 de abril de 2025:**

    ```
    http://localhost:8000/events?date_from=2025-04-10
    ```

## Documentação da API (OpenAPI - Scalar)

A API gera documentação interativa e completa utilizando OpenAPI com **Scalar** através da biblioteca `flask-openapi3`. Para acessar a documentação, abra seu navegador web e acesse o seguinte endereço enquanto a API estiver rodando:

```
http://localhost:8000/openapi/scalar # Ou [http://127.0.0.1:5000](http://127.0.0.1:5000) se usar `python app.py`
```

A página do **Scalar** exibirá a documentação detalhada da API, incluindo:

  * **Endpoints:** Descrição e métodos HTTP disponíveis (neste caso, apenas `GET` para `/events`).
  * **Parâmetros:** Detalhes de todos os parâmetros de filtro de consulta, seus tipos, formatos, descrições e exemplos.
  * **Modelos de Dados (Schemas):** Estrutura do objeto de evento retornado pela API, com os tipos de dados de cada campo.
  * **Exemplos de Requisição e Resposta:**  Exemplos de como fazer requisições e a estrutura das respostas JSON esperadas.

Você pode usar esta documentação interativa para explorar a API, testar os endpoints diretamente no navegador e entender completamente como utilizá-la.

## Página Inicial com README Estilizado

Ao acessar a URL raiz da API (`http://localhost:8000/` ou `http://127.0.0.1:5000`), você será apresentado a uma página inicial que renderiza o conteúdo deste arquivo `README.md` formatado em HTML com um tema escuro. No topo da página, há um link direto para a documentação da API no **Scalar**, facilitando a navegação e o acesso à documentação completa.

Esta página inicial estilizada serve como um ponto de entrada amigável para a API, oferecendo tanto uma visão geral do projeto quanto um acesso rápido à documentação técnica detalhada.

*Página inicial da API (`/`) com README.md estilizado em tema escuro e link de fácil acesso para a documentação Scalar.*


## Próximos Passos e Contribuições

Este projeto é um ponto de partida para uma API de eventos ainda mais completa e robusta. Considere os seguintes próximos passos e contribuições para aprimorá-la:

  * **Paginação:** Adicionar paginação à resposta do endpoint `/events`. Isso é crucial para APIs que podem retornar um grande número de resultados, permitindo que os resultados sejam divididos em páginas para melhorar o desempenho e a usabilidade.
  * **Sistema de Cache:** Integrar um mecanismo de cache (como Redis ou Memcached) para armazenar em cache os resultados de consultas frequentes. Isso pode reduzir drasticamente a carga no servidor e melhorar os tempos de resposta da API, especialmente sob alta demanda.
  * **Testes Unitários e de Integração:** Desenvolver testes unitários para as funções de filtragem e outros componentes lógicos da API, bem como testes de integração para garantir que todos os componentes funcionem corretamente em conjunto. Testes são essenciais para manter a qualidade do código e facilitar futuras modificações e expansões.
Contribuições para este projeto são sempre bem-vindas\! Sinta-se à vontade para abrir *issues* para reportar problemas ou sugerir melhorias, e *pull requests* com suas implementações e correções.