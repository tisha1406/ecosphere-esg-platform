import enum
from sqlalchemy import Column, String, Enum
from app.core.database import Base
from app.models.base import AuditMixin

class UserRole(str, enum.Enum):
    admin = "admin"
    esg_manager = "esg_manager"
    environmental_officer = "environmental_officer"
    social_officer = "social_officer"
    governance_officer = "governance_officer"
    employee = "employee"

class User(Base, AuditMixin):
    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum(UserRole, name="user_role_enum"), nullable=False)
