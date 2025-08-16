from pydantic import BaseModel

class SpectraStatus(BaseModel):
    status: str
    mood: str
