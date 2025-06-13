# This file contains all the functions to send plot data over routes which can be accessed by the frontend to plot interactive plots/graphs

from fastapi import HTTPException
import fastf1
import fastf1.plotting
import numpy as np
from scipy.interpolate import interp1d
import pandas as pd


# this is the function to get the data for the qualifying speed trace vs Distance of a driver in a given year and round
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
        
        # Extract full telemetry
        telemetry_data = [
            {
                "distance": float(dist),
                "speed": float(speed),
                "throttle": float(throttle),
                "brake": float(brake),
                "rpm": float(rpm),
                "gear": float(gear),
                "drs": float(drs)
            }
            for dist, speed, throttle, brake, rpm, gear, drs in zip(
                driver_tel['Distance'],
                driver_tel['Speed'],
                driver_tel['Throttle'],
                driver_tel['Brake'],
                driver_tel['RPM'],
                driver_tel['nGear'],
                driver_tel['DRS']
            )
            if not any(np.isnan(x) for x in [dist, speed, throttle, brake, rpm, gear, drs])
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
        


# function to get the qualifying speed trace vs Corner for a driver in a given year and round
async def get_qualifying_speed_trace_corners(driverCode: str, year: int, round: int): 
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
        
        # Get circuit info
        circuit_info = session.get_circuit_info()
        if not hasattr(circuit_info, 'corners') or circuit_info.corners.empty:
            raise HTTPException(status_code=404, detail=f"No corner data available for {year} round {round}.")

        # Interpolate speed at corner distances
        valid_tel = driver_tel[['Distance', 'Speed']].dropna()
        if valid_tel.empty:
            raise HTTPException(status_code=404, detail=f"No valid telemetry points for driver {driverCode} in {year} round {round}.")

        interp_func = interp1d(valid_tel['Distance'], valid_tel['Speed'], bounds_error=False, fill_value='extrapolate')
        corner_data = []
        for _, corner in circuit_info.corners.iterrows():
            corner_dist = float(corner['Distance'])
            corner_speed = float(interp_func(corner_dist))
            if not np.isnan(corner_speed):
                corner_data.append({
                    "corner": f"{corner['Number']}{corner['Letter'] or ''}",
                    "distance": corner_dist,
                    "speed": corner_speed
                })

        if not corner_data:
            raise HTTPException(status_code=404, detail=f"No valid corner speeds for driver {driverCode} in {year} round {round}.")

        result = {
            "driverCode": driverCode,
            "teamColor": team_color,
            "cornerData": corner_data,
            "totalCorners": len(circuit_info.corners)
        }

        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch qualifying speed trace vs corner: {str(e)}")
    

# function to get the race pace plot
async def get_race_pace_plot(driverCode: str, year: int, round: int): 
    try:
        session = fastf1.get_session(year, round, "R")
        session.load(telemetry=False, laps=True, weather=False)

        # get the laps of the driver
        laps = session.laps.pick_drivers(driverCode).pick_quicklaps().reset_index()
        if laps.empty:
            raise HTTPException(status_code=404, detail=f"No quick laps data for driver {driverCode} in {year} round {round}.")

        # Extract lap data
        lap_data = [
            {
                "lapNumber": int(lap['LapNumber']),
                "lapTime": float(lap['LapTime'].total_seconds()) if pd.notna(lap['LapTime']) else None
            }
            for _, lap in laps.iterrows()
            if pd.notna(lap['LapNumber']) and pd.notna(lap['LapTime'])
        ]

        if not lap_data:
            raise HTTPException(status_code=404, detail=f"No valid lap data for driver {driverCode} in {year} round {round}.")

        team_color = fastf1.plotting.get_team_color(laps['Team'].iloc[0], session=session)

        result = {
            "driverCode": driverCode,
            "teamColor": team_color,
            "lapData": lap_data,
            "totalLaps": len(lap_data), 
            "actualLaps": int(session.total_laps) if session.total_laps else max(lap['lapNumber'] for lap in lap_data)  # Total race laps
        }

        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch race pace for driver: {str(e)}")
    

# function to send the telemetry data like speed, throttle, brake, rpm ,gear, drs for a given driver, year, round and Lap
async def get_driver_race_telemetry_data(driverCode: str, year: int, round: int, lapNumber: int): 
    try:
        session = fastf1.get_session(year, round, "R")
        session.load(telemetry=True, laps=True, weather=False)

        # Get specified lap
        driver_laps = session.laps.pick_drivers(driverCode)
        lap = driver_laps[driver_laps['LapNumber'] == lapNumber]
        if lap.empty:
            raise HTTPException(status_code=404, detail=f"No lap {lapNumber} data for driver {driverCode} in {year} round {round}.")

        # Get telemetry for the lap
        telemetry = lap.get_car_data().add_distance()
        if telemetry.empty:
            raise HTTPException(status_code=404, detail=f"No telemetry data for lap {lapNumber} of driver {driverCode} in {year} round {round}.")

        team_color = fastf1.plotting.get_team_color(lap['Team'].iloc[0], session=session)

        # Extract telemetry data
        telemetry_data = [
            {
                "distance": float(row['Distance']),
                "speed": float(row['Speed']) if pd.notna(row['Speed']) else None,
                "throttle": float(row['Throttle']) if pd.notna(row['Throttle']) else None,
                "brake": float(row['Brake']) if pd.notna(row['Brake']) else None,
                "rpm": float(row['RPM']) if pd.notna(row['RPM']) else None,
                "gear": int(row['nGear']) if pd.notna(row['nGear']) else None,
                "drs": int(row['DRS']) if pd.notna(row['DRS']) else None
            }
            for _, row in telemetry.iterrows()
            if pd.notna(row['Distance'])
        ]

        if not telemetry_data:
            raise HTTPException(status_code=404, detail=f"No valid telemetry points for lap {lapNumber} of driver {driverCode} in {year} round {round}.")

        result = {
            "driverCode": driverCode,
            "teamColor": team_color,
            "lapNumber": lapNumber,
            "telemetry": telemetry_data,
            "totalPoints": len(telemetry_data)
        }

        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch race telemetry data for driver: {str(e)}")