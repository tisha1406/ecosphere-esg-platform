from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import (
    verify_password, get_password_hash,
    create_access_token, create_refresh_token, decode_token
)
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    UserCreate, UserRead, UserLogin, TokenRead,
    ForgotPasswordRequest, ResetPasswordRequest
)
from app.schemas.common import ResponseEnvelope

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

@router.post("/register", response_model=ResponseEnvelope[UserRead])
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        role=user_in.role
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return ResponseEnvelope(success=True, data=user, message="Registration successful")

@router.post("/login", response_model=ResponseEnvelope[TokenRead])
async def login(
    response: Response,
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalars().first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    # Set httpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60, # 7 days
    )
    
    return ResponseEnvelope(
        success=True,
        data=TokenRead(access_token=access_token),
        message="Login successful"
    )

@router.post("/refresh", response_model=ResponseEnvelope[TokenRead])
async def refresh(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing"
        )
        
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
        
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims"
        )
        
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
        
    new_access_token = create_access_token(data={"sub": user.email, "role": user.role.value})
    return ResponseEnvelope(
        success=True,
        data=TokenRead(access_token=new_access_token),
        message="Token refreshed"
    )

@router.post("/forgot-password", response_model=ResponseEnvelope[dict])
async def forgot_password(req: ForgotPasswordRequest):
    print(f"[HACKATHON EMAIL SERVICE] Forgot password request for {req.email}")
    return ResponseEnvelope(success=True, data={}, message="Password reset link sent to email")

@router.post("/reset-password", response_model=ResponseEnvelope[dict])
async def reset_password(req: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    payload = decode_token(req.token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
        
    email = payload.get("sub")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    user.hashed_password = get_password_hash(req.new_password)
    await db.commit()
    return ResponseEnvelope(success=True, data={}, message="Password reset successful")

@router.get("/me", response_model=ResponseEnvelope[UserRead])
async def me(current_user: User = Depends(get_current_user)):
    return ResponseEnvelope(success=True, data=current_user, message="Profile retrieved")
