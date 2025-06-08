import httpx

BASE_URL = "https://api.jolpi.ca/ergast/f1"

async def get_drivers_standings(year: int): 
    url = f"{BASE_URL}/{year}/driverstandings/"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()
        # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"])
        return data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]


async def get_drivers_standings_after_round(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/driverstandings/"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()
        # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"])
        return data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]
    

async def get_constructors_standings(year: int): 
    url = f"{BASE_URL}/{year}/constructorstandings/"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()
        # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"])
        return data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]


async def get_constructors_standings_after_round(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/constructorstandings/"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()
        # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"])
        return data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]
        

