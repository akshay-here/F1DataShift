# This file is used for getting data related to all the teams that have raced in a season

import httpx
from fastapi import HTTPException
import json

BASE_URL = "https://api.jolpi.ca/ergast/f1"


async def get_teams_in_season(year: int):
    url = f"{BASE_URL}/{year}/constructors/"
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            teams_list = data.get("MRData", {}).get("ConstructorTable", {}).get("Constructors", [])
            if not teams_list:
                raise HTTPException(status_code=404, detail=f"No teams found for year {year}")
            return teams_list
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch data: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid year: {str(e)}")


async def get_team_races(team: str):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/constructors/{team}/results/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            total = int(data.get("MRData", {}).get("total", 0))
            team_races = []
            limit = 100
            offset = 0
            while offset < total:
                newurl = f"{BASE_URL}/constructors/{team}/results/?limit={limit}&offset={offset}"
                res = await client.get(newurl)
                res.raise_for_status()
                data = res.json()
                intermed = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
                team_races.extend(intermed)
                offset += limit
            if not team_races:
                raise HTTPException(status_code=404, detail=f"No race data found for {team}")
            return team_races
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_team_races_year(team: str, year: int):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/{year}/constructors/{team}/results/?limit=100"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            team_races_year = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            if not team_races_year:
                raise HTTPException(status_code=404, detail=f"No race data found for {team} in {year}")
            return team_races_year
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_team_qualifying(team: str):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/constructors/{team}/qualifying/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            total = int(data.get("MRData", {}).get("total", 0))
            team_qualifying = []
            limit = 100
            offset = 0
            while offset < total:
                newurl = f"{BASE_URL}/constructors/{team}/qualifying/?limit={limit}&offset={offset}"
                res = await client.get(newurl)
                res.raise_for_status()
                data = res.json()
                intermed = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
                team_qualifying.extend(intermed)
                offset += limit
            return team_qualifying
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return []  # Return empty list for older teams
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_team_qualifying_year(team: str, year: int):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/{year}/constructors/{team}/qualifying/?limit=100"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            team_qualifying_year = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            if not team_qualifying_year:
                raise HTTPException(status_code=404, detail=f"No qualifying data found for {team} in {year}")
            return team_qualifying_year
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_team_sprints(team: str):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/constructors/{team}/sprint/?limit=100"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            team_sprints = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            return team_sprints
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return []  # Return empty list for older teams
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_team_sprints_year(team: str, year: int):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/{year}/constructors/{team}/sprint/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            team_sprints_year = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            if not team_sprints_year:
                raise HTTPException(status_code=404, detail=f"No sprint data found for {team} in {year}")
            return team_sprints_year
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_team_standings_year(team: str, year: int):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/{year}/constructors/{team}/constructorstandings/"
            res = await client.get(url)
            res.raise_for_status()
            if not res.text:
                print(f"Empty response for {team} in {year}")
                raise HTTPException(status_code=502, detail=f"Empty response from API for {team} in {year}")
            try:
                data = res.json()
            except json.JSONDecodeError as e:
                print(f"Invalid JSON for {team} in {year}: {res.text}")
                raise HTTPException(status_code=502, detail=f"Invalid API response for {team} in {year}")
            constructor_standings_year = data.get("MRData", {}).get("StandingsTable", {}).get("StandingsLists", [])
            if not constructor_standings_year:
                raise HTTPException(status_code=404, detail=f"No constructor standing data found for {team} in {year}")
            return constructor_standings_year
    except httpx.HTTPStatusError as e:
        print(f"HTTP error for {team} in {year}: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error for {team} in {year}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_team_profile(team: str):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/constructors/{team}/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            team_profile = data.get("MRData", {}).get("ConstructorTable", {}).get("Constructors", [])
            if not team_profile:
                raise HTTPException(status_code=404, detail=f"No data found for {team}")
            return team_profile
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    


async def get_team_stats(team: str): 
    team_profile = await get_team_profile(team)
    races_overall = await get_team_races(team)
    qualifying_overall = await get_team_qualifying(team)
    sprints_overall = await get_team_sprints(team)

    # Extract profile
    profile = {
        "constructorId": team_profile[0].get("constructorId"),
        "name": team_profile[0].get("name"),
        "nationality": team_profile[0].get("nationality"),
        "url": team_profile[0].get("url", "")
    }

    # Wins: Races where any driver finished P1
    wins = sum(1 for race in races_overall for result in race.get("Results", []) if result.get("position") == "1")

    # Podiums: Races where any driver finished P1, P2, or P3
    podiums = sum(1 for race in races_overall for result in race.get("Results", []) if result.get("position") in ["1", "2", "3"])
    
    # Poles: Qualifying where any driver achieved P1
    poles = sum(1 for qual in qualifying_overall for q_result in qual.get("QualifyingResults", []) if q_result.get("position") == "1")
    
    # Total races (count unique races, not results)
    total_races = len(races_overall)
    
    # Total points (sum points from all drivers)
    total_points = sum(float(result.get("points", 0)) for race in races_overall for result in race.get("Results", []))
    
    # Sprint wins
    sprint_wins = sum(1 for sprint in sprints_overall for result in sprint.get("SprintResults", []) if result.get("position") == "1")
    
    # Fastest laps
    fastest_laps = sum(1 for race in races_overall for result in race.get("Results", []) if result.get("FastestLap", {}).get("rank") == "1")

    # Fetch years the team participated in (from race results)
    years = sorted(set(int(race.get("season")) for race in races_overall), reverse=True)

    # Calculate championships and yearly standings
    championships = 0
    yearly_standings = []
    for year in years:
        try:
            standings = await get_team_standings_year(team, year)
            if standings:
                standing = standings[0].get("ConstructorStandings", [{}])[0]
                if standing.get("position") == "1":
                    championships += 1
                yearly_standings.append({
                    "year": str(year),
                    "position": standing.get("position", "N/A"),
                    "points": standing.get("points", "0"),
                    "wins": standing.get("wins", "0"),
                    "rounds": standings[0].get("round", "N/A")
                })
        except HTTPException as e:
            if e.status_code == 404:
                continue  # Skip years without standings
            raise e

    # Career stats
    career_stats = {
        "wins": wins,
        "poles": poles,
        "podiums": podiums,
        "totalRaces": total_races,
        "totalPoints": total_points,
        "sprintWins": sprint_wins,
        "fastestLaps": fastest_laps,
        "championships": championships, 
        "yearsRaced": len(years)
    }

    # Combine response
    return {
        "profile": profile,
        "careerStats": career_stats,
        "yearlyStandings": yearly_standings
    }