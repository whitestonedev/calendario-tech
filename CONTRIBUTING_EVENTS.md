# 📖 Guia Detalhado: Como Adicionar Eventos ao Calendário Tech

Este guia foi criado para te ajudar a contribuir com o Calendário Tech, adicionando eventos incríveis da comunidade tech\!  A atualização dos eventos é **mantida pela comunidade**, e sua contribuição é fundamental para que o calendário seja sempre completo e útil para todos.

Existem duas formas de adicionar eventos:

  * **Pull Request (PR):**  Ideal para quem já tem familiaridade com Git e GitHub. É o método mais rápido e eficiente.
  * **GitHub Issue:**  Perfeito para quem não tem experiência com código, mas quer sugerir um evento.

Escolha o método que for mais confortável para você e siga os passos abaixo\!

## ✍️ Adicionando Eventos via Pull Request (PR) - Modo Ninja\!

Se você já usa Git e GitHub no seu dia a dia, contribuir via Pull Request é super tranquilo\!  Siga este passo a passo:

1.  **Fork o Repositório:**

      * Acesse a página do projeto no GitHub: [Calendário Tech no GitHub](https://github.com/VStahelin/calendario-tech).
      * No canto superior direito da página, clique no botão "**Fork**".  Isso criará uma cópia do repositório na sua conta GitHub.

2.  **Crie um Novo Branch (Recomendado):**

      * No seu fork, clique no nome do branch atual (geralmente "main" ou "master"), localizado acima da lista de arquivos.
      * No campo de texto que aparecer, digite um nome descritivo para o seu novo branch (ex: `add-evento-nome-do-evento`).  Use algo que identifique facilmente o evento que você está adicionando.
      * Clique em "Create branch: `nome-do-branch` from `main`".

3.  **Crie o Arquivo YAML do Evento:**

      * Certifique-se de que você está no **seu novo branch** (verifique o nome do branch no topo da lista de arquivos).
      * Navegue até a pasta `events/`. É aqui que os arquivos YAML dos eventos são armazenados.
      * Clique em "Add file" \> "Create new file".
      * **Nomeie o arquivo YAML:** Use o padrão `NomeDoEventoDDMMAAAA.yml` (ex: `MeetupPythonSP22022025.yml`).  Use o nome do evento (sem espaços, use `CamelCase` ou `kebab-case`), seguido da data do evento no formato DDMMYYYY, e a extensão `.yml`.
      * **Cole o Conteúdo YAML:** Copie o modelo YAML abaixo e cole no editor do GitHub. Preencha **todos os campos** com as informações do evento que você quer adicionar.

    ```yaml
    organization_name: 'Nome da Organização' # Nome da organização que está promovendo o evento
    event_name: 'Nome do Evento' # Nome do evento, ex.: "WordCamp São Paulo"
    start_datetime: '2025-04-10T10:00:00' # Formato ISO 8601:AAAA-MM-DDTHH:MM:SS
    end_datetime: '2025-04-10T18:00:00' # Formato ISO 8601:AAAA-MM-DDTHH:MM:SS
    address: '123 Main Street, City, Country' # Endereço do evento
    maps_link: 'https://maps.google.com/?q=event+location' # Link para o Google Maps, se disponível
    online: true # true para eventos online, false para presenciais
    event_link: 'https://example.com/event'
    tags:
      - 'python'
      - 'django'
      - 'flask'
      - 'fastapi'
      - 'devops'
      - 'docker'
      - 'kubernetes'
    intl:
      pt-br:
        event_edition: 'Edição do Evento' # Edição do evento, ex.: "2024" ou "Kubernetes para Iniciantes"
        cost: 'Grátis' # Especifique 'Grátis' ou um valor numérico com a moeda, por exemplo, 'R$20'
        banner_link: 'https://example.com/banner.png' # Link para o banner do evento
        short_description: 'Uma breve descrição do evento vai aqui.' # Descrição curta do evento
      en-us:
        event_edition: 'Event Edition'
        cost: 'Free'
        banner_link: 'ttps://example.com/banner.png'
        short_description: 'A brief description of the event goes here.'
    ```

4.  **Preencha os Campos do YAML:**

      * **`organization_name`:** Nome da organização ou grupo que está promovendo o evento.
      * **`event_name`:** Nome completo do evento.
      * **`start_datetime`:** Data e hora de **início** do evento. Use o formato ISO 8601: `AAAA-MM-DDTHH:MM:SS` (ex: `2025-03-15T19:00:00`).  **Importante:** Use sempre o fuso horário UTC (Tempo Universal Coordenado) para evitar problemas de horários diferentes. Você pode converter o horário do evento para UTC antes de inserir aqui.
      * **`end_datetime`:** Data e hora de **término** do evento, no mesmo formato ISO 8601 UTC.
      * **`address`:** Endereço completo do local do evento. Se for online, use `Online`.
      * **`maps_link`:** Link para o Google Maps do local do evento. Se for online, use `https://maps.google.com/?q=event+location`.
      * **`online`:** `true` se o evento for online, `false` se for presencial.
      * **`event_link`:** Link para a página oficial do evento, página de inscrição, ou algum link relevante para mais informações.
      * **`tags`:** Lista de tags (palavras-chave) que descrevem o tema do evento. Use tags relevantes como `python`, `javascript`, `ux`, `ia`, `devops`, `blockchain`, etc.  Use **sempre letras minúsculas**.
      * **`intl`:** Seção para informações internacionalizadas (em português do Brasil - `pt-br` e inglês dos EUA - `en-us`).
          * **`event_edition`:** Edição do evento (ex: `2025`, `Edição de Verão`, `Para Iniciantes`).
          * **`cost`:** Custo do evento. Use `Grátis` se for gratuito, ou um valor numérico com a moeda (ex: `R$50`, `USD 20`).
          * **`banner_link`:** Link para a imagem do banner do evento (opcional, mas ajuda a deixar o calendário mais visual).
          * **`short_description`:** Descrição curta e concisa do evento (máximo 2-3 frases).

5.  **Commit as Mudanças:**

      * Na parte inferior do editor, adicione uma mensagem de commit descritiva (ex: "Adiciona evento: Meetup Python SP - Fevereiro 2025").
      * Clique em "Commit changes...". Certifique-se de que a opção "Commit directly to the `nome-do-seu-branch` branch" está selecionada (deve ser o padrão).

6.  **Crie um Pull Request:**

      * Após o commit, vá para a página principal do **seu fork** no GitHub.
      * Você deverá ver um botão "**Contribute**" ou "**Compare & pull request**" (geralmente perto do topo da página). Clique nele.
      * Na página de criação do Pull Request:
          * **Verifique** se o branch base é `VStahelin/calendario-tech:main` e o branch compare é o **seu fork** e o **seu branch** (`seu-usuario/calendario-tech:nome-do-seu-branch`).
          * **Título do Pull Request:** Preencha com o nome e edição do evento, seguido da data (ex: `Meetup Python SP - Fevereiro 2025 - 22/02/2025`).
          * **Descrição do Pull Request:**  Descreva brevemente o evento que você está adicionando.
          * **Labels:** Adicione a label `Novo evento` ao Pull Request.
          * **Assine seus commits:** Certifique-se de que seus commits estão assinados para garantir a segurança e autoria da sua contribuição.
      * Clique em "Create pull request".

7.  **Aguarde a Revisão:**

      * Seu Pull Request será revisado por um dos mantenedores do projeto.
      * Fique atento às notificações e responda a quaisquer comentários ou pedidos de alteração.
      * Assim que o PR for aprovado e mergeado, seu evento estará no Calendário Tech\! 🎉

## 🙋‍♀️ Adicionando Eventos via GitHub Issue - Para Iniciantes e Sugestões\!

Não tem problema se você não usa Git\!  Você pode sugerir eventos de forma super fácil usando **GitHub Issues**:

1.  **Abra uma Nova Issue:**

      * Acesse a página de Issues do projeto: [Issues do Calendário Tech](https://github.com/VStahelin/calendario-tech/issues).
      * Clique no botão verde "**New issue**".
      * Clique em "**Get started**" ao lado do template de Issue chamado "**Sugestão de Evento**".

2.  **Preencha o Formulário da Issue:**

      * **Título:** Preencha com o nome e edição do evento, seguido da data (ex: `Workshop UX Design - Março/2025`).
      * **Formulário:** Preencha **todos os campos** do formulário "Sugestão de Evento" com os detalhes do evento. Quanto mais informações você fornecer, melhor\!
      * Clique em "**Submit new issue**".

3.  **Aguarde a Aprovação e Adição:**

      * Um mantenedor do projeto irá revisar sua sugestão de evento na Issue.
      * Se o evento for aprovado, um mantenedor irá criar o arquivo YAML com as informações fornecidas e adicionar o evento ao calendário via Pull Request.
      * A Issue será vinculada ao Pull Request e fechada quando o evento for adicionado ao projeto.

## 🤝 Precisa de Ajuda?

Se tiver qualquer dúvida durante o processo de contribuição, **não hesite em perguntar\!**

  * Abra uma Issue com sua dúvida.
  * Pergunte no nosso grupo do WhatsApp: [whiteStone\_dev - Grupo WhatsApp](https://chat.whatsapp.com/LiB7z1n1Ahe3Ts0YD5uPoe).

Sua contribuição é muito importante para manter o Calendário Tech sempre atualizado e útil para a comunidade\!  **Obrigado por colaborar\!** 😊