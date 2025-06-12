# this file is for creating all the circuit related info - layout, speed layout, gear shifts layout

import fastf1
import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
from fastapi import HTTPException
import matplotlib as mpl
from matplotlib.collections import LineCollection
from matplotlib import colormaps


# helper functions to plot the circuiits
def rotate(xy, *, angle):
    rot_mat = np.array([[np.cos(angle), np.sin(angle)],
                        [-np.sin(angle), np.cos(angle)]])
    return np.matmul(xy, rot_mat)


# function to plot the circuit layout with corner numbers
async def get_circuit_layout(year: int, round: int): 
    try:
        session = fastf1.get_session(year, round, 'Q')       # selecting the track layout from the fastest lap posted during qualifying
        session.load()

        lap = session.laps.pick_fastest()
        pos = lap.get_pos_data()

        circuit_info = session.get_circuit_info()

        # Get an array of shape [n, 2] where n is the number of points and the second
        # axis is x and y.
        track = pos.loc[:, ('X', 'Y')].to_numpy()

        # Convert the rotation angle from degrees to radian.
        track_angle = circuit_info.rotation / 180 * np.pi

        # Rotate and plot the track map.
        rotated_track = rotate(track, angle=track_angle)
        plt.plot(rotated_track[:, 0], rotated_track[:, 1])

        offset_vector = [500, 0]  # offset length is chosen arbitrarily to 'look good'

        # Iterate over all corners.
        for _, corner in circuit_info.corners.iterrows():
            # Create a string from corner number and letter
            txt = f"{corner['Number']}{corner['Letter']}"

            # Convert the angle from degrees to radian.
            offset_angle = corner['Angle'] / 180 * np.pi

            # Rotate the offset vector so that it points sideways from the track.
            offset_x, offset_y = rotate(offset_vector, angle=offset_angle)

            # Add the offset to the position of the corner
            text_x = corner['X'] + offset_x
            text_y = corner['Y'] + offset_y

            # Rotate the text position equivalently to the rest of the track map
            text_x, text_y = rotate([text_x, text_y], angle=track_angle)

            # Rotate the center of the corner equivalently to the rest of the track map
            track_x, track_y = rotate([corner['X'], corner['Y']], angle=track_angle)

            # Draw a circle next to the track.
            plt.scatter(text_x, text_y, color='grey', s=140)

            # Draw a line from the track to this circle.
            plt.plot([track_x, text_x], [track_y, text_y], color='grey')

            # Finally, print the corner number inside the circle.
            plt.text(text_x, text_y, txt, va='center_baseline', ha='center', size='small', color='white')

        plt.title(f"{session.event['EventName']} - Circuit Map")
        plt.xticks([])
        plt.yticks([])
        plt.axis('equal')

        # Save to BytesIO
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        plt.close()
        buffer.seek(0)
        return buffer
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to plot circuit: {str(e)}")
    

# function to get the speed layout of the circuit
async def get_circuit_speed_layout(year: int, round: int): 
    try:
        session = fastf1.get_session(year, round, 'Q')              # getting the speed layout only for the fastest lap posted during qualifying
        event = session.event
        session.load()

        lap = session.laps.pick_fastest()

        # Get telemetry data
        x = lap.telemetry['X']              # values for x-axis
        y = lap.telemetry['Y']              # values for y-axis
        color = lap.telemetry['Speed']      # value to base color gradient on
        colormap = mpl.cm.plasma

        points = np.array([x, y]).T.reshape(-1, 1, 2)
        segments = np.concatenate([points[:-1], points[1:]], axis=1)

        # We create a plot with title and adjust some setting to make it look good.
        fig, ax = plt.subplots(sharex=True, sharey=True, figsize=(12, 6.75))
        fig.suptitle(f'{year} ({event.name}) - Speed', size=24, y=0.97)

        # Adjust margins and turn of axis
        plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.12)
        ax.axis('off')


        # After this, we plot the data itself.
        # Create background track line
        ax.plot(lap.telemetry['X'], lap.telemetry['Y'], color='black', linestyle='-', linewidth=16, zorder=0)

        # Create a continuous norm to map from data points to colors
        norm = plt.Normalize(color.min(), color.max())
        lc = LineCollection(segments, cmap=colormap, norm=norm, linestyle='-', linewidth=5)

        # Set the values used for colormapping
        lc.set_array(color)
        ax.add_collection(lc)
        cbaxes = fig.add_axes([0.25, 0.05, 0.5, 0.05])
        normlegend = mpl.colors.Normalize(vmin=color.min(), vmax=color.max())
        mpl.colorbar.ColorbarBase(cbaxes, norm=normlegend, cmap=colormap, orientation="horizontal")

        # Save to BytesIO
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        plt.close()
        buffer.seek(0)
        return buffer
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to plot circuit: {str(e)}")
    

# function to get the gearshifts in the circuit
async def get_circuit_gearshifts_layout(year: int, round: int): 
    try:
        session = fastf1.get_session(year, round, 'Q')              # getting the speed layout only for the fastest lap posted during qualifying
        session.load()

        lap = session.laps.pick_fastest()
        tel = lap.get_telemetry()

        # Prepare the data for plotting by converting it to the appropriate numpy data types
        x = np.array(tel['X'].values)
        y = np.array(tel['Y'].values)

        points = np.array([x, y]).T.reshape(-1, 1, 2)
        segments = np.concatenate([points[:-1], points[1:]], axis=1)
        gear = tel['nGear'].to_numpy().astype(float)

        # Create a line collection. Set a segmented colormap and normalize the plot to full integer values of the colormap
        cmap = colormaps['Paired']
        lc_comp = LineCollection(segments, norm=plt.Normalize(1, cmap.N+1), cmap=cmap)
        lc_comp.set_array(gear)
        lc_comp.set_linewidth(4)

        # Create the plot
        plt.gca().add_collection(lc_comp)
        plt.axis('equal')
        plt.tick_params(labelleft=False, left=False, labelbottom=False, bottom=False)

        title = plt.suptitle(
            f"Fastest Lap Gear Shift Visualization\n"
            f"{lap['Driver']} - {session.event['EventName']} {session.event.year}"
        )

        # Add a colorbar to the plot. Shift the colorbar ticks by +0.5 so that they are centered for each color segment.
        cbar = plt.colorbar(mappable=lc_comp, label="Gear",
                            boundaries=np.arange(1, 10))
        cbar.set_ticks(np.arange(1.5, 9.5))
        cbar.set_ticklabels(np.arange(1, 9))

        # Save to BytesIO
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        plt.close()
        buffer.seek(0)
        return buffer
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to plot circuit: {str(e)}")