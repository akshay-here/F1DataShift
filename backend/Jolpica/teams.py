# This file is used for getting data related to all the teams that have raced in a season

import httpx

BASE_URL = "https://api.jolpi.ca/ergast/f1"


async def get_teams_in_season(year: int): 
    url = f"{BASE_URL}/{year}/constructors/"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        data = res.json()
        # print(data["MRData"]["ConstructorTable"]["Constructors"])
        return (data["MRData"]["ConstructorTable"]["Constructors"])

