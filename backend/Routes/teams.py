# This file is to create the route for displaying the team related info

from fastapi import APIRouter
from Jolpica.teams import get_teams_in_season

router = APIRouter()

@router.get("/{year}")
def teams_in_year(year: int): 
    return get_teams_in_season(year)