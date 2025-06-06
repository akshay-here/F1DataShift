# Maiin file which merges all the routes created and sets up the server

from fastapi import FastAPI
from Routes import standings, races, drivers, teams, circuits

app = FastAPI()

# Include the routes

app.include_router(standings.router, prefix="/standings")
app.include_router(races.router, prefix="/races")
app.include_router(drivers.router, prefix="/drivers")
app.include_router(teams.router, prefix="/teams")
app.include_router(circuits.router, prefix="/circuits")

