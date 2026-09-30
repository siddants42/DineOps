from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_admin
from app.db.session import get_db
from app.models.role import Role
from app.models.user import User
from app.schemas.role import RoleResponse

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get("/", response_model=list[RoleResponse])
def get_roles(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(Role).order_by(Role.id).all()
