"""add states and currencies

Revision ID: 4ccbc61c2f07
Revises: 12fe86290847
Create Date: 2025-05-25 23:25:59.586199

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4ccbc61c2f07"
down_revision: Union[str, None] = "12fe86290847"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Operações sobre a tabela "events"
    with op.batch_alter_table("events") as batch_op:
        # 1. Adiciona a coluna state (nullable)
        batch_op.add_column(
            sa.Column(
                "state",
                sa.Enum(
                    "AC",
                    "AL",
                    "AP",
                    "AM",
                    "BA",
                    "CE",
                    "DF",
                    "ES",
                    "GO",
                    "MA",
                    "MT",
                    "MS",
                    "MG",
                    "PA",
                    "PB",
                    "PR",
                    "PE",
                    "PI",
                    "RJ",
                    "RN",
                    "RS",
                    "RO",
                    "RR",
                    "SC",
                    "SP",
                    "SE",
                    "TO",
                    name="states",
                ),
                nullable=True,
            )
        )

        # 2. Adiciona a coluna is_free
        batch_op.add_column(
            sa.Column(
                "is_free",
                sa.Boolean(),
                nullable=True,
                comment="Indicates if the event is free or not",
                default=True,
            )
        )

    # Fora do batch, atualiza os registros
    op.execute("UPDATE events SET state = 'SC' WHERE state IS NULL")

    # 3. Torna a coluna state NOT NULL
    with op.batch_alter_table("events") as batch_op:
        batch_op.alter_column("state", nullable=False)

    # 4. Adiciona a coluna currency em event_intl
    with op.batch_alter_table("event_intl") as batch_op:
        batch_op.add_column(
            sa.Column(
                "currency",
                sa.Enum("BRL", "USD", "EUR", "AUD", "CAD", name="currencies"),
                nullable=True,
            )
        )


def downgrade() -> None:
    op.drop_column("events", "is_free")
    op.drop_column("events", "state")
    op.drop_column("event_intl", "currency")
