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
7.  [Estrutura dos Arquivos YAML de Eventos](#estrutura-dos-arquivos-yaml-de-eventos)
    * [Exemplo de Arquivo YAML](#exemplo-de-arquivo-yaml)
8.  [Próximos Passos e Contribuições](#próximos-passos-e-contribuições)

## Visão Geral

Esta API foi desenvolvida para agregar e fornecer informações sobre eventos a partir de arquivos YAML localizados na pasta `events` **(um nível acima da pasta `backend`)**. Ela oferece um endpoint principal que retorna uma lista de eventos em formato JSON, com a capacidade de filtrar esses eventos utilizando vários parâmetros de consulta.  A API também se destaca por apresentar:

  * **Página Inicial Estilizada:** A URL raiz (`/`) renderiza este `README.md` formatado com um tema escuro elegante, proporcionando uma apresentação visualmente agradável e um ponto de acesso central para a documentação.
  * **Documentação Interativa OpenAPI (Scalar):** Utilizando `flask-openapi3`, a API gera automaticamente documentação interativa e completa no padrão OpenAPI (Scalar), acessível através do endpoint `/openapi/scalar`. Isso facilita a exploração dos endpoints, parâmetros e modelos de dados da API.
  * **Filtragem Robusta:** Permite filtrar eventos por tags, nome, organização, tipo (online/presencial), faixa de preço, endereço e datas, com a possibilidade de combinar múltiplos filtros para buscas precisas.
  * **Dados em YAML com Recarregamento Automático:** Os dados dos eventos são armazenados em arquivos YAML simples e fáceis de editar, localizados na pasta `events` **(um nível acima do backend)**. A API recarrega automaticamente os dados dos eventos periodicamente, sem necessidade de reiniciar o servidor, garantindo que as informações estejam sempre atualizadas.

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

### Configuração

1.  **Pasta `events`:**

    Certifique-se de que a pasta `events` exista **um nível acima** do diretório `backend` do projeto. Esta pasta é onde a API busca os arquivos YAML contendo os dados dos eventos. **(Corrigido o nome da pasta e a localização)**

2.  **Arquivos YAML:**

    Dentro da pasta `events`, adicione arquivos YAML (`.yml` ou `.yaml`) seguindo a estrutura definida. Cada arquivo YAML representará um evento. Você pode criar arquivos de exemplo como `evento1.yml`, `evento2.yml`, etc., com os dados dos eventos. Consulte a seção [Estrutura dos Arquivos YAML de Eventos](https://www.google.com/url?sa=E&source=gmail&q=#estrutura-dos-arquivos-yaml-de-eventos) para mais detalhes sobre a estrutura esperada.

3.  **Arquivo `README.md`:**

    Certifique-se de que o arquivo `README.md` esteja presente no diretório raiz do projeto, **na pasta `backend`**. Este arquivo será renderizado na página inicial da API (`/`). **(Corrigido para refletir a localização do README dentro de `backend`)**

4.  **Arquivo `gunicorn.conf.py` (Opcional - para produção):**

    Para executar a API em um ambiente de produção, você pode configurar o Gunicorn. Crie um arquivo chamado `gunicorn.conf.py` no diretório raiz do projeto (`backend`) com as configurações do Gunicorn (exemplo abaixo). **(Adicionada menção e exemplo de configuração do Gunicorn)**

    ```python
    # gunicorn.conf.py
    import os

    def num_cores():
        return os.cpu_count()

    bind = "0.0.0.0:8000" # Endereço e porta que o Gunicorn vai usar
    workers = num_cores()  # Número de workers (padrão: número de cores da CPU)
    timeout = 120          # Timeout em segundos
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

## Estrutura dos Arquivos YAML de Eventos

Os arquivos YAML dentro da pasta `events` **(um nível acima da pasta `backend`)** devem seguir a seguinte estrutura para que a API possa ler e interpretar os dados corretamente. **(Corrigido para o nome da pasta 'events' e localização)**

Cada arquivo YAML deve conter as seguintes chaves no nível raiz:

  * `organization_name`: Nome da organização que promove o evento (String).
  * `event_name`: Nome do evento (String).
  * `start_datetime`: Data e hora de início do evento no formato ISO 8601 (ex: `2025-04-10T10:00:00`).
  * `end_datetime`: Data e hora de término do evento no formato ISO 8601 (ex: `2025-04-10T18:00:00`).
  * `address`: Endereço do evento (String).
  * `maps_link`: Link para o Google Maps do local do evento (String, opcional).
  * `online`: Indica se o evento é online (`true`) ou presencial (`false`) (Booleano).
  * `event_link`: Link para a página do evento (String, opcional).
  * `tags`: Lista de tags relacionadas ao evento (Array de Strings).
  * `intl`: Informações internacionalizadas do evento, contendo:
      * `pt-br`: Informações em Português do Brasil:
          * `event_edition`: Edição do evento (String).
          * `cost`: Custo do evento (String, ex: `Grátis`, `R$20`).
          * `banner_link`: Link para o banner do evento (String, opcional).
          * `short_description`: Descrição curta do evento (String).
      * `en-us`: Informações em Inglês dos Estados Unidos (estrutura similar ao `pt-br`).

#### Exemplo de Arquivo YAML

```yaml
organization_name: 'TechCorp'
event_name: 'Python para Iniciantes'
start_datetime: '2025-04-10T10:00:00'
end_datetime: '2025-04-10T18:00:00'
address: 'Avenida Paulista, 123, São Paulo, Brasil'
maps_link: '[https://maps.google.com/?q=Avenida+Paulista+123+Sao+Paulo](https://maps.google.com/?q=Avenida+Paulista+123+Sao+Paulo)'
online: false
event_link: '[https://techcorp.com/python-iniciantes](https://techcorp.com/python-iniciantes)'
tags:
    - 'python'
    - 'iniciantes'
    - 'presencial'
intl:
    pt-br:
        event_edition: 'Edição 2025'
        cost: 'Grátis'
        banner_link: '[https://techcorp.com/banner-python.png](https://techcorp.com/banner-python.png)'
        short_description: 'Workshop introdutório de Python para quem nunca programou.'
    en-us:
        event_edition: '2025 Edition'
        cost: 'Free'
        banner_link: '[https://techcorp.com/banner-python-en.png](https://techcorp.com/banner-python-en.png)'
        short_description: 'Introductory Python workshop for beginners.'
```

## Próximos Passos e Contribuições

Este projeto é um ponto de partida para uma API de eventos ainda mais completa e robusta. Considere os seguintes próximos passos e contribuições para aprimorá-la:

  * **Validação de Dados Aprimorada:** Implementar validações mais rigorosas para os dados nos arquivos YAML, garantindo a consistência e integridade dos dados da API. Isso pode incluir validação de tipos de dados, formatos de data/hora, presença de campos obrigatórios, etc.
  * **Paginação:** Adicionar paginação à resposta do endpoint `/events`. Isso é crucial para APIs que podem retornar um grande número de resultados, permitindo que os resultados sejam divididos em páginas para melhorar o desempenho e a usabilidade.
  * **Sistema de Cache:** Integrar um mecanismo de cache (como Redis ou Memcached) para armazenar em cache os resultados de consultas frequentes. Isso pode reduzir drasticamente a carga no servidor e melhorar os tempos de resposta da API, especialmente sob alta demanda.
  * **Testes Unitários e de Integração:** Desenvolver testes unitários para as funções de filtragem e outros componentes lógicos da API, bem como testes de integração para garantir que todos os componentes funcionem corretamente em conjunto. Testes são essenciais para manter a qualidade do código e facilitar futuras modificações e expansões.
  * **Suporte a Mais Idiomas:** Expandir o suporte para internacionalização para incluir mais idiomas além de `pt-br` e `en-us`. Isso envolveria adicionar mais seções `intl` nos arquivos YAML e possivelmente ajustar a API para selecionar a informação de idioma correta com base em preferências do usuário (e.g., headers de `Accept-Language`).

Contribuições para este projeto são sempre bem-vindas\! Sinta-se à vontade para abrir *issues* para reportar problemas ou sugerir melhorias, e *pull requests* com suas implementações e correções.