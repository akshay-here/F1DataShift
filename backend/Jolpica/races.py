# This file is used to retrieve data related to races, schedules etc
# Mainly used to retrieve race schedule for a given year, race schedule for a particular round in a year, race results for a particular round in a year, 
# qualifying and sprint results for a particular round in a year, pitstops for a particular race round in a year

import httpx
import asyncio

BASE_URL = "https://api.jolpi.ca/ergast/f1"

async def get_season_schedule(year: int):
    url = f"{BASE_URL}/{year}/races/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
    # print(data["MRData"]["RaceTable"]["Races"])
    return data["MRData"]["RaceTable"]["Races"]


async def get_race_schedule(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/races/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
    return data["MRData"]["RaceTable"]["Races"]


async def get_race_result(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/results/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
    return data["MRData"]["RaceTable"]["Races"][0]["Results"]


# qualifying data only available from 1994 onwards. 1994 to 2005 only Q1. 2005 only Q1 and Q2. 2006 onwards Q1, Q2, Q3
async def get_qualifying_results(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/qualifying/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
    return data["MRData"]["RaceTable"]["Races"][0]["QualifyingResults"]


# sprint results only available from 2021 onwards and not in every single round
async def get_sprint_results(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/sprint/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
    return data["MRData"]["RaceTable"]["Races"][0]["SprintResults"]


# pitstop data available only from 2011 onwards
async def get_pitstops_for_race(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/pitstops/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
        limit = int(data["MRData"]["limit"])
        total = int(data["MRData"]["total"])
        final = []

        offset = 0
        while offset < total:
            url = f"{BASE_URL}/{year}/{round}/pitstops/?offset={offset}"
            res = await client.get(url)
            data = res.json()
            intermed = data["MRData"]["RaceTable"]["Races"][0]["PitStops"]
            final.extend(intermed)
            offset += limit
    
    # Group pitstops by driverId
    drivers_dict = {}  # Dictionary to store driver pitstop data
    for pitstop in final:
        driver_id = pitstop.get("driverId")
        if not driver_id:
            continue  # Skip invalid pitstop entries
        
        if driver_id not in drivers_dict:
            drivers_dict[driver_id] = {
                "driverId": driver_id,
                "stops": 0,
                "lap": [],
                "duration": []
            }
        
        # Append pitstop data
        drivers_dict[driver_id]["stops"] += 1
        drivers_dict[driver_id]["lap"].append(pitstop.get("lap", ""))
        drivers_dict[driver_id]["duration"].append(pitstop.get("duration", ""))

    # Convert dictionary to list for response
    pitstops = list(drivers_dict.values())
    return pitstops 