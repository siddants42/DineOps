from fastapi import Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.models.user import User


def _require_role(current_user: User, allowed: set[str], message: str) -> User:
    if not current_user.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User has no role assigned",
        )
    if current_user.role.name not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message,
        )
    return current_user


def require_staff(current_user: User = Depends(get_current_user)) -> User:
    return _require_role(current_user, {"Admin", "Manager", "Staff"}, "Operational access required")


def require_manager(current_user: User = Depends(get_current_user)) -> User:
    return _require_role(current_user, {"Admin", "Manager"}, "Manager access required")


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    return _require_role(current_user, {"Admin"}, "Admin access required")
