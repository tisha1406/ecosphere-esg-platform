import time
import threading
import hashlib
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import bcrypt
from jose import JWTError, jwt
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def hash_token_sha256(token: str) -> str:
    """SHA-256 fingerprint for storing long tokens (e.g. JWT reset tokens).
    Bcrypt is limited to 72 bytes which JWT strings exceed."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def verify_token_sha256(plain_token: str, stored_hash: str) -> bool:
    """Constant-time comparison for SHA-256 token fingerprints."""
    return hashlib.sha256(plain_token.encode("utf-8")).hexdigest() == stored_hash

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(
    data: dict,
    token_version: int = 0,
    remember_me: bool = False,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Issue a refresh token embedding the user's current token_version.
    The 'ver' claim is used to detect replayed/rotated-out tokens.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    elif remember_me:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REMEMBER_ME_EXPIRE_DAYS)
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh", "ver": token_version})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_password_reset_token(email: str) -> str:
    """
    Create a short-lived (15-min) password reset token.
    Stored hash in DB makes it single-use after first redemption.
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES
    )
    to_encode = {"sub": email, "exp": expire, "type": "pwd_reset"}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


# ---------------------------------------------------------------------------
# Login Rate Limiter — simple in-memory, per (IP, email) key
# Window: 5 attempts per 15 minutes
# ---------------------------------------------------------------------------

class _LoginRateLimiter:
    """
    Thread-safe in-memory rate limiter.
    Tracks failed login attempts per (client_ip, email) key.
    On every successful login the counter is cleared.
    """
    _MAX_ATTEMPTS = 5
    _WINDOW_SECONDS = 15 * 60  # 15 minutes

    def __init__(self):
        self._lock = threading.Lock()
        # key -> list of attempt timestamps (floats)
        self._attempts: Dict[str, list] = defaultdict(list)

    def _key(self, ip: str, email: str) -> str:
        return f"{ip}:{email.lower()}"

    def is_rate_limited(self, ip: str, email: str) -> bool:
        key = self._key(ip, email)
        now = time.monotonic()
        cutoff = now - self._WINDOW_SECONDS
        with self._lock:
            # Prune old entries
            self._attempts[key] = [t for t in self._attempts[key] if t > cutoff]
            return len(self._attempts[key]) >= self._MAX_ATTEMPTS

    def record_failure(self, ip: str, email: str) -> None:
        key = self._key(ip, email)
        with self._lock:
            self._attempts[key].append(time.monotonic())

    def clear(self, ip: str, email: str) -> None:
        key = self._key(ip, email)
        with self._lock:
            self._attempts.pop(key, None)


# Module-level singleton — shared across all requests in this process
login_rate_limiter = _LoginRateLimiter()
