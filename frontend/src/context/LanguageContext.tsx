import React, { createContext, useContext, useState, ReactNode } from "react";

type LanguageType = "pt-br" | "en-us" | "es-es";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

type Language = "pt-br" | "en-us" | "es-es";

const translations = {
  "pt-br": {
    // Navbar
    "nav.contribute": "Contribuir",
    "nav.addEvent": "Adicionar evento",

    // Index page
    "index.subtitle":
      "Encontre os melhores eventos de tecnologia próximos a você, mantidos pela comunidade para a comunidade.",
    "index.initiative": "Uma iniciativa whiteStone_dev",
    "index.clearDateFilter": "Limpar filtro de data",
    "index.eventsFound": "Eventos Encontrados",
    "index.event": "Evento",
    "index.events": "Eventos",
    "index.noEventsFound": "Nenhum evento encontrado",
    "index.noEventsMessage":
      "Não encontramos eventos com os filtros selecionados.",
    "index.clearAllFilters": "Limpar todos os filtros",
    "index.filterTitle": "Filtrar eventos",
    "index.moreFilters": "Mais filtros",
    "index.hideFilters": "Esconder filtros",
    "index.searchEvents": "Buscar eventos",
    "index.searchEventsPlaceholder": "Digite o nome do evento...",
    "index.eventType": "Tipo de evento",
    "index.all": "Todos",
    "index.onlyFree": "Gratuitos",
    "index.location": "Localização",
    "index.locationPlaceholder": "Cidade, estado ou país",
    "index.tags": "Tags",
    "index.organization": "Organização",
    "index.organizationPlaceholder": "Nome da organização",
    "index.cost": "Custo",
    "index.startDate": "Data de início",
    "index.endDate": "Data de término",
    "index.selectDate": "Selecione uma data",
    "index.paid": "Pago",
    "loading.events": "Carregando eventos...",

    // Event card
    "event.online": "Online",
    "event.inPerson": "Presencial",
    "event.free": "Gratuito",
    "event.register": "Detalhes",
    "event.onlineEvent": "Evento online",
    "event.viewMap": "Ver no mapa",
    "event.share": "Compartilhar",

    // Form steps titles
    "form.step.basicInfo": "Informações Básicas",
    "form.step.basicInfo.desc": "Nome e edição do evento",
    "form.step.dateLocation": "Data e Local",
    "form.step.dateLocation.desc": "Quando e onde acontecerá",
    "form.step.details": "Detalhes do Evento",
    "form.step.details.desc": "Link e informações adicionais",
    "form.step.tags": "Tags",
    "form.step.tags.desc": "Categorize seu evento",
    "form.step.language": "Idioma",
    "form.step.language.desc": "Adicione informações em outros idiomas",
    "form.step.verification": "Verificação",
    "form.step.verification.desc": "Confirme que você é humano",
    "form.step.review": "Revisão",
    "form.step.review.desc": "Revise todos os detalhes",
    "form.step.success": "Evento enviado para aprovação",
    "form.step.success.desc":
      "Recebemos sua solicitação! Se estiver tudo certo, o evento ficará disponível em breve na plataforma.",

    // Form general
    "form.next": "Próxima",
    "form.previous": "Voltar",
    "form.submit": "Submeter Evento",
    "form.step": "Passo",
    "form.of": "de",

    // Form fields
    "form.orgName": "Nome da Organização",
    "form.eventName": "Nome do Evento",
    "form.eventEdition": "Edição do Evento",
    "form.startDate": "Data de início",
    "form.startTime": "Hora de início",
    "form.endDate": "Data de término",
    "form.endTime": "Hora de término",
    "form.online": "Evento online",
    "form.onlineDesc": "Marque esta opção se o evento será realizado online",
    "form.address": "Endereço",
    "form.mapsLink": "Link do Google Maps",
    "form.mapsLinkDesc": "URL do Google Maps para a localização",
    "form.eventLink": "Link do Evento",
    "form.eventLinkDesc": "URL para inscrição ou página oficial do evento",
    "form.cost": "Custo",
    "form.bannerLink": "Link do Banner",
    "form.bannerLinkDesc":
      "URL para a imagem do banner do evento (recomendado: 800x400px)",
    "form.description": "Descrição Curta",
    "form.descriptionDesc": "Uma breve descrição sobre o evento",
    "form.tagsLabel": "Tags",
    "form.tagsDesc": "Selecione as tags que melhor descrevem o evento",
    "form.selectDate": "Selecione uma data",
    "form.verification": "Verificação",
    "form.verificationDesc": "Por favor, complete a verificação de segurança",
    "form.reviewTitle": "Revise os detalhes do seu evento",
    "form.language": "Idioma do evento",
    "form.language.primary": "Principal",
    "form.language.translation": "Tradução",
    "form.addLanguage": "Adicionar idioma",
    "form.selectLanguage": "Selecione um idioma",
    "form.currency": "Moeda",
    "form.value": "Valor",
    "form.state": "Estado",
    "form.selectState": "Selecione um estado",
    "form.selectCurrency": "Selecione uma moeda",
    "event.notProvided": "Não informado",

    // Event details
    "event.basicInfo": "Informações Básicas",
    "event.dateLocation": "Data e Local",
    "event.details": "Detalhes do Evento",
    "event.organization": "Organização:",
    "event.event": "Evento:",
    "event.edition": "Edição:",
    "event.start": "Início:",
    "event.end": "Término:",
    "event.format": "Formato:",
    "event.addressLabel": "Endereço:",
    "event.link": "Link:",
    "event.cost": "Custo:",
    "event.description": "Descrição:",
    "event.banner": "Banner:",

    // Toast messages
    "toast.eventSubmitted": "Evento submetido!",
    "toast.eventSubmittedDesc": "Seu evento foi submetido para aprovação.",

    // Submit dialog
    "dialog.title": "Submeter novo evento",
    "dialog.description":
      "Preencha o formulário abaixo com os detalhes do evento tech que você gostaria de adicionar ao calendário.",

    // Footer
    "footer.maintained": "Mantido pela comunidade para a comunidade",
    "footer.events": "Eventos",
    "footer.contribute": "Contribuir",
    "footer.rights": "Todos os direitos reservados",
    "footer.initiative": "Uma iniciativa",
    "footer.github": "GitHub",
    "footer.linkedin": "LinkedIn",

    // Contribute page
    "contribute.title": "Contribua com o Calendário Tech",
    "contribute.subtitle":
      "Ajude a manter a comunidade informada sobre os melhores eventos de tecnologia próximos a você.",
    "contribute.howTo": "Como contribuir",
    "contribute.addEvents": "Adicione Eventos",
    "contribute.addEventsDesc":
      "Compartilhe eventos que você conhece com a comunidade",
    "contribute.addEventsContent":
      "Conhece algum evento de tecnologia que não está no nosso calendário? Ajude a manter nossa base atualizada adicionando novos eventos para que toda a comunidade possa participar.",
    "contribute.region": "Mantenha sua Região Atualizada",
    "contribute.regionDesc": "Seja um curador dos eventos na sua região",
    "contribute.regionContent":
      "Você pode se tornar um curador para sua região ou cidade, ajudando a manter os eventos locais atualizados e garantindo que a comunidade não perca nenhuma oportunidade.",
    "contribute.learnMore": "Saiba mais",
    "contribute.code": "Contribua com o código",
    "contribute.codeDesc":
      "O Calendário Tech é um projeto de código aberto e precisamos da sua ajuda para melhorá-lo! Se você tem conhecimentos em desenvolvimento web, pode contribuir de várias formas:",
    "contribute.reportBugs": "Reporte bugs e problemas",
    "contribute.reportBugsDesc":
      "Se encontrou algum problema, abra uma issue no nosso repositório GitHub descrevendo o bug e como reproduzi-lo.",
    "contribute.implement": "Implemente novas funcionalidades",
    "contribute.implementDesc":
      "Tem alguma ideia para melhorar o Calendário Tech? Faça um fork do repositório, implemente sua funcionalidade e envie um Pull Request.",
    "contribute.docs": "Melhore a documentação",
    "contribute.docsDesc":
      "Documentação clara é fundamental. Ajude a melhorar nossos guias, tutoriais e documentação técnica.",
    "contribute.help": "Ajude outros colaboradores",
    "contribute.helpDesc":
      "Responda dúvidas, revise Pull Requests e compartilhe seu conhecimento com a comunidade.",
    "contribute.github": "Contribua no GitHub",
    "contribute.ready": "Pronto para começar?",
    "contribute.readyDesc":
      "Junte-se à nossa comunidade e ajude a construir um recurso valioso para todos os profissionais e entusiastas de tecnologia.",
    "contribute.viewEvents": "Ver eventos",
    "contribute.addEvent": "Adicionar evento",
    "contribute.publicApi": "API Pública",
    "contribute.publicApiDesc":
      "O Calendario.tech oferece uma API pública e aberta que você pode usar para seus próprios projetos. A API faz parte do nosso ecossistema open source e fornece acesso aos eventos de tecnologia.",
    "contribute.openApi": "API Aberta",
    "contribute.openApiDesc":
      "Nossa API é totalmente aberta e pode ser acessada sem necessidade de autenticação. Consulte a documentação completa em",
    "contribute.openData": "Dados Abertos",
    "contribute.openDataDesc":
      "Todo o banco de dados é versionado e disponibilizado como arquivo .db no repositório do projeto, permitindo que você tenha controle total sobre os dados.",
    "contribute.openSourceBackend": "Backend Open Source",
    "contribute.openSourceBackendDesc":
      "O código-fonte do backend também é completamente aberto. Você pode contribuir, adaptar ou criar seu próprio serviço baseado nele.",
    "contribute.exploreApi": "Explorar a API",
    "contribute.apiExamples": "Exemplos de uso da API",
    "contribute.listAllEvents": "Listar todos os eventos",
    "contribute.listAllEventsDesc":
      "Retorna a lista completa dos eventos disponíveis.",
    "contribute.responseExample": "Exemplo de resposta:",
    "contribute.filterByName": "Filtrar por nome",
    "contribute.filterByNameDesc":
      "Buscar eventos que contenham uma palavra no nome.",
    "contribute.filterByLocation": "Filtrar por localização",
    "contribute.filterByLocationDesc":
      "Buscar eventos que contenham um termo no campo de endereço.",
    "contribute.filterByTags": "Filtrar por tags",
    "contribute.filterByTagsDesc":
      "Buscar eventos associados a uma ou mais tags.",
    "contribute.multipleTags": "Múltiplas tags:",
    "contribute.filterByType": "Filtrar por tipo",
    "contribute.filterByTypeDesc": "Buscar eventos online ou presenciais.",
    "contribute.filterByPrice": "Filtrar por preço",
    "contribute.filterByPriceDesc": "Buscar eventos gratuitos:",
    "contribute.priceRange": "Ou dentro de uma faixa de preço:",
    "contribute.filterByDate": "Filtrar por data",
    "contribute.filterByDateFrom":
      "Buscar eventos a partir de uma data específica:",
    "contribute.filterByDateRange": "Ou dentro de um intervalo de datas:",

    // Form validation errors
    "validation.orgName.min":
      "Nome da organização deve ter pelo menos 2 caracteres",
    "validation.eventName.min":
      "Nome do evento deve ter pelo menos 3 caracteres",
    "validation.eventLanguage.required": "Selecione um idioma",
    "validation.startDate.required": "Data de início é obrigatória",
    "validation.startTime.format": "Formato inválido, use HH:MM (ex: 13:30)",
    "validation.endDate.required": "Data de término é obrigatória",
    "validation.endTime.format": "Formato inválido, use HH:MM (ex: 13:30)",
    "validation.address.min": "O endereço deve ter pelo menos 10 caracteres",
    "validation.mapsLink.invalid":
      "O link deve ser um endereço válido do Google Maps",
    "validation.eventLink.invalid": "URL do evento inválida",
    "validation.tags.min": "Selecione pelo menos uma tag",
    "validation.eventEdition.required": "Edição do evento é obrigatória",
    "validation.costType.required": "Selecione o tipo de custo",
    "validation.costValue.required":
      "Valor do custo é obrigatório e não pode ser negativo para eventos pagos",
    "validation.costCurrency.required":
      "Moeda é obrigatória para eventos pagos",
    "validation.bannerLink.invalid": "URL do banner inválida",
    "validation.description.min": "Descrição deve ter pelo menos 10 caracteres",
    "validation.description.max":
      "Descrição não pode ter mais de 300 caracteres",
    "validation.recaptcha.required": "Por favor, complete o reCAPTCHA",
    "validation.state.required":
      "O estado é obrigatório para eventos presenciais",
    "validation.mapsLink.required":
      "O link do mapa é obrigatório para eventos presenciais",
    "validation.translation.costValue.required":
      "Valor do custo é obrigatório e não pode ser negativo para eventos pagos nesta tradução",
    "validation.translation.costCurrency.required":
      "Moeda é obrigatória para eventos pagos nesta tradução",

    "index.basicInfo": "Informações Básicas",
    "index.address": "Endereço",
  },
  "en-us": {
    // Navbar
    "nav.contribute": "Contribute",
    "nav.addEvent": "Add event",

    // Index page
    "index.subtitle":
      "Find the best tech events near you, maintained by the community for the community.",
    "index.initiative": "A whiteStone_dev initiative",
    "index.clearDateFilter": "Clear date filter",
    "index.eventsFound": "Events Found",
    "index.event": "Event",
    "index.events": "Events",
    "index.noEventsFound": "No events found",
    "index.noEventsMessage":
      "We couldn't find events with the selected filters.",
    "index.clearAllFilters": "Clear all filters",
    "index.filterTitle": "Filter events",
    "index.moreFilters": "More filters",
    "index.hideFilters": "Hide filters",
    "index.searchEvents": "Search events",
    "index.searchEventsPlaceholder": "Type event name...",
    "index.eventType": "Event type",
    "index.all": "All",
    "index.onlyFree": "Free only",
    "index.location": "Location",
    "index.locationPlaceholder": "City, state or country",
    "index.tags": "Tags",
    "index.organization": "Organization",
    "index.organizationPlaceholder": "Organization name",
    "index.cost": "Cost",
    "index.startDate": "Start date",
    "index.endDate": "End date",
    "index.selectDate": "Select a date",
    "index.paid": "Paid",
    "loading.events": "Loading events...",

    // Event card
    "event.online": "Online",
    "event.inPerson": "In person",
    "event.free": "Free",
    "event.register": "Details",
    "event.onlineEvent": "Online event",
    "event.viewMap": "View map",
    "event.share": "Share",

    // Form steps titles
    "form.step.basicInfo": "Basic Information",
    "form.step.basicInfo.desc": "Event name and edition",
    "form.step.dateLocation": "Date and Location",
    "form.step.dateLocation.desc": "When and where it will happen",
    "form.step.details": "Event Details",
    "form.step.details.desc": "Link and additional information",
    "form.step.tags": "Tags",
    "form.step.tags.desc": "Categorize your event",
    "form.step.language": "Language",
    "form.step.language.desc": "Add information in other languages",
    "form.step.verification": "Verification",
    "form.step.verification.desc": "Confirm you are human",
    "form.step.review": "Review",
    "form.step.review.desc": "Review all details",
    "form.step.success": "Event submitted for approval",
    "form.step.success.desc":
      "We've received your submission! If everything is in order, the event will be available on the platform soon.",

    // Form general
    "form.next": "Next",
    "form.previous": "Back",
    "form.submit": "Submit Event",
    "form.step": "Step",
    "form.of": "of",

    // Form fields
    "form.orgName": "Organization Name",
    "form.eventName": "Event Name",
    "form.eventEdition": "Event Edition",
    "form.startDate": "Start Date",
    "form.startTime": "Start Time",
    "form.endDate": "End Date",
    "form.endTime": "End Time",
    "form.online": "Online Event",
    "form.onlineDesc": "Check this option if the event will be held online",
    "form.address": "Address",
    "form.mapsLink": "Google Maps Link",
    "form.mapsLinkDesc": "URL for Google Maps location",
    "form.eventLink": "Event Link",
    "form.eventLinkDesc": "URL for registration or official event page",
    "form.cost": "Cost",
    "form.bannerLink": "Banner Link",
    "form.bannerLinkDesc":
      "URL for the event banner image (recommended: 800x400px)",
    "form.description": "Short Description",
    "form.descriptionDesc": "A brief description about the event",
    "form.tagsLabel": "Tags",
    "form.tagsDesc": "Select tags that best describe the event",
    "form.selectDate": "Select a date",
    "form.verification": "Verification",
    "form.verificationDesc": "Please complete the security verification",
    "form.reviewTitle": "Review your event details",
    "form.language": "Event language",
    "form.language.primary": "Primary",
    "form.language.translation": "Translation",
    "form.addLanguage": "Add language",
    "form.selectLanguage": "Select a language",
    "form.currency": "Currency",
    "form.value": "Value",
    "form.state": "State",
    "form.selectState": "Select a state",
    "form.selectCurrency": "Select a currency",
    "event.notProvided": "Not provided",

    // Event details
    "event.basicInfo": "Basic Information",
    "event.dateLocation": "Date and Location",
    "event.details": "Event Details",
    "event.organization": "Organization:",
    "event.event": "Event:",
    "event.edition": "Edition:",
    "event.start": "Start:",
    "event.end": "End:",
    "event.format": "Format:",
    "event.addressLabel": "Address:",
    "event.link": "Link:",
    "event.cost": "Cost:",
    "event.description": "Description:",
    "event.banner": "Banner:",

    // Toast messages
    "toast.eventSubmitted": "Event submitted!",
    "toast.eventSubmittedDesc": "Your event has been submitted for approval.",

    // Submit dialog
    "dialog.title": "Submit new event",
    "dialog.description":
      "Fill out the form below with details of the tech event you would like to add to the calendar.",

    // Footer
    "footer.maintained": "Maintained by the community for the community",
    "footer.events": "Events",
    "footer.contribute": "Contribute",
    "footer.rights": "All rights reserved",
    "footer.initiative": "Project by",
    "footer.github": "GitHub",
    "footer.linkedin": "LinkedIn",

    // Contribute page
    "contribute.title": "Contribute to Tech Calendar",
    "contribute.subtitle":
      "Help keep the community informed about the best tech events near you.",
    "contribute.howTo": "How to contribute",
    "contribute.addEvents": "Add Events",
    "contribute.addEventsDesc": "Share events you know with the community",
    "contribute.addEventsContent":
      "Know any tech events that aren't in our calendar? Help keep our database updated by adding new events so the entire community can participate.",
    "contribute.region": "Keep Your Region Updated",
    "contribute.regionDesc": "Be a curator for events in your region",
    "contribute.regionContent":
      "You can become a curator for your region or city, helping to keep local events updated and ensuring the community doesn't miss any opportunities.",
    "contribute.learnMore": "Learn more",
    "contribute.code": "Contribute to the code",
    "contribute.codeDesc":
      "Tech Calendar is an open source project and we need your help to improve it! If you have web development knowledge, you can contribute in several ways:",
    "contribute.reportBugs": "Report bugs and issues",
    "contribute.reportBugsDesc":
      "If you found any issues, open an issue in our GitHub repository describing the bug and how to reproduce it.",
    "contribute.implement": "Implement new features",
    "contribute.implementDesc":
      "Have an idea to improve Tech Calendar? Fork the repository, implement your feature and submit a Pull Request.",
    "contribute.docs": "Improve documentation",
    "contribute.docsDesc":
      "Clear documentation is essential. Help improve our guides, tutorials and technical documentation.",
    "contribute.help": "Help other contributors",
    "contribute.helpDesc":
      "Answer questions, review Pull Requests and share your knowledge with the community.",
    "contribute.github": "Contribute on GitHub",
    "contribute.ready": "Ready to start?",
    "contribute.readyDesc":
      "Join our community and help build a valuable resource for all tech professionals and enthusiasts.",
    "contribute.viewEvents": "View events",
    "contribute.addEvent": "Add event",
    "contribute.publicApi": "Public API",
    "contribute.publicApiDesc":
      "Calendario.tech offers a public and open API that you can use for your own projects. The API is part of our open source ecosystem and provides access to tech events.",
    "contribute.openApi": "Open API",
    "contribute.openApiDesc":
      "Our API is completely open and can be accessed without authentication. Check the complete documentation at",
    "contribute.openData": "Open Data",
    "contribute.openDataDesc":
      "The entire database is versioned and available as a .db file in the project repository, allowing you to have full control over the data.",
    "contribute.openSourceBackend": "Open Source Backend",
    "contribute.openSourceBackendDesc":
      "The backend source code is also completely open. You can contribute, adapt, or create your own service based on it.",
    "contribute.exploreApi": "Explore API",
    "contribute.apiExamples": "API Usage Examples",
    "contribute.listAllEvents": "List all events",
    "contribute.listAllEventsDesc":
      "Returns the complete list of available events.",
    "contribute.responseExample": "Response example:",
    "contribute.filterByName": "Filter by name",
    "contribute.filterByNameDesc":
      "Search for events containing a word in the name.",
    "contribute.filterByLocation": "Filter by location",
    "contribute.filterByLocationDesc":
      "Search for events containing a term in the address field.",
    "contribute.filterByTags": "Filter by tags",
    "contribute.filterByTagsDesc":
      "Search for events associated with one or more tags.",
    "contribute.multipleTags": "Multiple tags:",
    "contribute.filterByType": "Filter by type",
    "contribute.filterByTypeDesc": "Search for online or in-person events.",
    "contribute.filterByPrice": "Filter by price",
    "contribute.filterByPriceDesc": "Search for free events:",
    "contribute.priceRange": "Or within a price range:",
    "contribute.filterByDate": "Filter by date",
    "contribute.filterByDateFrom": "Search for events from a specific date:",
    "contribute.filterByDateRange": "Or within a date range:",

    // Form validation errors
    "validation.orgName.min":
      "Organization name must have at least 2 characters",
    "validation.eventName.min": "Event name must have at least 3 characters",
    "validation.eventLanguage.required": "Please select a language",
    "validation.startDate.required": "Start date is required",
    "validation.startTime.format": "Invalid format, use HH:MM (ex: 13:30)",
    "validation.endDate.required": "End date is required",
    "validation.endTime.format": "Invalid format, use HH:MM (ex: 13:30)",
    "validation.address.min": "Address must have at least 10 characters",
    "validation.mapsLink.invalid":
      "The link must be a valid Google Maps address",
    "validation.eventLink.invalid": "Invalid event URL",
    "validation.tags.min": "Select at least one tag",
    "validation.eventEdition.required": "Event edition is required",
    "validation.costType.required": "Please select the cost type",
    "validation.costValue.required":
      "Cost value is required and cannot be negative for paid events",
    "validation.costCurrency.required": "Currency is required for paid events",
    "validation.bannerLink.invalid": "Invalid banner URL",
    "validation.description.min":
      "Description must have at least 10 characters",
    "validation.description.max":
      "Description cannot have more than 300 characters",
    "validation.recaptcha.required": "Please complete the reCAPTCHA",
    "validation.state.required": "State is required for in-person events",
    "validation.mapsLink.required": "Map link is required for in-person events",
    "validation.translation.costValue.required":
      "Cost value is required and cannot be negative for paid events in this translation",
    "validation.translation.costCurrency.required":
      "Currency is required for paid events in this translation",

    "index.basicInfo": "Basic Information",
    "index.address": "Address",
  },
  "es-es": {
    // Navbar
    "nav.contribute": "Contribuir",
    "nav.addEvent": "Añadir evento",

    // Index page
    "index.subtitle":
      "Encuentra los mejores eventos de tecnología cerca de ti, mantenidos por la comunidad para la comunidad.",
    "index.initiative": "Una iniciativa de whiteStone_dev",
    "index.clearDateFilter": "Borrar filtro de fecha",
    "index.eventsFound": "Eventos Encontrados",
    "index.event": "Evento",
    "index.events": "Eventos",
    "index.noEventsFound": "Ningún evento encontrado",
    "index.noEventsMessage":
      "No encontramos eventos con los filtros seleccionados.",
    "index.clearAllFilters": "Borrar todos los filtros",
    "index.filterTitle": "Filtrar eventos",
    "index.moreFilters": "Más filtros",
    "index.hideFilters": "Ocultar filtros",
    "index.searchEvents": "Buscar eventos",
    "index.searchEventsPlaceholder": "Escriba el nombre del evento...",
    "index.eventType": "Tipo de evento",
    "index.all": "Todos",
    "index.onlyFree": "Solo gratuitos",
    "index.location": "Ubicación",
    "index.locationPlaceholder": "Ciudad, estado o país",
    "index.tags": "Etiquetas",
    "index.organization": "Organización",
    "index.organizationPlaceholder": "Nombre de la organización",
    "index.cost": "Costo",
    "index.startDate": "Fecha de inicio",
    "index.endDate": "Fecha de término",
    "index.selectDate": "Seleccione una fecha",
    "index.paid": "Pago",
    "loading.events": "Cargando eventos...",

    // Event card
    "event.online": "En línea",
    "event.inPerson": "Presencial",
    "event.free": "Gratis",
    "event.register": "Detalles",
    "event.onlineEvent": "Evento en línea",
    "event.viewMap": "Ver en el mapa",
    "event.share": "Compartir",

    // Form steps titles
    "form.step.basicInfo": "Información Básica",
    "form.step.basicInfo.desc": "Nombre y edición del evento",
    "form.step.dateLocation": "Fecha y Ubicación",
    "form.step.dateLocation.desc": "Cuándo y dónde sucederá",
    "form.step.details": "Detalles del Evento",
    "form.step.details.desc": "Enlace e información adicional",
    "form.step.tags": "Etiquetas",
    "form.step.tags.desc": "Categoriza tu evento",
    "form.step.language": "Idioma",
    "form.step.language.desc": "Añade información en otros idiomas",
    "form.step.verification": "Verificación",
    "form.step.verification.desc": "Confirma que eres humano",
    "form.step.review": "Revisión",
    "form.step.review.desc": "Revisa todos los detalles",
    "form.step.success": "Evento enviado para aprobación",
    "form.step.success.desc":
      "¡Hemos recibido tu solicitud! Si todo está correcto, el evento estará disponible en la plataforma pronto.",

    // Form general
    "form.next": "Siguiente",
    "form.previous": "Atrás",
    "form.submit": "Enviar Evento",
    "form.step": "Paso",
    "form.of": "de",

    // Form fields
    "form.orgName": "Nombre de la Organización",
    "form.eventName": "Nombre del Evento",
    "form.eventEdition": "Edición del Evento",
    "form.startDate": "Fecha de inicio",
    "form.startTime": "Hora de inicio",
    "form.endDate": "Fecha de finalización",
    "form.endTime": "Hora de finalización",
    "form.online": "Evento en línea",
    "form.onlineDesc":
      "Marque esta opción si el evento será realizado en línea",
    "form.address": "Dirección",
    "form.mapsLink": "Enlace de Google Maps",
    "form.mapsLinkDesc": "URL de Google Maps para la ubicación",
    "form.eventLink": "Enlace del Evento",
    "form.eventLinkDesc": "URL para inscripción o página oficial del evento",
    "form.cost": "Costo",
    "form.bannerLink": "Enlace del Banner",
    "form.bannerLinkDesc":
      "URL para la imagen del banner del evento (recomendado: 800x400px)",
    "form.description": "Descripción Corta",
    "form.descriptionDesc": "Una breve descripción sobre el evento",
    "form.tagsLabel": "Etiquetas",
    "form.tagsDesc": "Seleccione las etiquetas que mejor describen el evento",
    "form.selectDate": "Seleccione una fecha",
    "form.verification": "Verificación",
    "form.verificationDesc": "Por favor, complete la verificación de seguridad",
    "form.reviewTitle": "Revise los detalles de su evento",
    "form.language": "Idioma del evento",
    "form.language.primary": "Principal",
    "form.language.translation": "Traducción",
    "form.addLanguage": "Añadir idioma",
    "form.selectLanguage": "Seleccione un idioma",
    "form.currency": "Moneda",
    "form.value": "Valor",
    "form.state": "Estado",
    "form.selectState": "Seleccione un estado",
    "form.selectCurrency": "Seleccione una moneda",
    "event.notProvided": "No proporcionado",

    // Event details
    "event.basicInfo": "Información Básica",
    "event.dateLocation": "Fecha y Ubicación",
    "event.details": "Detalles del Evento",
    "event.organization": "Organización:",
    "event.event": "Evento:",
    "event.edition": "Edición:",
    "event.start": "Inicio:",
    "event.end": "Fin:",
    "event.format": "Formato:",
    "event.addressLabel": "Dirección:",
    "event.link": "Enlace:",
    "event.cost": "Costo:",
    "event.description": "Descripción:",
    "event.banner": "Banner:",

    // Toast messages
    "toast.eventSubmitted": "¡Evento enviado!",
    "toast.eventSubmittedDesc": "Su evento ha sido enviado para aprobación.",

    // Submit dialog
    "dialog.title": "Enviar nuevo evento",
    "dialog.description":
      "Complete el formulario abajo con los detalles del evento tech que le gustaría añadir al calendario.",

    // Footer
    "footer.maintained": "Mantenido por la comunidad para la comunidad",
    "footer.events": "Eventos",
    "footer.contribute": "Contribuir",
    "footer.rights": "Todos los derechos reservados",
    "footer.initiative": "Una iniciativa de",
    "footer.github": "GitHub",
    "footer.linkedin": "LinkedIn",

    // Contribute page
    "contribute.title": "Contribuye al Calendario Tech",
    "contribute.subtitle":
      "Ayuda a mantener a la comunidad informada sobre los mejores eventos de tecnología cerca de ti.",
    "contribute.howTo": "Cómo contribuir",
    "contribute.addEvents": "Añadir Eventos",
    "contribute.addEventsDesc": "Comparte eventos que conoces con la comunidad",
    "contribute.addEventsContent":
      "¿Conoces algún evento de tecnología que no esté en nuestro calendario? Ayuda a mantener nuestra base de datos actualizada añadiendo nuevos eventos para que toda la comunidad pueda participar.",
    "contribute.region": "Mantén tu Región Actualizada",
    "contribute.regionDesc": "Sé un curador de eventos en tu región",
    "contribute.regionContent":
      "Puedes convertirte en un curador para tu región o ciudad, ayudando a mantener los eventos locales actualizados y asegurando que la comunidad no pierda ninguna oportunidad.",
    "contribute.learnMore": "Saber más",
    "contribute.code": "Contribuye al código",
    "contribute.codeDesc":
      "¡Calendario Tech es un proyecto de código abierto y necesitamos tu ayuda para mejorarlo! Si tienes conocimientos de desarrollo web, puedes contribuir de varias formas:",
    "contribute.reportBugs": "Reporta errores y problemas",
    "contribute.reportBugsDesc":
      "Si encontraste algún problema, abre un issue en nuestro repositorio de GitHub describiendo el error y cómo reproducirlo.",
    "contribute.implement": "Implementa nuevas funcionalidades",
    "contribute.implementDesc":
      "¿Tienes una idea para mejorar Calendario Tech? Haz un fork del repositorio, implementa tu funcionalidad y envía un Pull Request.",
    "contribute.docs": "Mejora la documentación",
    "contribute.docsDesc":
      "La documentación clara es fundamental. Ayuda a mejorar nuestras guías, tutoriales y documentación técnica.",
    "contribute.help": "Ayuda a otros colaboradores",
    "contribute.helpDesc":
      "Responde preguntas, revisa Pull Requests y comparte tu conocimiento con la comunidad.",
    "contribute.github": "Contribuye en GitHub",
    "contribute.ready": "¿Listo para empezar?",
    "contribute.readyDesc":
      "Únete a nuestra comunidad y ayuda a construir un recurso valioso para todos los profesionales y entusiastas de la tecnología.",
    "contribute.viewEvents": "Ver eventos",
    "contribute.addEvent": "Añadir evento",
    "contribute.publicApi": "API Pública",
    "contribute.publicApiDesc":
      "Calendario.tech ofrece una API pública y abierta que puedes usar para tus propios proyectos. La API es parte de nuestro ecosistema de código abierto y proporciona acceso a eventos de tecnología.",
    "contribute.openApi": "API Abierta",
    "contribute.openApiDesc":
      "Nuestra API es completamente abierta y puede ser accedida sin autenticación. Consulta la documentación completa en",
    "contribute.openData": "Datos Abiertos",
    "contribute.openDataDesc":
      "Toda la base de datos está versionada y disponible como archivo .db en el repositorio del proyecto, permitiéndote tener control total sobre los datos.",
    "contribute.openSourceBackend": "Backend de Código Abierto",
    "contribute.openSourceBackendDesc":
      "El código fuente del backend también es completamente abierto. Puedes contribuir, adaptar o crear tu propio servicio basado en él.",
    "contribute.exploreApi": "Explorar API",
    "contribute.apiExamples": "Ejemplos de uso de la API",
    "contribute.listAllEvents": "Listar todos los eventos",
    "contribute.listAllEventsDesc":
      "Devuelve la lista completa de eventos disponibles.",
    "contribute.responseExample": "Ejemplo de respuesta:",
    "contribute.filterByName": "Filtrar por nombre",
    "contribute.filterByNameDesc":
      "Buscar eventos que contengan una palabra en el nombre.",
    "contribute.filterByLocation": "Filtrar por ubicación",
    "contribute.filterByLocationDesc":
      "Buscar eventos que contengan un término en el campo de dirección.",
    "contribute.filterByTags": "Filtrar por etiquetas",
    "contribute.filterByTagsDesc":
      "Buscar eventos asociados con una o más etiquetas.",
    "contribute.multipleTags": "Múltiples etiquetas:",
    "contribute.filterByType": "Filtrar por tipo",
    "contribute.filterByTypeDesc": "Buscar eventos en línea o presenciales.",
    "contribute.filterByPrice": "Filtrar por precio",
    "contribute.filterByPriceDesc": "Buscar eventos gratuitos:",
    "contribute.priceRange": "O dentro de un rango de precios:",
    "contribute.filterByDate": "Filtrar por fecha",
    "contribute.filterByDateFrom":
      "Buscar eventos a partir de una fecha específica:",
    "contribute.filterByDateRange": "O dentro de un rango de fechas:",

    // Form validation errors
    "validation.orgName.min":
      "El nombre de la organización debe tener al menos 2 caracteres",
    "validation.eventName.min":
      "El nombre del evento debe tener al menos 3 caracteres",
    "validation.eventLanguage.required": "Por favor seleccione un idioma",
    "validation.startDate.required": "La fecha de inicio es obligatoria",
    "validation.startTime.format": "Formato inválido, use HH:MM (ej: 13:30)",
    "validation.endDate.required": "La fecha de finalización es obligatoria",
    "validation.endTime.format": "Formato inválido, use HH:MM (ej: 13:30)",
    "validation.address.min": "La dirección debe tener al menos 10 caracteres",
    "validation.mapsLink.invalid":
      "El enlace debe ser una dirección válida de Google Maps",
    "validation.eventLink.invalid": "URL del evento inválida",
    "validation.tags.min": "Seleccione al menos una etiqueta",
    "validation.eventEdition.required": "La edición del evento es obligatoria",
    "validation.costType.required": "Por favor seleccione el tipo de costo",
    "validation.costValue.required":
      "El valor del costo es obligatorio y no puede ser negativo para eventos pagos",
    "validation.costCurrency.required":
      "La moneda es obligatoria para eventos pagos",
    "validation.bannerLink.invalid": "URL del banner inválida",
    "validation.description.min":
      "La descripción debe tener al menos 10 caracteres",
    "validation.description.max":
      "La descripción no puede tener más de 300 caracteres",
    "validation.recaptcha.required": "Por favor complete el reCAPTCHA",
    "validation.state.required":
      "El estado es obligatorio para eventos presenciales",
    "validation.mapsLink.required":
      "El enlace del mapa es obligatorio para eventos presenciales",
    "validation.translation.costValue.required":
      "El valor del costo es obligatorio y no puede ser negativo para eventos pagos en esta traducción",
    "validation.translation.costCurrency.required":
      "La moneda es obligatoria para eventos pagos en esta traducción",

    "index.basicInfo": "Información Básica",
    "index.address": "Dirección",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt-br");

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
