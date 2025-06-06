# This file is used to retrieve data related to races, schedules etc
# Mainly used to retrieve race schedule for a given year, race schedule for a particular round in a year, race results for a particular round in a year, 
# qualifying and sprint results for a particular round in a year, pitstops for a particular race round in a year

import httpx

BASE_URL = "https://api.jolpi.ca/ergast/f1"

def get_season_schedule(year: int):
    url = f"{BASE_URL}/{year}/races/"
    res = httpx.get(url)
    data = res.json()
    # print(data["MRData"]["RaceTable"]["Races"])
    return (data["MRData"]["RaceTable"]["Races"])


def get_race_schedule(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/races/"
    res = httpx.get(url)
    data = res.json()
    # print(data["MRData"]["RaceTable"]["Races"])
    return (data["MRData"]["RaceTable"]["Races"])

# both the season and race schedule are used to get all the tracks raced in that year and the timings of the races, FPx, qualifying, race only


def get_race_result(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/results/"
    res = httpx.get(url)
    data = res.json()
    # print(data["MRData"]["RaceTable"]["Races"][0]["Results"])
    return (data["MRData"]["RaceTable"]["Races"][0]["Results"])


def get_qualifying_results(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/qualifying/"
    res = httpx.get(url)
    data = res.json()
    # print(data["MRData"]["RaceTable"]["Races"][0]["QualifyingResults"])
    return (data["MRData"]["RaceTable"]["Races"][0]["QualifyingResults"])


def get_sprint_results(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/sprint/"
    res = httpx.get(url)
    data = res.json()
    # print(data["MRData"]["RaceTable"]["Races"][0]["SprintResults"])
    return (data["MRData"]["RaceTable"]["Races"][0]["SprintResults"])


def get_pitstops_for_race(year: int, round: int): 
    url = f"{BASE_URL}/{year}/{round}/pitstops/"
    res = httpx.get(url)
    data = res.json()
    limit = int(data["MRData"]["limit"])
    total = int(data["MRData"]["total"])
    final = []

    offset = 0
    while offset < total:
        url = f"{BASE_URL}/{year}/{round}/pitstops/?offset={offset}"
        res = httpx.get(url)
        data = res.json()
        intermed = data["MRData"]["RaceTable"]["Races"][0]["PitStops"]

        final.extend(intermed)
        offset += limit
    
    # print(final)
    return final


