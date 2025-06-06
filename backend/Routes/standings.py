# This file is for creating routes for only the standings data which includes both the drivers and the constructors standings. This file creates multiple 
# such routes and is used to send the data to the frontend

from fastapi import APIRouter
from Jolpica.standings import get_drivers_standings, get_drivers_standings_after_round, get_constructors_standings, get_constructors_standings_after_round

router = APIRouter()

@router.get("/drivers/{year}")
def driver_standings(year: int): 
    return get_drivers_standings(year)

@router.get("/drivers/{year}/{round}")
def driver_standings_round(year: int, round: int): 
    return get_drivers_standings_after_round(year, round)

@router.get("/constructors/{year}")
def constructor_standings(year: int): 
    return get_constructors_standings(year)

@router.get("/constructors/{year}/{round}")
def constructor_standings_round(year: int, round: int): 
    return get_constructors_standings_after_round(year, round)