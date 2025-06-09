# This file is to create the route for displaying the driver related info

from fastapi import APIRouter
from Jolpica.drivers import get_drivers_in_season, get_driver_races_year, get_driver_qualifying_year, get_driver_sprints_year, get_driver_standings_year, get_driver_profile, get_driver_stats

router = APIRouter()

@router.get("/{year}")
async def drivers_in_year(year: int): 
    return await get_drivers_in_season(year)


@router.get("/{driver}/races/{year}")
async def driver_races_year(driver: str, year: int): 
    return await get_driver_races_year(driver, year)


@router.get("/{driver}/qualifying/{year}")
async def driver_qualifying_year(driver: str, year: int): 
    return await get_driver_qualifying_year(driver, year)


@router.get("/{driver}/sprints/{year}")
async def driver_sprints(driver: str, year: int): 
    return await get_driver_sprints_year(driver, year)


@router.get("/{driver}/standings/{year}")
async def driver_standings_year(driver: str, year: int): 
    return await get_driver_standings_year(driver, year)


@router.get("/{driver}/profile")
async def driver_profile(driver: str): 
    return await get_driver_profile(driver)


@router.get("/{driver}/stats")
async def driver_stats(driver: str): 
    return await get_driver_stats(driver)