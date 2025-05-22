"""Initial migration"""

from alembic import op
import sqlalchemy as sa


# Revision identifiers
revision = "91302d5bd571"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "events",
        sa.Column("id", sa.Integer, primary_key=True, nullable=False),
        sa.Column("organization_name", sa.String, nullable=False),
        sa.Column("event_name", sa.String, nullable=False),
        sa.Column("start_datetime", sa.DateTime, nullable=False),
        sa.Column("end_datetime", sa.DateTime, nullable=False),
        sa.Column("address", sa.String, nullable=True),
        sa.Column("maps_link", sa.String, nullable=True),
        sa.Column("online", sa.Boolean, nullable=True),
        sa.Column("event_link", sa.String, nullable=True),
    )

    op.create_table(
        "tags",
        sa.Column("id", sa.Integer, primary_key=True, nullable=False),
        sa.Column("name", sa.String, nullable=False, unique=True),
    )

    op.create_table(
        "event_intl",
        sa.Column("id", sa.Integer, primary_key=True, nullable=False),
        sa.Column(
            "event_id",
            sa.Integer,
            sa.ForeignKey("events.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("lang", sa.String, nullable=False),
        sa.Column("event_edition", sa.String, nullable=True),
        sa.Column("cost", sa.String, nullable=True),
        sa.Column("banner_link", sa.String, nullable=True),
        sa.Column("short_description", sa.String, nullable=True),
    )

    op.create_table(
        "event_tags",
        sa.Column("id", sa.Integer, primary_key=True, nullable=False),
        sa.Column(
            "event_id",
            sa.Integer,
            sa.ForeignKey("events.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "tag_id",
            sa.Integer,
            sa.ForeignKey("tags.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.UniqueConstraint("event_id", "tag_id", name="uq_event_tag"),
    )


def downgrade():
    op.drop_table("event_tags")
    op.drop_table("event_intl")
    op.drop_table("tags")
    op.drop_table("events")
