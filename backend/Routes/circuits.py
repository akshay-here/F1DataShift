# this file is for creating all the routes for all the functions in the circuits file present in Jolpica/circuits.py

from fastapi import APIRouter
from Jolpica.circuits import get_circuits_in_season, get_all_circuits

router = APIRouter()

@router.get("/all")
async def all_circuits(): 
    return await get_all_circuits()

# VERY IMP: order MATTERS as if /all route is placed below the /{year} route then it will try to use "all" as year and treat it like an int
# So we get this error => {"detail":[{"type":"int_parsing","loc":["path","year"],"msg":"Input should be a valid integer, unable to parse string as an integer","input":"all"}]}

@router.get("/{year}")
async def circuits_in_season(year: int): 
    return await get_circuits_in_season(year)
