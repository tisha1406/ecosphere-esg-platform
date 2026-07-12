from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.master import Department, Category, EmissionFactor, ProductESGProfile, EnvironmentalGoal
from app.schemas.master import (
    DepartmentCreate, DepartmentUpdate, DepartmentRead,
    CategoryCreate, CategoryUpdate, CategoryRead,
    EmissionFactorCreate, EmissionFactorUpdate, EmissionFactorRead,
    ProductESGProfileCreate, ProductESGProfileUpdate, ProductESGProfileRead,
    EnvironmentalGoalCreate, EnvironmentalGoalUpdate, EnvironmentalGoalRead
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/v1/master", tags=["Master"])

# --- Departments ---
@router.post("/departments", response_model=DepartmentRead, status_code=status.HTTP_201_CREATED)
async def create_department(data: DepartmentCreate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = Department(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/departments", response_model=List[DepartmentRead])
async def get_departments(db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    result = await db.execute(select(Department))
    return result.scalars().all()

@router.get("/departments/{id}", response_model=DepartmentRead)
async def get_department(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(Department, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_obj

@router.put("/departments/{id}", response_model=DepartmentRead)
async def update_department(id: UUID, data: DepartmentUpdate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(Department, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Department not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.delete("/departments/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(Department, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Department not found")
    await db.delete(db_obj)
    await db.commit()

# --- Categories ---
@router.post("/categories", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(data: CategoryCreate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = Category(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/categories", response_model=List[CategoryRead])
async def get_categories(db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    result = await db.execute(select(Category))
    return result.scalars().all()

@router.get("/categories/{id}", response_model=CategoryRead)
async def get_category(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(Category, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_obj

@router.put("/categories/{id}", response_model=CategoryRead)
async def update_category(id: UUID, data: CategoryUpdate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(Category, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.delete("/categories/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(Category, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(db_obj)
    await db.commit()

# --- EmissionFactors ---
@router.post("/emission-factors", response_model=EmissionFactorRead, status_code=status.HTTP_201_CREATED)
async def create_emission_factor(data: EmissionFactorCreate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = EmissionFactor(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/emission-factors", response_model=List[EmissionFactorRead])
async def get_emission_factors(db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    result = await db.execute(select(EmissionFactor))
    return result.scalars().all()

@router.get("/emission-factors/{id}", response_model=EmissionFactorRead)
async def get_emission_factor(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(EmissionFactor, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="EmissionFactor not found")
    return db_obj

@router.put("/emission-factors/{id}", response_model=EmissionFactorRead)
async def update_emission_factor(id: UUID, data: EmissionFactorUpdate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(EmissionFactor, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="EmissionFactor not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.delete("/emission-factors/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_emission_factor(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(EmissionFactor, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="EmissionFactor not found")
    await db.delete(db_obj)
    await db.commit()

# --- ProductESGProfiles ---
@router.post("/product-esg-profiles", response_model=ProductESGProfileRead, status_code=status.HTTP_201_CREATED)
async def create_product_esg_profile(data: ProductESGProfileCreate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = ProductESGProfile(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/product-esg-profiles", response_model=List[ProductESGProfileRead])
async def get_product_esg_profiles(db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    result = await db.execute(select(ProductESGProfile))
    return result.scalars().all()

@router.get("/product-esg-profiles/{id}", response_model=ProductESGProfileRead)
async def get_product_esg_profile(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(ProductESGProfile, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="ProductESGProfile not found")
    return db_obj

@router.put("/product-esg-profiles/{id}", response_model=ProductESGProfileRead)
async def update_product_esg_profile(id: UUID, data: ProductESGProfileUpdate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(ProductESGProfile, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="ProductESGProfile not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.delete("/product-esg-profiles/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product_esg_profile(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(ProductESGProfile, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="ProductESGProfile not found")
    await db.delete(db_obj)
    await db.commit()

# --- EnvironmentalGoals ---
@router.post("/environmental-goals", response_model=EnvironmentalGoalRead, status_code=status.HTTP_201_CREATED)
async def create_environmental_goal(data: EnvironmentalGoalCreate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = EnvironmentalGoal(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/environmental-goals", response_model=List[EnvironmentalGoalRead])
async def get_environmental_goals(db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    result = await db.execute(select(EnvironmentalGoal))
    return result.scalars().all()

@router.get("/environmental-goals/{id}", response_model=EnvironmentalGoalRead)
async def get_environmental_goal(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(EnvironmentalGoal, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="EnvironmentalGoal not found")
    return db_obj

@router.put("/environmental-goals/{id}", response_model=EnvironmentalGoalRead)
async def update_environmental_goal(id: UUID, data: EnvironmentalGoalUpdate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(EnvironmentalGoal, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="EnvironmentalGoal not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.delete("/environmental-goals/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_environmental_goal(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(EnvironmentalGoal, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="EnvironmentalGoal not found")
    await db.delete(db_obj)
    await db.commit()

from app.models.scoring import DepartmentScore
from app.schemas.scoring import DepartmentScoreCreate, DepartmentScoreRead
# --- DepartmentScores ---
@router.post("/department-scores", response_model=DepartmentScoreRead, status_code=status.HTTP_201_CREATED)
async def create_department_score(data: DepartmentScoreCreate, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = DepartmentScore(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/department-scores", response_model=List[DepartmentScoreRead])
async def get_department_scores(db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    result = await db.execute(select(DepartmentScore))
    return result.scalars().all()

@router.get("/department-scores/{id}", response_model=DepartmentScoreRead)
async def get_department_score(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(DepartmentScore, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="DepartmentScore not found")
    return db_obj

@router.delete("/department-scores/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department_score(id: UUID, db: AsyncSession = Depends(get_db), current_user: Any = Depends(get_current_user)):
    db_obj = await db.get(DepartmentScore, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="DepartmentScore not found")
    await db.delete(db_obj)
    await db.commit()
