"""add status to event

Revision ID: 12fe86290847
Revises: 91302d5bd571
Create Date: 2025-05-22 23:41:13.586291

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "12fe86290847"
down_revision: Union[str, None] = "91302d5bd571"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "events",
        sa.Column(
            "status",
            sa.Enum("requested", "approved", "declined", name="event_status"),
            nullable=False,
            server_default="requested",
        ),
    )


def downgrade() -> None:
    op.drop_column("events", "status")
