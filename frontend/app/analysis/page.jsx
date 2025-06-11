import React from 'react'
import { Button } from '@/components/ui/button'

function AnalysisHomePage() {
    return (
        <div>
            <h1 className='text-center font-bold text-3xl p-10'>Analysis & Driver Comparison (2018+)</h1>

            <div className='p-10 space-y-10'>
                <div className='border p-10 rounded-xl shadow text-xl flex justify-between'>
                    See Driver and Constructor Heatmap
                    <Button variant="outline">Go To Heatmaps</Button>
                </div>

                <div className='border p-10 rounded-xl shadow text-xl flex justify-between'>
                    <ul>
                        <li className='font-bold'>Perform Race analysis: </li>
                        <li>Circuit Info</li>
                        <li>Position changes in a Race</li>
                        <li>Team Pace Comparison</li>
                        <li>Tyre Strategies in a race</li>
                        <li>Qualifying Results and Delta</li>
                        <li>Driver Laptimes Distribution</li>
                    </ul>
                    <Button variant="outline">Race Analysis</Button>
                </div>

                <div className='border p-10 rounded-xl shadow text-xl flex justify-between'>
                    <ul>
                        <li className='font-bold'>Perform analysis on Driver Performance in a race like: </li>
                        <li>Speed traces (Speed vs Distance)</li>
                        <li>Driver Laptimes Scatterplot</li>
                        <li>Driver Race Pace (Laptime vs Laps)</li>
                        <li>Speed Traces with corner annotations</li>
                    </ul>
                    <Button variant="outline">Driver Analysis</Button>
                </div>

                <div className='border p-10 rounded-xl shadow text-xl flex justify-between'>
                    <ul>
                        <li className='font-bold'>Pick 2 or  more drivers and compare their Performance:</li>
                        <li>Overlaying Speed Traces - Pick any lap and Compare their telemetry data</li>
                        <li>Driver Race Pace Comparison</li>
                    </ul>
                    <Button variant="outline">Comppare Driver</Button>
                </div>

            </div>

        </div>
    )
}

export default AnalysisHomePage
