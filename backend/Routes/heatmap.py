# this file is for setting up the routes for the heatmap visuals for drivers and constructors

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from io import BytesIO
from FastF1.heatmap import get_driver_standings_heatmap

router = APIRouter()

# @router.get("/drivers/{year}")
# async def driver_standings_heatmap(year: int): 
#     return await get_driver_standings_heatmap(year)

@router.get("/drivers/{year}")
async def driver_standings_heatmap(year: int): 
    img_buffer = await get_driver_standings_heatmap(year)
    return StreamingResponse(
        content=BytesIO(img_buffer.getvalue()),
        media_type="image/png"
    )