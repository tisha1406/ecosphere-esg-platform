import enum
from sqlalchemy import Column, String, Enum, Integer, DateTime
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

    # Incremented on every refresh-token rotation and on logout.
    # The current token_version is embedded in every issued refresh token.
    # Any refresh token with an older ver is immediately rejected (replay protection).
    token_version = Column(Integer, nullable=False, default=0, server_default="0")

    # Hashed password-reset token (bcrypt). Nullified after single use.
    password_reset_token = Column(String(255), nullable=True, default=None)

    # Absolute expiry timestamp for the above reset token (15-minute window).
    password_reset_expires_at = Column(DateTime(timezone=True), nullable=True, default=None)
