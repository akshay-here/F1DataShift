# This file is for fetching all the circuits that have ever been raced and all the races that have been raced in a season

import httpx

BASE_URL = "https://api.jolpi.ca/ergast/f1"

def get_circuits_in_season(year: int): 
    url = f"{BASE_URL}/{year}/circuits/"
    res = httpx.get(url)
    data = res.json()
    # print(data["MRData"]['CircuitTable']["Circuits"])
    return (data["MRData"]['CircuitTable']["Circuits"])


def get_all_circuits(): 
    url = f"{BASE_URL}/circuits/"
    res = httpx.get(url)
    data = res.json()

    limit = int(data["MRData"]["limit"])
    total = int(data["MRData"]["total"])
    final = []

    offset = 0
    while offset < total:
        url_with_offset = f"{BASE_URL}/circuits/?offset={offset}"
        res = httpx.get(url_with_offset)
        data = res.json()
        intermed = data["MRData"]["CircuitTable"]["Circuits"]

        final.extend(intermed)
        offset += limit

    # print(final)
    return final

