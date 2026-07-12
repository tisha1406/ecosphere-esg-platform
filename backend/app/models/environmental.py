import enum
from sqlalchemy import Column, String, Float, Enum, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.models.base import AuditMixin

class ScopeEnum(str, enum.Enum):
    scope_1 = "scope_1"
    scope_2 = "scope_2"
    scope_3 = "scope_3"

class EnergyTypeEnum(str, enum.Enum):
    electricity = "electricity"
    gas = "gas"
    renewable = "renewable"
    other = "other"

class WasteTypeEnum(str, enum.Enum):
    recycled = "recycled"
    landfill = "landfill"
    composted = "composted"
    hazardous = "hazardous"

class Company(Base, AuditMixin):
    __tablename__ = "companies"
    name = Column(String, nullable=False)
    
    carbon_emissions = relationship("CarbonEmission", back_populates="company")
    waste_trackings = relationship("WasteTracking", back_populates="company")
    facilities = relationship("Facility", back_populates="company")

class Facility(Base, AuditMixin):
    __tablename__ = "facilities"
    name = Column(String, nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    
    company = relationship("Company", back_populates="facilities")
    energy_usages = relationship("EnergyUsage", back_populates="facility")

class CarbonEmission(Base, AuditMixin):
    __tablename__ = "carbon_emissions"
    date = Column(Date, nullable=False, index=True)
    source = Column(String, nullable=False)
    scope = Column(Enum(ScopeEnum), nullable=False, index=True)
    value_tco2e = Column(Float, nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, index=True)

    company = relationship("Company", back_populates="carbon_emissions")

class EnergyUsage(Base, AuditMixin):
    __tablename__ = "energy_usage"
    date = Column(Date, nullable=False, index=True)
    energy_type = Column(Enum(EnergyTypeEnum), nullable=False, index=True)
    kwh_consumed = Column(Float, nullable=False)
    facility_id = Column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False, index=True)

    facility = relationship("Facility", back_populates="energy_usages")

class WasteTracking(Base, AuditMixin):
    __tablename__ = "waste_tracking"
    date = Column(Date, nullable=False, index=True)
    waste_type = Column(Enum(WasteTypeEnum), nullable=False, index=True)
    kg_recycled = Column(Float, nullable=False, default=0.0)
    kg_landfill = Column(Float, nullable=False, default=0.0)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, index=True)

    company = relationship("Company", back_populates="waste_trackings")
