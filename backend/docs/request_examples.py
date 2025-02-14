request_examples = {
    "exemplo_sem_filtros": {
        "summary": "Obter todos os eventos (sem filtros)",
        "value": "/api/data_events",
    },
    "exemplo_filtro_tags": {
        "summary": "Filtrar por tags 'python' e 'django'",
        "value": "/api/data_events?tags=python&tags=django",
    },
    "exemplo_filtro_nome": {
        "summary": "Filtrar por nome contendo 'Python'",
        "value": "/api/data_events?name=Python",
    },
    "exemplo_filtro_online_gratis": {
        "summary": "Filtrar por eventos online e gratuitos",
        "value": "/api/data_events?online=true&price_type=free",
    },
    "exemplo_filtro_preco_faixa": {
        "summary": "Filtrar por eventos pagos entre R$20 e R$50",
        "value": "/api/data_events?price_type=paid&price_min=20&price_max=50",
    },
    "exemplo_filtro_data_apartir": {
        "summary": "Filtrar por eventos a partir de 10 de abril de 2025",
        "value": "/api/data_events?date_from=2025-04-10",
    },
    "exemplo_filtro_intervalo_datas": {
        "summary": "Filtrar eventos entre 9 e 11 de abril de 2025",
        "value": "/api/data_events?date_start_range=2025-04-09&date_end_range=2025-04-11",
    },
    "exemplo_filtro_endereco": {
        "summary": "Filtrar eventos com endereço contendo 'Paulista'",
        "value": "/api/data_events?address=Paulista",
    },
    "exemplo_filtro_organizacao": {
        "summary": "Filtrar eventos da organização 'TechCorp'",
        "value": "/api/data_events?org=TechCorp",
    },
}
