from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.endpoints import spectra, character, world

app = FastAPI(title="Htrae World Engine")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "The soul of Htrae is awakening..."}

# Mount API routers
app.include_router(spectra.router, prefix="/spectra", tags=["spectra"])
app.include_router(character.router, prefix="/character", tags=["character"])
app.include_router(world.router, prefix="/world", tags=["world"])
