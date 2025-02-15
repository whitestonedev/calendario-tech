---
name: Pull request para sugestão de Evento
about: Sugestão de Evento
title: ''
labels: Sugestao de evento
assignees: ''
---

### Título do Pull Request:

`Nome do Evento - Edição do Evento - Data do Evento (DD/MM/AAAA)`

Exemplo: `Meetup Python SP - Fevereiro 2025 - 22/02/2025`

### Descrição do Pull Request:

Adiciona o evento `Nome do Evento - Edição do Evento` ao Calendário Tech.

Breve descrição do evento:

[Insira aqui uma descrição curta e concisa do evento. Máximo 2-3 frases.]

**Checklist:**

*   [x]  Arquivo YAML do evento (`NomeDoEventoDDMMAAAA.yml`) criado na pasta `events/` seguindo o padrão de nomenclatura.
*   [x]  Todos os campos do arquivo YAML preenchidos corretamente com as informações do evento.
*   [x]  Branch criado com nome descritivo (`add-evento-nome-do-evento`).
*   [x]  Mensagem de commit descritiva utilizada (`Adiciona evento: Nome do Evento - Edição do Evento`).
*   [x]  Label `Sugestão de evento` adicionada ao Pull Request.
*   [x]  Commits assinados.

**Observações:**

*   Certifique-se de que o arquivo YAML foi criado com a extensão `.yml`.
*   Verifique se as datas e horários (`start_datetime` e `end_datetime`) estão no formato ISO 8601 e em UTC.
*   Confira se o link do Google Maps (`maps_link`) para eventos presenciais é válido ou utilize `https://maps.google.com/?q=event+location` para eventos online.
*   Adicione tags relevantes para facilitar a busca e categorização do evento.
*   Preencha as informações de internacionalização (`intl`) para `pt-br` e `en-us`.
