# Maiin file which merges all the routes created and sets up the server

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routes import standings, races, drivers, teams, circuits, heatmap

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routes

app.include_router(standings.router, prefix="/standings")
app.include_router(races.router, prefix="/races")
app.include_router(drivers.router, prefix="/drivers")
app.include_router(teams.router, prefix="/teams")
app.include_router(circuits.router, prefix="/circuits")
app.include_router(heatmap.router, prefix="/heatmap")

