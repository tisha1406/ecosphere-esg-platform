from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.social import (
    Department, Employee, EmployeeWellbeing,
    CsrInitiative, DiversityMetric, CsrStatusEnum,
)
from app.schemas.social import (
    DepartmentCreate,
    EmployeeCreate,
    WellbeingCreate, WellbeingUpdate,
    CsrCreate, CsrUpdate,
    DiversityCreate, DiversityUpdate,
)


class SocialRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Department ---
    async def create_department(self, data: DepartmentCreate) -> Department:
        obj = Department(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_department(self, id: UUID) -> Optional[Department]:
        result = await self.session.execute(
            select(Department).where(Department.id == id)
        )
        return result.scalars().first()

    # --- Employee ---
    async def create_employee(self, data: EmployeeCreate) -> Employee:
        obj = Employee(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_employee(self, id: UUID) -> Optional[Employee]:
        result = await self.session.execute(
            select(Employee).where(Employee.id == id)
        )
        return result.scalars().first()

    # --- EmployeeWellbeing ---
    async def create_wellbeing(self, data: WellbeingCreate) -> EmployeeWellbeing:
        obj = EmployeeWellbeing(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_wellbeing(self, id: UUID) -> Optional[EmployeeWellbeing]:
        result = await self.session.execute(
            select(EmployeeWellbeing).where(EmployeeWellbeing.id == id)
        )
        return result.scalars().first()

    async def get_wellbeings(
        self,
        skip: int = 0,
        limit: int = 10,
        employee_id: Optional[UUID] = None,
        company_id: Optional[str] = None,
    ) -> Tuple[List[EmployeeWellbeing], int]:
        query = select(EmployeeWellbeing)
        if employee_id:
            query = query.where(EmployeeWellbeing.employee_id == employee_id)
        if company_id:
            # Filter through Employee join
            query = (
                query
                .join(Employee, EmployeeWellbeing.employee_id == Employee.id)
                .where(Employee.company_id == company_id)
            )
        count_q = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_q)).scalar_one()
        result = await self.session.execute(query.offset(skip).limit(limit))
        return list(result.scalars().all()), total

    async def update_wellbeing(self, id: UUID, data: WellbeingUpdate) -> Optional[EmployeeWellbeing]:
        obj = await self.get_wellbeing(id)
        if obj:
            for k, v in data.model_dump(exclude_unset=True).items():
                setattr(obj, k, v)
            await self.session.commit()
            await self.session.refresh(obj)
        return obj

    async def delete_wellbeing(self, id: UUID) -> bool:
        obj = await self.get_wellbeing(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()
            return True
        return False

    async def get_avg_satisfaction(self, company_id: str) -> float:
        result = await self.session.execute(
            select(func.avg(EmployeeWellbeing.satisfaction_score))
            .join(Employee, EmployeeWellbeing.employee_id == Employee.id)
            .where(Employee.company_id == company_id)
        )
        return float(result.scalar_one_or_none() or 0.0)

    # --- CsrInitiative ---
    async def create_csr(self, data: CsrCreate) -> CsrInitiative:
        obj = CsrInitiative(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_csr(self, id: UUID) -> Optional[CsrInitiative]:
        result = await self.session.execute(
            select(CsrInitiative).where(CsrInitiative.id == id)
        )
        return result.scalars().first()

    async def get_csrs(
        self,
        skip: int = 0,
        limit: int = 10,
        status: Optional[CsrStatusEnum] = None,
    ) -> Tuple[List[CsrInitiative], int]:
        query = select(CsrInitiative)
        if status:
            query = query.where(CsrInitiative.status == status)
        count_q = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_q)).scalar_one()
        result = await self.session.execute(query.offset(skip).limit(limit))
        return list(result.scalars().all()), total

    async def update_csr(self, id: UUID, data: CsrUpdate) -> Optional[CsrInitiative]:
        obj = await self.get_csr(id)
        if obj:
            for k, v in data.model_dump(exclude_unset=True).items():
                setattr(obj, k, v)
            await self.session.commit()
            await self.session.refresh(obj)
        return obj

    async def delete_csr(self, id: UUID) -> bool:
        obj = await self.get_csr(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()
            return True
        return False

    async def get_csr_completion_rate(self) -> float:
        """Returns proportion of CSR initiatives in 'completed' status."""
        total_result = await self.session.execute(
            select(func.count()).select_from(CsrInitiative)
        )
        total = total_result.scalar_one() or 0
        if total == 0:
            return 0.0
        completed_result = await self.session.execute(
            select(func.count())
            .select_from(CsrInitiative)
            .where(CsrInitiative.status == CsrStatusEnum.completed)
        )
        completed = completed_result.scalar_one() or 0
        return completed / total

    # --- DiversityMetric ---
    async def create_diversity(self, data: DiversityCreate) -> DiversityMetric:
        obj = DiversityMetric(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_diversity(self, id: UUID) -> Optional[DiversityMetric]:
        result = await self.session.execute(
            select(DiversityMetric).where(DiversityMetric.id == id)
        )
        return result.scalars().first()

    async def get_diversities(
        self,
        skip: int = 0,
        limit: int = 10,
        department_id: Optional[UUID] = None,
        period: Optional[str] = None,
    ) -> Tuple[List[DiversityMetric], int]:
        query = select(DiversityMetric)
        if department_id:
            query = query.where(DiversityMetric.department_id == department_id)
        if period:
            query = query.where(DiversityMetric.period == period)
        count_q = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_q)).scalar_one()
        result = await self.session.execute(query.offset(skip).limit(limit))
        return list(result.scalars().all()), total

    async def update_diversity(self, id: UUID, data: DiversityUpdate) -> Optional[DiversityMetric]:
        obj = await self.get_diversity(id)
        if obj:
            for k, v in data.model_dump(exclude_unset=True).items():
                setattr(obj, k, v)
            await self.session.commit()
            await self.session.refresh(obj)
        return obj

    async def delete_diversity(self, id: UUID) -> bool:
        obj = await self.get_diversity(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()
            return True
        return False

    async def get_avg_inclusion(self, company_id: str) -> float:
        """Average inclusion score across departments belonging to company_id."""
        result = await self.session.execute(
            select(func.avg(DiversityMetric.inclusion_score))
            .join(Department, DiversityMetric.department_id == Department.id)
            .where(Department.company_id == company_id)
        )
        return float(result.scalar_one_or_none() or 0.0)
