# this file is for setting up all the routes related to race information like race, qualifying, sprint results etc

from fastapi import APIRouter
from Jolpica.races import get_season_schedule, get_race_schedule, get_race_result, get_qualifying_results, get_sprint_results, get_pitstops_for_race

router = APIRouter()

@router.get("/{year}")
async def season_schedule(year: int): 
    return await get_season_schedule(year)

@router.get("/{year}/{round}")
async def race_schedule(year: int, round: int): 
    return await get_race_schedule(year, round)

@router.get("/result/{year}/{round}")
async def race_result(year: int, round: int): 
    return await get_race_result(year, round)

@router.get("/qualifying/result/{year}/{round}")
async def qualifying_result(year: int, round: int): 
    return await get_qualifying_results(year, round)

@router.get("/sprint/result/{year}/{round}")
async def sprint_result(year: int, round: int): 
    return await get_sprint_results(year, round)

@router.get("/pitstops/{year}/{round}")
async def race_pitstops(year: int, round: int): 
    return await get_pitstops_for_race(year, round)