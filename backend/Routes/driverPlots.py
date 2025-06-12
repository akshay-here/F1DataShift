# this file is for setting up all the routes which the frontend will access

from fastapi import APIRouter
from FastF1.driverPlots import get_qualifying_speed_trace

router = APIRouter()


@router.get("/qualifyingspeedtrace/{driverCode}/{year}/{round}")
async def qualifying_speed_trace(driverCode: str, year: int, round: int): 
    return await get_qualifying_speed_trace(driverCode, year, round)