import httpx
import pandas as pd
from fastapi import HTTPException
import plotly.express as px
from io import BytesIO

BASE_URL = "https://api.jolpi.ca/ergast/f1"


# to get all the race results for creating the standings heatmap
async def get_all_race_results(year: int): 
    url = f"{BASE_URL}/{year}/results/"
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url)
            data = res.json()
            
            limit = 100
            total = int(data["MRData"]["total"])
            final = []

            offset = 0
            while offset < total:
                newurl = f"{BASE_URL}/{year}/results/?limit={limit}&offset={offset}"
                res = await client.get(newurl)
                data = res.json()
                intermed = data["MRData"]["RaceTable"]["Races"]
                final.extend(intermed)
                offset += limit
            
            if not final:
                raise HTTPException(status_code=404, detail=f"No Race results found for year {year}")
            return final
        
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")
        

# to get all the sprint results for creating the standings heatmap
async def get_all_sprint_results(year: int): 
    url = f"{BASE_URL}/{year}/sprint/"
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url)
            data = res.json()
            
            limit = 100
            total = int(data["MRData"]["total"])
            final = []

            offset = 0
            while offset < total:
                newurl = f"{BASE_URL}/{year}/sprint/?limit={limit}&offset={offset}"
                res = await client.get(newurl)
                data = res.json()
                intermed = data["MRData"]["RaceTable"]["Races"]
                final.extend(intermed)
                offset += limit
            
            return final
        
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return []                  # for pre-2021 seasons, return only [] 
            raise HTTPException(status_code=e.response.status_code, detail=f"Failed to fetch Data: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid Year: {e}")


# to get the drivers heatmap
async def get_driver_standings_heatmap(year: int):
    try:
        # Fetch race and sprint results
        race_results = await get_all_race_results(year)
        sprint_results = await get_all_sprint_results(year)

        # Process race results
        race_data = []
        for race in race_results:
            round_num = int(race["round"])
            race_name = race["raceName"].replace(" Grand Prix", "")
            for result in race["Results"]:
                race_data.append({
                    "round": round_num,
                    "race": race_name,
                    "driver": result["Driver"]["familyName"],
                    "points": float(result["points"])
                })
        
        # Process sprint results
        sprint_data = []
        for sprint in sprint_results:
            round_num = int(sprint["round"])
            race_name = sprint["raceName"].replace(" Grand Prix", "")
            for result in sprint["SprintResults"]:
                sprint_data.append({
                    "round": round_num,
                    "race": race_name,
                    "driver": result["Driver"]["familyName"],
                    "points": float(result["points"])
                })

        # Convert to DataFrames
        race_df = pd.DataFrame(race_data)
        sprint_df = pd.DataFrame(sprint_data)

        # Merge race and sprint points
        if not sprint_df.empty:
            merged_df = pd.merge(
                race_df,
                sprint_df,
                on=["round", "race", "driver"],
                how="outer",
                suffixes=("_race", "_sprint")
            )
            merged_df["points"] = merged_df["points_race"].fillna(0) + merged_df["points_sprint"].fillna(0)
            merged_df = merged_df[["round", "race", "driver", "points"]]
        else:
            merged_df = race_df

        if merged_df.empty:
            raise HTTPException(status_code=404, detail=f"No data available for year {year}")

        # Pivot for heatmap
        pivot = merged_df.pivot_table(
            values="points",
            index="driver",
            columns="race",
            fill_value=0,
            aggfunc="sum"
        )
        # Sort races by round
        race_order = merged_df[["race", "round"]].drop_duplicates().sort_values("round")["race"].tolist()
        pivot = pivot[race_order]

        # Generate heatmap image
        fig = px.imshow(
            pivot,
            text_auto=True,
            aspect='auto',
            color_continuous_scale=[
                [0, 'rgb(198, 219, 239)'],
                [0.25, 'rgb(107, 174, 214)'],
                [0.5, 'rgb(33, 113, 181)'],
                [0.75, 'rgb(8, 81, 156)'],
                [1, 'rgb(8, 48, 107)']
            ],
            labels={'x': 'Race', 'y': 'Driver', 'color': 'Points'}
        )
        fig.update_xaxes(
            title_text='',
            side='top',
            tickangle=45,
            showticklabels=True,
            tickfont=dict(size=10)
        )
        fig.update_yaxes(
            title_text='',
            tickmode='linear',
            showgrid=True,
            gridwidth=1,
            gridcolor='LightGrey',
            showline=False,
            tickson='boundaries',
            showticklabels=True,
            tickfont=dict(size=10)
        )
        fig.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            coloraxis_showscale=False,
            margin=dict(l=60, r=20, b=20, t=80),
            height=max(400, len(pivot.index) * 20 + 100)
        )

        # Convert to PNG bytes
        img_bytes = fig.to_image(format="png")
        img_buffer = BytesIO(img_bytes)
        return img_buffer
    except HTTPException as e:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")