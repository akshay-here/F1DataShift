# Maiin file which merges all the routes created and sets up the server

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routes import standings, races, drivers, teams, circuits, heatmap, racePlots, driverPlots

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://f1datashift-frontend.vercel.app"],  # Frontend URL
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
app.include_router(racePlots.router, prefix="/raceplots")
app.include_router(driverPlots.router, prefix="/driverplots")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)