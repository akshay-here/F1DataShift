# Maiin file which merges all the routes created and sets up the server

from fastapi import FastAPI
from Routes import standings, races

app = FastAPI()

# Include the routes

app.include_router(standings.router, prefix="/standings")
app.include_router(races.router, prefix="/races")

