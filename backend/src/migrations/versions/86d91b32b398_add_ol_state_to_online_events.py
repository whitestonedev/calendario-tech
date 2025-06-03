"""add OL state to Online events

Revision ID: 86d91b32b398
Revises: ecf0a0c53a6d
Create Date: 2025-05-30 02:00:21.495776

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "86d91b32b398"
down_revision: Union[str, None] = "ecf0a0c53a6d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Criar um novo tipo enum com o valor OL
    op.execute("ALTER TABLE events ALTER COLUMN state TYPE VARCHAR")
    op.execute("DROP TYPE states")
    op.execute(
        "CREATE TYPE states AS ENUM ('AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO', 'OL')"
    )
    op.execute("ALTER TABLE events ALTER COLUMN state TYPE states USING state::states")


def downgrade() -> None:
    """Downgrade schema."""
    # Remover o valor OL do enum
    op.execute("ALTER TABLE events ALTER COLUMN state TYPE VARCHAR")
    op.execute("DROP TYPE states")
    op.execute(
        "CREATE TYPE states AS ENUM ('AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')"
    )
    op.execute("ALTER TABLE events ALTER COLUMN state TYPE states USING state::states")
