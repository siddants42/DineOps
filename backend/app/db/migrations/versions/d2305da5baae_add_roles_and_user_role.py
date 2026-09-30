"""add roles and user role

Revision ID: d2305da5baae
Revises: 7f330b241420
Create Date: 2026-08-21 23:15:32.817749

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d2305da5baae"
down_revision: Union[str, Sequence[str], None] = "7f330b241420"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_roles_id"),
        "roles",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_roles_name"),
        "roles",
        ["name"],
        unique=True,
    )

    op.add_column(
        "users",
        sa.Column("role_id", sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "role_id")

    op.drop_index(
        op.f("ix_roles_name"),
        table_name="roles",
    )
     
    op.drop_index(
        op.f("ix_roles_id"),
        table_name="roles",
    )

    op.drop_table("roles")