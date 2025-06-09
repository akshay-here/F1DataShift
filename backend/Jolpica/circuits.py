# This file is for fetching all the circuits that have ever been raced and all the races that have been raced in a season

import httpx
from fastapi import HTTPException

BASE_URL = "https://api.jolpi.ca/ergast/f1"

async def get_circuits_in_season(year: int): 
    url = f"{BASE_URL}/{year}/circuits/"
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url)
            data = res.json()
            circuits_season = data["MRData"]['CircuitTable']["Circuits"]
            if not circuits_season:
                raise HTTPException(status_code=404, detail=f"No circuits found for year {year}")
            return circuits_season
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")


async def get_all_circuits(): 
    url = f"{BASE_URL}/circuits/"
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url)
            data = res.json()

            limit = int(data["MRData"]["limit"])
            total = int(data["MRData"]["total"])
            final = []

            offset = 0
            while offset < total:
                url_with_offset = f"{BASE_URL}/circuits/?offset={offset}"
                res = await client.get(url_with_offset)
                data = res.json()
                intermed = data["MRData"]["CircuitTable"]["Circuits"]

                final.extend(intermed)
                offset += limit

            if not final:
                raise HTTPException(status_code=404, detail=f"No circuits found")
            return final
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")


