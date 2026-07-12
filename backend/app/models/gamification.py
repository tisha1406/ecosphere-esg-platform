from sqlalchemy import Column, String, Integer, Text
from app.core.database import Base
from app.models.base import AuditMixin


class Badge(Base, AuditMixin):
    __tablename__ = "badges"

    name = Column(String(255), nullable=False, unique=True, index=True)
    criteria = Column(Text, nullable=False)
    icon = Column(String(255), nullable=False)
    points_value = Column(Integer, nullable=False, default=0)
