from pydantic import BaseModel
from typing import List, Optional

class Character(BaseModel):
    id: int
    name: str
    faction_id: Optional[int] = None
    location_id: int
    emotional_state: str
    goals: List[str] = []
