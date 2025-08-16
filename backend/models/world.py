from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class GameEvent(BaseModel):
    id: int
    type: str
    payload: Dict[str, Any]
    timestamp: datetime = datetime.utcnow()

class Location(BaseModel):
    id: int
    name: str
    description: str
    characters: List[int] = []

class WorldState(BaseModel):
    status: str

class WorldTime(BaseModel):
    time: str
