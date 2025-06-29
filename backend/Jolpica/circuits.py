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
    url = f"{BASE_URL}/circuits/?limit=100"
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url)
            data = res.json()
            circuits = data["MRData"]["CircuitTable"]["Circuits"]
            if not circuits:
                raise HTTPException(status_code=404, detail=f"No circuits found")
            return circuits
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")
        

async def get_circuit_races(circuitId: str): 
    url = f"{BASE_URL}/circuits/{circuitId}/results/?limit=100"
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url)
            data = res.json()

            total = int(data["MRData"]["total"])
            limit = 100
            final = []

            offset = 0
            while offset < total:
                newurl = f"{BASE_URL}/circuits/{circuitId}/results/?limit={limit}&offset={offset}"
                res = await client.get(newurl)
                data = res.json()
                intermed = data["MRData"]["RaceTable"]["Races"]
                final.extend(intermed)
                offset += limit

            if not final:
                raise HTTPException(status_code=404, detail=f"No Race results found for this circuit")
            return final
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")