from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import AuditMixin


class Notification(Base, AuditMixin):
    """User notifications — owned by Dashboard module."""
    __tablename__ = "notifications"

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    message = Column(String(1000), nullable=False)
    source_table = Column(String(100), nullable=False, default="system")
    is_read = Column(Boolean, nullable=False, default=False, index=True)

    user = relationship("User")
