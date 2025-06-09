# This file is used for getting data related to all the drivers that have raced in a season

import httpx
from fastapi import HTTPException
import json

BASE_URL = "https://api.jolpi.ca/ergast/f1"


async def get_drivers_in_season(year: int): 
    url = f"{BASE_URL}/{year}/drivers/"
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url)
            data = res.json()
            driver_list = data["MRData"]["DriverTable"]["Drivers"]
            if not driver_list:
                    raise HTTPException(status_code=404, detail=f"No drivers found for year {year}")
            return driver_list
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")


async def get_driver_races(driver: str):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/drivers/{driver}/results/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            total = int(data.get("MRData", {}).get("total", 0))
            driver_races = []
            limit = 100
            offset = 0
            while offset < total:
                newurl = f"{BASE_URL}/drivers/{driver}/results/?limit={limit}&offset={offset}"
                res = await client.get(newurl)
                res.raise_for_status()
                data = res.json()
                intermed = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
                driver_races.extend(intermed)
                offset += limit
            return driver_races
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



async def get_driver_races_year(driver: str, year: int):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/{year}/drivers/{driver}/results/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            driver_races_year = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            if not driver_races_year:
                raise HTTPException(status_code=404, detail=f"No race data found for {driver} in {year}")
            return driver_races_year
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



async def get_driver_qualifying(driver: str):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/drivers/{driver}/qualifying/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            total = int(data.get("MRData", {}).get("total", 0))
            driver_qualifying = []
            limit = 100
            offset = 0
            while offset < total:
                newurl = f"{BASE_URL}/drivers/{driver}/qualifying/?limit={limit}&offset={offset}"
                res = await client.get(newurl)
                res.raise_for_status()
                data = res.json()
                intermed = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
                driver_qualifying.extend(intermed)
                offset += limit
            return driver_qualifying
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return []  # Return empty list for older driver
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



async def get_driver_qualifying_year(driver: str, year: int):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/{year}/drivers/{driver}/results/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            driver_qualifying_year = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            if not driver_qualifying_year:
                raise HTTPException(status_code=404, detail=f"No qualifying data found for {driver} in {year}")
            return driver_qualifying_year
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



async def get_driver_sprints(driver: str):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/drivers/{driver}/sprint/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            driver_sprints = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            return driver_sprints
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return []  # Return empty list for older driver
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



async def get_driver_sprints_year(driver: str, year: int):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/{year}/drivers/{driver}/sprint/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            driver_sprints_year = data.get("MRData", {}).get("RaceTable", {}).get("Races", [])
            if not driver_sprints_year:
                raise HTTPException(status_code=404, detail=f"No sprint data found for {driver} in {year}")
            return driver_sprints_year
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



async def get_driver_standings_year(driver: str, year: int):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/{year}/drivers/{driver}/driverstandings/"
            res = await client.get(url)
            res.raise_for_status()
            if not res.text:
                print(f"Empty response for {driver} in {year}")
                raise HTTPException(status_code=502, detail=f"Empty response from API for {driver} in {year}")
            try:
                data = res.json()
            except json.JSONDecodeError as e:
                print(f"Invalid JSON for {driver} in {year}: {res.text}")
                raise HTTPException(status_code=502, detail=f"Invalid API response for {driver} in {year}")
            driver_standings_year = data.get("MRData", {}).get("StandingsTable", {}).get("StandingsLists", [])
            if not driver_standings_year:
                raise HTTPException(status_code=404, detail=f"No driver standing data found for {driver} in {year}")
            return driver_standings_year
    except httpx.HTTPStatusError as e:
        print(f"HTTP error for {driver} in {year}: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error for {driver} in {year}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



async def get_driver_profile(driver: str):
    try:
        async with httpx.AsyncClient() as client:
            url = f"{BASE_URL}/drivers/{driver}/"
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
            driver_profile = data.get("MRData", {}).get("DriverTable", {}).get("Drivers", [])
            if not driver_profile:
                raise HTTPException(status_code=404, detail=f"No data found for {driver}")
            return driver_profile
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    


async def get_driver_stats(driver: str): 
    driver_profile = await get_driver_profile(driver)
    races_overall = await get_driver_races(driver)
    qualifying_overall = await get_driver_qualifying(driver)
    sprints_overall = await get_driver_sprints(driver)

    # Extract profile
    profile = {
        "driverId": driver_profile[0].get("driverId"),
        "givenName": driver_profile[0].get("givenName"),
        "familyName": driver_profile[0].get("familyName"),
        "nationality": driver_profile[0].get("nationality"),
        "dateOfBirth": driver_profile[0].get("dateOfBirth"),
        "url": driver_profile[0].get("url", "")
    }

    # Wins: Races where position=1
    wins = sum(1 for race in races_overall if race.get("Results", [{}])[0].get("position") == "1")

    # Podiums: Races where position=1,2,3
    podiums = sum(1 for race in races_overall if race.get("Results", [{}])[0].get("position") in ["1", "2", "3"])

    # Points Finishes: Races where position = 4, 5, .., 10
    pointsFinishes = sum(1 for race in races_overall if race.get("Results", [{}])[0].get("position") in ["4", "5", "6", "7", "8," "9", "10"])

    # Outside points finishes
    outsidePoints = sum(1 for race in races_overall if race.get("Results", [{}])[0].get("position") > "10")

    # Poles: Qualifying where position=1
    poles = sum(1 for qual in qualifying_overall if qual.get("QualifyingResults", [{}])[0].get("position") == "1")

    # Total races
    total_races = len(races_overall)

    # Total points
    total_points = sum(float(race.get("Results", [{}])[0].get("points", 0)) for race in races_overall)

    # Sprint wins
    sprint_wins = sum(1 for sprint in sprints_overall if sprint.get("SprintResults", [{}])[0].get("position") == "1")

    # Fastest laps
    fastest_laps = sum(1 for race in races_overall if race.get("Results", [{}])[0].get("FastestLap", {}).get("rank") == "1")

    # Fetch years the driver participated in (from race results)
    years = sorted(set(int(race.get("season")) for race in races_overall), reverse=True)

    # Calculate championships and yearly standings
    championships = 0
    yearly_standings = []
    for year in years:
        try:
            standings = await get_driver_standings_year(driver, year)
            if standings:
                standing = standings[0].get("DriverStandings", [{}])[0]
                if standing.get("position") == "1":
                    championships += 1
                yearly_standings.append({
                    "year": str(year),
                    "position": standing.get("position", "N/A"),
                    "points": standing.get("points", "0"),
                    "wins": standing.get("wins", "0"),
                    "constructor": standing.get("Constructors", [{}])[0].get("name", "N/A"),
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
        "pointsFinishes": pointsFinishes, 
        "outsidePoints": outsidePoints, 
        "totalRaces": total_races,
        "totalPoints": total_points,
        "sprintWins": sprint_wins,
        "fastestLaps": fastest_laps,
        "championships": championships, 
        "seasonsDriven": len(years)
    }

    # Combine response
    return {
        "profile": profile,
        "careerStats": career_stats,
        "yearlyStandings": yearly_standings
    }