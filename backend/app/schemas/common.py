from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class ErrorContent(BaseModel):
    code: str
    message: str

class ResponseEnvelope(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = ""

class ErrorEnvelope(BaseModel):
    success: bool = False
    error: ErrorContent

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
