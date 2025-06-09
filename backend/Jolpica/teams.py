# This file is used for getting data related to all the teams that have raced in a season

import httpx
from fastapi import HTTPException

BASE_URL = "https://api.jolpi.ca/ergast/f1"


async def get_teams_in_season(year: int): 
    url = f"{BASE_URL}/{year}/constructors/"
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url)
            data = res.json()
            teams_list = (data["MRData"]["ConstructorTable"]["Constructors"])
            if not teams_list:
                    raise HTTPException(status_code=404, detail=f"No teams found for year {year}")
            return teams_list
        
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")



