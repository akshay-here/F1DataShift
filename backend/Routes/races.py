# this file is for setting up all the routes related to race information like race, qualifying, sprint results etc

from fastapi import APIRouter
from Jolpica.races import get_season_schedule, get_race_schedule, get_race_result, get_qualifying_results, get_sprint_results, get_pitstops_for_race

router = APIRouter()

@router.get("/{year}")
def season_schedule(year: int): 
    return get_season_schedule(year)

@router.get("/{year}/{round}")
def race_schedule(year: int, round: int): 
    return get_race_schedule(year, round)