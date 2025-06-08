# This file is used for getting data related to all the drivers that have raced in a season

import httpx

BASE_URL = "https://api.jolpi.ca/ergast/f1"


async def get_drivers_in_season(year: int): 
    url = f"{BASE_URL}/{year}/drivers/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
    return data["MRData"]["DriverTable"]["Drivers"]

