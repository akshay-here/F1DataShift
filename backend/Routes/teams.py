# This file is to create the route for displaying the team related info

from fastapi import APIRouter
from Jolpica.teams import get_teams_in_season, get_team_races_year, get_team_qualifying_year, get_team_sprints_year, get_team_standings_year, get_team_profile, get_team_stats

router = APIRouter()

@router.get("/{year}")
async def teams_in_year(year: int): 
    return await get_teams_in_season(year)


@router.get("/{team}/races/{year}")
async def team_races_year(team: str, year: int): 
    return await get_team_races_year(team, year)


@router.get("/{team}/qualifying/{year}")
async def team_qualifying_year(team: str, year: int): 
    return await get_team_qualifying_year(team, year)


@router.get("/{team}/sprints/{year}")
async def team_sprints(team: str, year: int): 
    return await get_team_sprints_year(team, year)


@router.get("/{team}/standings/{year}")
async def team_standings_year(team: str, year: int): 
    return await get_team_standings_year(team, year)


@router.get("/{team}/profile")
async def team_profile(team: str): 
    return await get_team_profile(team)


@router.get("/{team}/stats")
async def team_stats(team: str): 
    return await get_team_stats(team)