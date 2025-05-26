"""update cost type

Revision ID: dab9d9abb4a0
Revises: 4ccbc61c2f07
Create Date: 2025-05-26 00:11:48.911124

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "dab9d9abb4a0"
down_revision: Union[str, None] = "4ccbc61c2f07"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("event_intl", schema=None) as batch_op:
        batch_op.alter_column(
            "cost",
            existing_type=sa.String(),
            type_=sa.Float(),
            existing_nullable=True,
        )


def downgrade() -> None:
    with op.batch_alter_table("event_intl", schema=None) as batch_op:
        batch_op.alter_column(
            "cost",
            existing_type=sa.Float(),
            type_=sa.String(),
            existing_nullable=True,
        )
