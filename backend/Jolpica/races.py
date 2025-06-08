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


async def get_qualifying_results(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/qualifying/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
    return data["MRData"]["RaceTable"]["Races"][0]["QualifyingResults"]


async def get_sprint_results(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/sprint/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
    return data["MRData"]["RaceTable"]["Races"][0]["SprintResults"]


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
    return final
