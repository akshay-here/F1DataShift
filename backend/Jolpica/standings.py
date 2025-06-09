import httpx
from fastapi import HTTPException

BASE_URL = "https://api.jolpi.ca/ergast/f1"

async def get_drivers_standings(year: int): 
    url = f"{BASE_URL}/{year}/driverstandings/"
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url)
            data = resp.json()
            # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"])
            driver_standings = data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]
            if not driver_standings:
                raise HTTPException(status_code=404, detail=f"No driver standings data found for year {year}")
            return driver_standings
        
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")



async def get_drivers_standings_after_round(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/driverstandings/"
    async with httpx.AsyncClient() as client:
        try: 
            resp = await client.get(url)
            data = resp.json()
            # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"])
            driver_standings_after_round = data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]
            if not driver_standings_after_round:
                raise HTTPException(status_code=404, detail=f"No driver standings data found for year {year} and round {round}")
            return driver_standings_after_round
        
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year or Round: {e}")

    

async def get_constructors_standings(year: int): 
    url = f"{BASE_URL}/{year}/constructorstandings/"
    async with httpx.AsyncClient() as client:
        try: 
            resp = await client.get(url)
            data = resp.json()
            # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"])
            constructor_standings = data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]
            if not constructor_standings:
                raise HTTPException(status_code=404, detail=f"No constructor standings data found for year {year}")
            return constructor_standings
        
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")


async def get_constructors_standings_after_round(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/constructorstandings/"
    async with httpx.AsyncClient() as client:
        try: 
            resp = await client.get(url)
            data = resp.json()
            # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"])
            constructor_standings_after_round = data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]
            if not constructor_standings_after_round:
                raise HTTPException(status_code=404, detail=f"No constructor standings data found for year {year} and round {round}")
            return constructor_standings_after_round
        
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year or Round: {e}")

