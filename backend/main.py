from fastapi import FastAPI

app = FastAPI(title="Htrae World Engine")

@app.get("/")
async def root():
    return {"message": "The soul of Htrae is awakening..."}

# Here we will mount the API routers from the api.endpoints module
