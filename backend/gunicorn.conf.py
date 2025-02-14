"""Gunicorn configuration file."""

import multiprocessing

# Definições básicas
workers = multiprocessing.cpu_count() * 2 + 1  # Número recomendado de workers
bind = "0.0.0.0:8000"  # Endereço e porta para o Gunicorn
timeout = 120  # Timeout para requisições (segundos)
loglevel = "info"  # Nível de log (info, debug, warning, error, critical)

# Para desenvolvimento, você pode querer um worker para facilitar o debugging
# workers = 1

# Opções adicionais (veja a documentação do Gunicorn para mais detalhes)
# worker_class = 'sync' # ou 'gevent', 'eventlet', 'tornado', 'gthread' (sync é o padrão e geralmente bom)
# threads = 1 # Para worker_class='gthread' você pode usar threads
# backlog = 2048 # Tamanho do backlog de conexões pendentes
# reload = False # Para reload automático de código em desenvolvimento (desativar em produção!)
