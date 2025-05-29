import os
from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from src.models import db

# Load Alembic config and logging
config = context.config
fileConfig(config.config_file_name)

# SQLAlchemy model metadata
target_metadata = db.metadata


def run_migrations_online():
    database_url = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
    if not database_url:
        raise EnvironmentError("DATABASE_URL is not set")

    connectable = create_engine(database_url, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


run_migrations_online()
