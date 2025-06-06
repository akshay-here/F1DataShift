import httpx

BASE_URL = "https://api.jolpi.ca/ergast/f1"

def get_drivers_standings(year: int): 
    url = f"{BASE_URL}/{year}/driverstandings/"
    resp = httpx.get(url)
    data = resp.json()
    # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"])
    return data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]

def get_drivers_standings_after_round(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/driverstandings/"
    resp = httpx.get(url)
    data = resp.json()
    # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"])
    return data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]

def get_constructors_standings(year: int): 
    url = f"{BASE_URL}/{year}/constructorstandings/"
    resp = httpx.get(url)
    data = resp.json()
    # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"])
    return data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]

def get_constructors_standings_after_round(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/constructorstandings/"
    resp = httpx.get(url)
    data = resp.json()
    # print(data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"])
    return data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]
    

