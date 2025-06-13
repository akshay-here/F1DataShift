# this file is for setting up all the routes which the frontend will access

from fastapi import APIRouter
from FastF1.driverPlots import get_qualifying_speed_trace, get_qualifying_speed_trace_corners, get_race_pace_plot, get_driver_race_telemetry_data

router = APIRouter()


@router.get("/qualifyingspeedtrace/{driverCode}/{year}/{round}")
async def qualifying_speed_trace(driverCode: str, year: int, round: int): 
    return await get_qualifying_speed_trace(driverCode, year, round)


@router.get("/qualifyingspeedtrace/corners/{driverCode}/{year}/{round}")
async def qualifying_speed_trace_corners(driverCode: str, year: int, round: int): 
    return await get_qualifying_speed_trace_corners(driverCode, year, round)

@router.get("/racepace/{driverCode}/{year}/{round}")
async def race_pace_plot(driverCode: str, year: int, round: int): 
    return await get_race_pace_plot(driverCode, year, round)


@router.get("/racetelemetry/{driverCode}/{year}/{round}/{lapNumber}")
async def driver_race_telemetry_data(driverCode: str, year: int, round: int, lapNumber: int): 
    return await get_driver_race_telemetry_data(driverCode, year, round, lapNumber)