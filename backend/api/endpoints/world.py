from fastapi import APIRouter, Depends
from backend.models.world import WorldState, WorldTime
from backend.services import world_service

router = APIRouter()

@router.get("/state", response_model=WorldState)
async def get_world_state():
    return world_service.get_state()

@router.get("/time", response_model=WorldTime)
async def get_world_time():
    return world_service.get_time()
