# This file is for creating the functions that are responsible for displaying race related visuals like: 
# position changes in a race, team race pace comparison, tyre strategies for the race, qualifying delta and performance, point scores lap time distributions

import fastf1.plotting
from fastf1.core import Laps
import matplotlib.pyplot as plt
from fastapi import HTTPException
from io import BytesIO
import seaborn as sns
import pandas as pd
from timple.timedelta import strftimedelta


# Load FastF1's dark color scheme
fastf1.plotting.setup_mpl(mpl_timedelta_support=False, misc_mpl_mods=False, color_scheme='fastf1')

# function to get the position changes in a race
async def get_driver_position_changes_in_race(year: int, round: int): 
    try:
        # Load the session and create the plot
        session = fastf1.get_session(year, round, "R")
        session.load(telemetry=False, weather=False)

        fig, ax = plt.subplots(figsize=(8.0, 4.9))

        # For each driver, get their three letter abbreviation (e.g. ‘HAM’) by simply using the value of the first lap, 
        # get their color and then plot their position over the number of laps.
        for drv in session.drivers:
            drv_laps = session.laps.pick_drivers(drv)

            abb = drv_laps['Driver'].iloc[0]
            style = fastf1.plotting.get_driver_style(identifier=abb, style=['color', 'linestyle'], session=session)

            ax.plot(drv_laps['LapNumber'], drv_laps['Position'], label=abb, **style)
        
        # Finalize the plot by setting y-limits that invert the y-axis so that position one is at the top, set custom tick positions and axis labels.
        ax.set_ylim([20.5, 0.5])
        ax.set_yticks([1, 5, 10, 15, 20])
        ax.set_xlabel('Lap')
        ax.set_ylabel('Position')

        # Because this plot is very crowed, add the legend outside the plot area.
        ax.legend(bbox_to_anchor=(1.0, 1.02))
        plt.tight_layout()
        plt.title(f"Driver Position Changes In {year} {session.event["EventName"]}")


        # Save to BytesIO
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        plt.close()
        buffer.seek(0)
        return buffer
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to plot position changes in race: {str(e)}")
    

# function to plot the team pace comparison
async def get_team_pace_comparison(year: int, round: int): 
    try:
        # Load the race session. Pick all quick laps (within 107% of fastest lap). For races with mixed conditions, pick_wo_box() is better.
        session = fastf1.get_session(year, round, 'R')
        session.load()
        laps = session.laps.pick_quicklaps()

        # Convert the lap time column from timedelta to integer. This is a seaborn-specific modification. 
        # If plotting with matplotlib, set mpl_timedelta_support to true with plotting.setup_mpl.
        transformed_laps = laps.copy()
        transformed_laps.loc[:, "LapTime (s)"] = laps["LapTime"].dt.total_seconds()

        # order the team from the fastest (lowest median lap time) tp slower
        team_order = (
            transformed_laps[["Team", "LapTime (s)"]]
            .groupby("Team")
            .median()["LapTime (s)"]
            .sort_values()
            .index
        )
        # print(team_order)

        # make a color palette associating team names to hex codes
        team_palette = {team: fastf1.plotting.get_team_color(team, session=session) for team in team_order}

        fig, ax = plt.subplots(figsize=(15, 10))
        sns.boxplot(
            data=transformed_laps,
            x="Team",
            y="LapTime (s)",
            hue="Team",
            order=team_order,
            palette=team_palette,
            whiskerprops=dict(color="white"),
            boxprops=dict(edgecolor="white"),
            medianprops=dict(color="grey"),
            capprops=dict(color="white"),
        )

        plt.title(f"Team Pace comparison in {year} {session.event["EventName"]}")
        plt.grid(visible=False)

        # x-label is redundant
        ax.set(xlabel=None)
        plt.tight_layout()

        # Save to BytesIO
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        plt.close()
        buffer.seek(0)
        return buffer
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to plot team pace comparison in race: {str(e)}")
    

# function to get the tyre strategies in a race
async def get_tyre_strats_in_race(year: int, round: int): 
    try:
        session = fastf1.get_session(year, round, 'R')
        session.load()
        laps = session.laps

        # Get the list of driver numbers
        drivers = session.drivers
        # print(drivers)

        # Convert the driver numbers to three letter abbreviations
        drivers = [session.get_driver(driver)["Abbreviation"] for driver in drivers]
        print(drivers)

        # We need to find the stint length and compound used for every stint by every driver. 
        # We do this by first grouping the laps by the driver, the stint number, and the compound. And then counting the number of laps in each group.
        stints = laps[["Driver", "Stint", "Compound", "LapNumber"]]
        stints = stints.groupby(["Driver", "Stint", "Compound"])
        stints = stints.count().reset_index()

        stints = stints.rename(columns={"LapNumber": "StintLength"})
        # print(stints)

        # Now we can plot the strategies for each driver
        fig, ax = plt.subplots(figsize=(5, 10))

        for driver in drivers:
            driver_stints = stints.loc[stints["Driver"] == driver]

            previous_stint_end = 0
            for idx, row in driver_stints.iterrows():
                # each row contains the compound name and stint length
                # we can use these information to draw horizontal bars
                compound_color = fastf1.plotting.get_compound_color(row["Compound"],
                                                                    session=session)
                plt.barh(
                    y=driver,
                    width=row["StintLength"],
                    left=previous_stint_end,
                    color=compound_color,
                    edgecolor="black",
                    fill=True
                )

                previous_stint_end += row["StintLength"]
        
        # Make the plot more readable and intuitive
        plt.title(f"Tyre Strategies in {session.event["EventName"]}")
        plt.xlabel("Lap Number")
        plt.grid(False)
        # invert the y-axis so drivers that finish higher are closer to the top
        ax.invert_yaxis()

        # Plot aesthetics
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_visible(False)

        plt.tight_layout()

        # Save to BytesIO
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        plt.close()
        buffer.seek(0)
        return buffer
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to plot tyre strats in race: {str(e)}")
    

# function to plot Qualifying Delta in a race
async def get_quali_delta(year: int, round: int): 
    try:
        session = fastf1.get_session(year, round, 'Q')
        session.load()

        # First, we need to get an array of all drivers.
        drivers = pd.unique(session.laps['Driver'])
        # print(drivers)

        # After that we’ll get each driver’s fastest lap, create a new laps object from these laps, 
        # sort them by lap time and have pandas reindex them to number them nicely by starting position.
        list_fastest_laps = list()
        for drv in drivers:
            drvs_fastest_lap = session.laps.pick_drivers(drv).pick_fastest()
            list_fastest_laps.append(drvs_fastest_lap)
        fastest_laps = Laps(list_fastest_laps) \
            .sort_values(by='LapTime') \
            .reset_index(drop=True)
        
        # The plot is nicer to look at and more easily understandable if we just plot the time differences. 
        # Therefore, we subtract the fastest lap time from all other lap times.
        pole_lap = fastest_laps.pick_fastest()
        fastest_laps['LapTimeDelta'] = fastest_laps['LapTime'] - pole_lap['LapTime']

        # Finally, we’ll create a list of team colors per lap to color our plot.
        team_colors = list()
        for index, lap in fastest_laps.iterlaps():
            color = fastf1.plotting.get_team_color(lap['Team'], session=session)
            team_colors.append(color)

        # Now we can plot all the data
        fig, ax = plt.subplots()
        ax.barh(fastest_laps.index, fastest_laps['LapTimeDelta'],
                color=team_colors, edgecolor='grey')
        ax.set_yticks(fastest_laps.index)
        ax.set_yticklabels(fastest_laps['Driver'])

        # show fastest at the top
        ax.invert_yaxis()

        # draw vertical lines behind the bars
        ax.set_axisbelow(True)
        ax.xaxis.grid(True, which='major', linestyle='--', color='black', zorder=-1000)

        # Finally, give the plot a meaningful title
        lap_time_string = strftimedelta(pole_lap['LapTime'], '%m:%s.%ms')

        plt.suptitle(f"{session.event.year} {session.event['EventName']} Qualifying\n"
                    f"Fastest Lap: {lap_time_string} ({pole_lap['Driver']})")
        
        # Save to BytesIO
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        plt.close()
        buffer.seek(0)
        return buffer
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to plot quali delta in race: {str(e)}")
    

# function to get driver laptimes distribution
async def get_driver_lap_time_distribution(year: int, round: int): 
    try: 
        session = fastf1.get_session(year, round, 'R')
        session.load()

        # Get all the laps for the point finishers only. Filter out slow laps (yellow flag, VSC, pitstops etc.) as they distort the graph axis.
        point_finishers = session.drivers[:10]
        # print(point_finishers)
        driver_laps = session.laps.pick_drivers(point_finishers).pick_quicklaps()
        driver_laps = driver_laps.reset_index()

        # To plot the drivers by finishing order, we need to get their three-letter abbreviations in the finishing order.
        finishing_order = [session.get_driver(i)["Abbreviation"] for i in point_finishers]
        # print(finishing_order)

        # First create the violin plots to show the distributions. Then use the swarm plot to show the actual laptimes.
        # create the figure
        fig, ax = plt.subplots(figsize=(10, 5))

        # Seaborn doesn't have proper timedelta support,
        # so we have to convert timedelta to float (in seconds)
        driver_laps["LapTime(s)"] = driver_laps["LapTime"].dt.total_seconds()

        sns.violinplot(data=driver_laps,
                    x="Driver",
                    y="LapTime(s)",
                    hue="Driver",
                    inner=None,
                    density_norm="area",
                    order=finishing_order,
                    palette=fastf1.plotting.get_driver_color_mapping(session=session)
                    )

        sns.swarmplot(data=driver_laps,
                    x="Driver",
                    y="LapTime(s)",
                    order=finishing_order,
                    hue="Compound",
                    palette=fastf1.plotting.get_compound_mapping(session=session),
                    hue_order=["SOFT", "MEDIUM", "HARD"],
                    linewidth=0,
                    size=4,
                    )
        
        # Make the plot more aesthetic
        ax.set_xlabel("Driver")
        ax.set_ylabel("Lap Time (s)")
        plt.suptitle(f"{year} {session.event["EventName"]} Lap Time Distributions")
        sns.despine(left=True, bottom=True)

        plt.tight_layout()

        # Save to BytesIO
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        plt.close()
        buffer.seek(0)
        return buffer
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to plot driver lap time dristribution in race: {str(e)}")