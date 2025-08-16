from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class MemoryType(str, Enum):
    SHORT_TERM = "short_term"
    LONG_TERM = "long_term"
    EMOTIONAL = "emotional"

class Memory(BaseModel):
    id: int
    character_id: int
    content: str
    type: MemoryType
    timestamp: datetime = datetime.utcnow()
    importance_score: float = 0.5
