"""add user role foreign key

Revision ID: d217de2f4f86
Revises: d2305da5baae
Create Date: 2026-08-22 21:59:10.550010

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "d217de2f4f86"
down_revision: Union[str, Sequence[str], None] = "d2305da5baae"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_foreign_key(
        None,
        "users",
        "roles",
        ["role_id"],
        ["id"],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(
        None,
        "users",
        type_="foreignkey",
    )