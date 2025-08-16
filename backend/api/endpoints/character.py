from fastapi import APIRouter, Depends
from typing import List
from backend.models.character import Quest, Memory
from backend.services import character_service

router = APIRouter()

@router.get("/{character_id}/quests", response_model=List[Quest])
async def get_character_quests(character_id: int):
    return character_service.get_quests(character_id)

@router.get("/{character_id}/memories", response_model=List[Memory])
async def get_character_memories(character_id: int):
    return character_service.get_memories(character_id)
