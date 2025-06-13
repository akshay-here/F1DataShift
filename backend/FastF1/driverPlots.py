# This file contains all the functions to send plot data over routes which can be accessed by the drontend to plot interactive plots/graphs

from fastapi import HTTPException
import fastf1
import fastf1.plotting
import numpy as np


# this is the function to get the data for the qualifying speed trace of a driver in a given year and round
async def get_qualifying_speed_trace(driverCode: str, year: int, round: int): 
    try:
        session = fastf1.get_session(year, round, 'Q')
        session.load(telemetry=True, laps=True, weather=False)

        # get the fastest lap of that driver
        driver_lap = session.laps.pick_drivers(driverCode).pick_fastest()
        if driver_lap is None or driver_lap.empty:
            raise HTTPException(status_code=404, detail=f"No fastest lap data for driver {driverCode} in {year} round {round}.")
        
        # get the telemetry for that lap
        driver_tel = driver_lap.get_car_data().add_distance()
        if driver_tel.empty:
            raise HTTPException(status_code=404, detail=f"No telemetry data for driver {driverCode} in {year} round {round}.")
        
        team_color = fastf1.plotting.get_team_color(driver_lap['Team'], session=session)
        
        # Extract distance and speed
        telemetry_data = [
            {"distance": float(dist), "speed": float(speed)}
            for dist, speed in zip(driver_tel['Distance'], driver_tel['Speed'])
            if not np.isnan(dist) and not np.isnan(speed)
        ]

        if not telemetry_data:
            raise HTTPException(status_code=404, detail=f"No valid telemetry points for driver {driverCode} in {year} round {round}.")

        result = {
            "driverCode": driverCode,
            "teamColor": team_color,
            "telemetry": telemetry_data
        }

        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch qualifying speed trace: {str(e)}")
        


