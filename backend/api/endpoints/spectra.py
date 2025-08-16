from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
async def get_spectra_status():
    # Logic to retrieve Spectra's status will go here
    return {"status": "Contemplative", "mood": "Calm"}
