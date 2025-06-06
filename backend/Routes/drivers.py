# This file is to create the route for displaying the driver related info

from fastapi import APIRouter
from Jolpica.drivers import get_drivers_in_season

router = APIRouter()

@router.get("/{year}")
def drivers_in_year(year: int): 
    return get_drivers_in_season(year)