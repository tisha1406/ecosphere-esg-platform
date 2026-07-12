from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import (
    verify_password, get_password_hash,
    create_access_token, create_refresh_token,
    create_password_reset_token, decode_token,
    login_rate_limiter, hash_token_sha256, verify_token_sha256,
)
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    UserCreate, UserRead, UserLogin, TokenRead,
    ForgotPasswordRequest, ResetPasswordRequest
)
from app.schemas.common import ResponseEnvelope


router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


def _refresh_cookie_kwargs(max_age_seconds: int, secure: bool) -> dict:
    """Return common secure-cookie kwargs for the refresh token."""
    return dict(
        key="refresh_token",
        httponly=True,
        secure=secure,
        samesite="strict",
        max_age=max_age_seconds,
    )


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
        role=user_in.role,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return ResponseEnvelope(success=True, data=user, message="Registration successful")


@router.post("/login", response_model=ResponseEnvelope[TokenRead])
async def login(
    response: Response,
    request: Request,
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    # ---------- Rate limiting ----------
    client_ip = request.client.host if request.client else "unknown"
    if login_rate_limiter.is_rate_limited(client_ip, credentials.email):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please wait 15 minutes and try again.",
        )

    # ---------- Authenticate ----------
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalars().first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        login_rate_limiter.record_failure(client_ip, credentials.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )

    # ---------- Issue tokens ----------
    login_rate_limiter.clear(client_ip, credentials.email)

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value}
    )
    refresh_token = create_refresh_token(
        data={"sub": user.email},
        token_version=user.token_version,
        remember_me=credentials.remember_me,
    )

    # Determine cookie lifetime
    remember_me_days = 30 if credentials.remember_me else 7
    max_age = remember_me_days * 24 * 60 * 60

    response.set_cookie(
        value=refresh_token,
        **_refresh_cookie_kwargs(max_age, secure=request.url.scheme == "https")
    )

    return ResponseEnvelope(
        success=True,
        data=TokenRead(access_token=access_token),
        message="Login successful",
    )


@router.post("/refresh", response_model=ResponseEnvelope[TokenRead])
async def refresh(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    email = payload.get("sub")
    token_ver = payload.get("ver")

    if not email or token_ver is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
        )

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    # ---------- Replay protection ----------
    if token_ver != user.token_version:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been invalidated",
        )

    # ---------- Rotate token ----------
    user.token_version += 1
    await db.commit()

    # Re-fetch user to ensure we read the committed token_version
    result2 = await db.execute(select(User).where(User.email == email))
    user = result2.scalars().first()

    new_access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value}
    )
    new_refresh_token = create_refresh_token(
        data={"sub": user.email},
        token_version=user.token_version,
    )

    # Preserve the original cookie lifetime by reading remaining expiry from payload
    exp = payload.get("exp", 0)
    remaining = max(0, int(exp - datetime.now(timezone.utc).timestamp()))
    response.set_cookie(
        value=new_refresh_token,
        **_refresh_cookie_kwargs(remaining, secure=request.url.scheme == "https")
    )

    return ResponseEnvelope(
        success=True,
        data=TokenRead(access_token=new_access_token),
        message="Token refreshed",
    )


@router.post("/logout", response_model=ResponseEnvelope[dict])
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Invalidate all existing refresh tokens for this user by bumping token_version.
    Also clears the HttpOnly refresh-token cookie.
    """
    current_user.token_version += 1
    await db.commit()

    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=True,
        samesite="strict",
    )
    return ResponseEnvelope(success=True, data={}, message="Logged out successfully")


@router.post("/forgot-password", response_model=ResponseEnvelope[dict])
async def forgot_password(
    req: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate and store a single-use, 15-minute password-reset token.
    In production this would be emailed; for hackathon it is returned in the
    response body and printed to the server console.
    """
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalars().first()

    # Always return success to avoid user enumeration
    if not user:
        return ResponseEnvelope(
            success=True,
            data={},
            message="If that email exists, a reset link has been sent.",
        )

    # Issue a signed reset token, store its hash + expiry in the DB
    plain_token = create_password_reset_token(user.email)
    user.password_reset_token = hash_token_sha256(plain_token)
    user.password_reset_expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=15
    )
    await db.commit()

    print(f"[HACKATHON PASSWORD RESET] token for {req.email}: {plain_token}")

    return ResponseEnvelope(
        success=True,
        data={"reset_token": plain_token},          # returned for hackathon testing
        message="Password reset token issued (see server console in production)",
    )


@router.post("/reset-password", response_model=ResponseEnvelope[dict])
async def reset_password(
    req: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    # Decode and type-check the token
    payload = decode_token(req.token)
    if not payload or payload.get("type") != "pwd_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token",
        )

    email = payload.get("sub")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # ---------- Single-use & expiry check ----------
    if not user.password_reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token has already been used or was never issued",
        )

    now_utc = datetime.now(timezone.utc)
    # SQLite returns naive datetimes; normalise to UTC for comparison
    expires_at = user.password_reset_expires_at
    if expires_at is not None and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at is None or expires_at <= now_utc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset token has expired",
        )

    if not verify_token_sha256(req.token, user.password_reset_token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token",
        )

    # ---------- Perform reset ----------
    user.hashed_password = get_password_hash(req.new_password)
    # Invalidate the token immediately (single-use)
    user.password_reset_token = None
    user.password_reset_expires_at = None
    # Bump token_version so all existing sessions are also invalidated
    user.token_version += 1
    await db.commit()

    return ResponseEnvelope(success=True, data={}, message="Password reset successful")


@router.get("/me", response_model=ResponseEnvelope[UserRead])
async def me(current_user: User = Depends(get_current_user)):
    return ResponseEnvelope(success=True, data=current_user, message="Profile retrieved")
