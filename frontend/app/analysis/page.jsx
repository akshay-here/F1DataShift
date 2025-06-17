import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ShinyText from '../StyleComponents/ShinyText/ShinyText'

function AnalysisHomePage() {
    return (
        <div>
            <div className='text-center text-4xl pt-10'>
                <ShinyText text="Analysis & Driver Comparison (2018+)" disabled={false} speed={4} className='custom-class' />
            </div>

            <div className='p-10 space-y-10'>
                <div className='border border-purple-500 p-10 rounded-xl shadow text-xl flex justify-between'>
                    See Driver and Constructor Heatmap
                    <Link href={"/analysis/heatmaps/2025"}>
                        <Button variant="outline" className="text-white bg-black border-purple-500 hover:bg-purple-500 hover:text-black border-white transition-colors">Go To Heatmaps</Button>
                    </Link>
                </div>

                <div className='border border-purple-500 p-10 rounded-xl shadow text-xl flex justify-between'>
                    <ul>
                        <li className='font-bold'>Perform Race analysis: </li>
                        <li>Circuit Info</li>
                        <li>Position changes in a Race</li>
                        <li>Team Pace Comparison</li>
                        <li>Tyre Strategies in a race</li>
                        <li>Qualifying Results and Delta</li>
                        <li>Driver Laptimes Distribution</li>
                    </ul>
                    <Link href={"/analysis/race/"}>
                        <Button variant="outline" className="text-white bg-black border-purple-500 hover:bg-purple-500 hover:text-black border-white transition-colors">Go To Race Analysis</Button>
                    </Link>
                </div>

                <div className='border border-purple-500 p-10 rounded-xl shadow text-xl flex justify-between'>
                    <ul>
                        <li className='font-bold'>Perform analysis on Driver Performance in a race like: </li>
                        <li>Driver Qualifying (Speed vs Distance or Laps)</li>
                        <li>Driver Laptimes Scatterplot</li>
                        <li>Driver Race Pace (Laptime vs Laps)</li>
                    </ul>
                    <Link href={"/analysis/driver/"}>
                        <Button variant="outline" className="text-white bg-black border-purple-500 hover:bg-purple-500 hover:text-black border-white transition-colors">Go To Driver Analysis</Button>
                    </Link>
                </div>

                <div className='border border-purple-500 p-10 rounded-xl shadow text-xl flex justify-between'>
                    <ul>
                        <li className='font-bold'>Pick 2 or  more drivers and compare their Performance:</li>
                        <li>Overlaying Speed Traces - Pick any lap and Compare their telemetry data</li>
                        <li>Driver Race Pace Comparison</li>
                    </ul>
                    <Link href={"/analysis/comparison/"}>
                        <Button variant="outline" className="text-white bg-black border-purple-500 hover:bg-purple-500 hover:text-black border-white transition-colors">Go To Driver Comparison</Button>
                    </Link>
                </div>

            </div>

        </div>
    )
}

export default AnalysisHomePage
