# Calendário Tech
<p align="center">
    <p align="center">
        <img src="https://calendario.tech/img/logotipo_white.png" alt="calendario tech Logo"/>
    </p>
</p>

<p align="center">
    <a href="https://calendario.tech/">
        <img src="https://img.shields.io/badge/Website-Visit%20our%20site-blue" alt="Website">
    </a>
    <a href="https://www.instagram.com/whitestonedev">
        <img src="https://img.shields.io/badge/Instagram-Follow%20us%20on%20Instagram-E4405F" alt="Instagram">
    </a>
</p>


## Sobre o Projeto
O **Calendário Tech** surgiu para solucionar um problema comum na comunidade tecnológica: a dificuldade de acompanhar eventos relacionados à tecnologia na região. Frequentemente, eventos importantes acabam passando despercebidos por falta de um local centralizado que reúna todas essas informações.

Este projeto open source é mantido pela comunidade e oferece:

* Uma plataforma web amigável e intuitiva para consulta e divulgação de eventos tecnológicos locais.
* Uma API aberta e bem documentada para que desenvolvedores possam criar integrações e aplicações adicionais com base nos eventos cadastrados.

Nosso objetivo é fortalecer a comunidade tech, compartilhando conhecimento e facilitando conexões locais.

O Calendário Tech está disponível publicamente em duas frentes principais:

* A interface web: [https://calendario.tech](https://calendario.tech)
* A API pública: [https://api.calendario.tech](https://api.calendario.tech), com documentação acessível tanto via [Scalar](https://api.calendario.tech/openapi/scalar) quanto via Redoc, facilitando a compreensão através do padrão OpenAPI.

## Como Funciona

O projeto está estruturado em duas partes principais:

* **Frontend:** Desenvolvido com React, TypeScript e Vite, hospedado no GitHub Pages.
* **Backend:** Desenvolvido com Flask, rodando em uma instância independente com PostgreSQL para armazenamento dos dados. Um script diário automatizado gera backups do banco de dados e abre Pull Requests no GitHub para versionamento contínuo dos dados.

## Estrutura do Projeto simplificada

```
calendario-tech/
├── .github/                   # Templates e workflows para CI/CD
├── backend/                   # Código Backend (Flask)
│   ├── src/                   # Módulos principais do backend
│   ├── Dockerfile             # Dockerfile para build da aplicação
│   ├── docker-compose.yml     # Arquivo Docker Compose para facilitar execução
│   ├── alembic.ini            # Configuração das migrações de banco de dados
│   ├── requirements.txt       # Dependências Python
│   └── example.env            # Exemplo de variáveis de ambiente
├── frontend/                  # Código Frontend (React + Vite)
│   ├── src/                   # Componentes e páginas principais
│   ├── package.json           # Dependências do projeto frontend
│   ├── tailwind.config.ts     # Configuração do TailwindCSS
│   ├── vite.config.ts         # Configuração do Vite
│   └── public/                # Arquivos estáticos
├── LICENSE                    # Licença do projeto
└── README.md                  # Este arquivo
```

## Como Rodar o Projeto Localmente

### Backend (Flask)

<details>
<summary><strong>Ver instruções para rodar o backend (Docker Compose ou manualmente)</strong></summary>

#### Com Docker Compose:

1. Copie o arquivo `example.env` para `.env` no diretório `backend/` e preencha as variáveis necessárias.

```bash
cd backend/
cp example.env .env
```

2. Rode o projeto com Docker Compose:

```bash
docker-compose up
```

#### Sem Docker:

1. Configure o ambiente Python (recomenda-se usar virtualenv ou Poetry).

```bash
pip install -r requirements.txt
```

2. Configure as variáveis de ambiente copiando e ajustando `example.env`.

3. Rode a aplicação:

```bash
flask run
```

</details>

### Frontend (React)

```bash
cd frontend/
npm install
npm run dev
```

## Contribuindo

A essência do Calendário Tech está na colaboração. Você pode contribuir de diversas formas:

### Adicione Eventos

Conhece algum evento de tecnologia que não está no nosso calendário? Ajude a manter nossa base atualizada adicionando novos eventos para que toda a comunidade possa participar.

### Seja um Curador

Você pode se tornar um curador para sua região ou cidade, ajudando a manter os eventos locais atualizados e garantindo que a comunidade não perca nenhuma oportunidade. Para adicionar um evento, basta acessar o site [calendario.tech](https://calendario.tech), clicar no botão "Adicionar evento" e preencher o formulário. Os administradores do projeto irão validar os dados enviados e, se estiverem de acordo, aprovar o evento para publicação no calendário.

### API Pública

Oferecemos uma API pública e aberta que você pode utilizar para seus projetos próprios. Acesse a documentação completa [aqui](https://api.calendario.tech/openapi/scalar).

### Contribua com Código

* **Reporte bugs e problemas:** Abra uma issue no nosso repositório GitHub descrevendo o bug e como reproduzi-lo.
* **Implemente novas funcionalidades:** Faça um fork, implemente sua ideia e envie um Pull Request.
* **Melhore a documentação:** Ajude a melhorar nossos guias e documentação técnica.
* **Ajude outros colaboradores:** Responda dúvidas, revise Pull Requests e compartilhe seu conhecimento com a comunidade.

## Quem Somos

O Calendário Tech é uma iniciativa da comunidade **whiteStone\_dev**, um grupo de desenvolvedores unidos com o propósito de fomentar o ecossistema tecnológico local, facilitando o acesso a eventos e oportunidades.

* **Comunidade GitHub:** [whiteStoneDev no GitHub](https://github.com/whitestonedev)
* **Grupo no WhatsApp:** [whiteStone\_dev - Grupo WhatsApp](https://chat.whatsapp.com/LiB7z1n1Ahe3Ts0YD5uPoe)

## Links Úteis

* **Site oficial:** [calendario.tech](https://calendario.tech/#/) — Explore o calendário e descubra eventos de tecnologia próximos a você, mantidos pela comunidade.

* **API:** [api.calendario.tech](https://api.calendario.tech) — Acesse todos os dados de eventos via API pública.

* **Documentação da API:** [api.calendario.tech/openapi](https://api.calendario.tech/openapi) — A API está atualmente documentada com suporte a **Scalar** e **Redoc**, permitindo uma navegação clara e intuitiva baseada no padrão OpenAPI.

## Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
