from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.models.role import Role


DEFAULT_ROLES = [
    {
        "name": "Admin",
        "description": "Full system access",
    },
    {
        "name": "Manager",
        "description": "Operational management access",
    },
    {
        "name": "Staff",
        "description": "Limited operational access",
    },
]


USER_ROLE_ASSIGNMENTS = {
    "admin@dineops.com": "Admin",
    "manager@dineops.com": "Manager",
    "auth@dineops.com": "Staff",
}


def seed_roles(db: Session) -> None:
    # Create roles if they don't already exist
    for role_data in DEFAULT_ROLES:
        existing_role = (
            db.query(Role)
            .filter(Role.name == role_data["name"])
            .first()
        )

        if not existing_role:
            role = Role(**role_data)
            db.add(role)

    db.commit()


def assign_user_roles(db: Session) -> None:
    # Assign roles to existing users
    for email, role_name in USER_ROLE_ASSIGNMENTS.items():
        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            print(f"User not found: {email}")
            continue

        role = (
            db.query(Role)
            .filter(Role.name == role_name)
            .first()
        )

        if not role:
            print(f"Role not found: {role_name}")
            continue

        user.role_id = role.id

    db.commit()


if __name__ == "__main__":
    db = SessionLocal()

    try:
        seed_roles(db)
        assign_user_roles(db)

        print("Roles seeded and users assigned successfully.")

    finally:
        db.close()