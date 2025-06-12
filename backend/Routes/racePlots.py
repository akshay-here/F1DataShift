# this file is for setting up the routes to access the race related plots

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from FastF1.racePlots import get_driver_position_changes_in_race, get_team_pace_comparison, get_tyre_strats_in_race, get_quali_delta, get_driver_lap_time_distribution

router = APIRouter()

@router.get("/positionchanges/{year}/{round}")
async def driver_position_changes_in_race(year: int, round: int): 
    buffer = await get_driver_position_changes_in_race(year, round)
    return StreamingResponse(buffer, media_type="image/png")


@router.get("/teampace/{year}/{round}")
async def team_pace_comparison(year: int, round: int): 
    buffer = await get_team_pace_comparison(year, round)
    return StreamingResponse(buffer, media_type="image/png")


@router.get("/tyrestrats/{year}/{round}")
async def tyre_strats_in_race(year: int, round: int): 
    buffer = await get_tyre_strats_in_race(year, round)
    return StreamingResponse(buffer, media_type="image/png")

@router.get("/qualidelta/{year}/{round}")
async def quali_delta(year: int, round: int): 
    buffer = await get_quali_delta(year, round)
    return StreamingResponse(buffer, media_type="image/png")


@router.get("/laptimedistrib/{year}/{round}")
async def driver_lap_time_distribution(year: int, round: int): 
    buffer = await get_driver_lap_time_distribution(year, round)
    return StreamingResponse(buffer, media_type="image/png")