import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ShinyText from '../StyleComponents/ShinyText/ShinyText'

function AnalysisHomePage() {
    return (
        <div className="min-h-screen bg-transparent">
            <div className="text-center text-2xl sm:text-3xl md:text-4xl pt-6 sm:pt-8 md:pt-10">
                <ShinyText text="Analysis & Driver Comparison (2018+)" disabled={false} speed={4} className="custom-class" />
            </div>

            <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 md:space-y-10 w-full mx-auto">
                {/* Heatmap Card */}
                <div className="border border-purple-500 p-4 sm:p-6 md:p-10 rounded-xl shadow text-base sm:text-lg md:text-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-xl sm:text-2xl font-extrabold">See Driver and Constructor Heatmap</h1>
                    <Link href={"/analysis/heatmaps/2025"} className="self-start md:self-auto">
                        <Button variant="outline" className="text-white bg-black border-purple-500 hover:bg-purple-500 hover:text-black border-white transition-colors w-full md:w-auto">Go To Heatmaps</Button>
                    </Link>
                </div>

                {/* Race Analysis Card */}
                <div className="border border-purple-500 p-4 sm:p-6 md:p-10 rounded-xl shadow text-base sm:text-lg md:text-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <ul>
                        <li className="font-extrabold text-xl sm:text-2xl pb-3 sm:pb-5">Perform Race analysis: </li>
                        <li>Circuit Info</li>
                        <li>Position changes in a Race</li>
                        <li>Team Pace Comparison</li>
                        <li>Tyre Strategies in a race</li>
                        <li>Qualifying Results and Delta</li>
                        <li>Driver Laptimes Distribution</li>
                    </ul>
                    <Link href={"/analysis/race/"} className="self-start md:self-auto">
                        <Button variant="outline" className="text-white bg-black border-purple-500 hover:bg-purple-500 hover:text-black border-white transition-colors w-full md:w-auto">Go To Race Analysis</Button>
                    </Link>
                </div>

                {/* Driver Performance Card */}
                <div className="border border-purple-500 p-4 sm:p-6 md:p-10 rounded-xl shadow text-base sm:text-lg md:text-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <ul>
                        <li className="font-extrabold text-xl sm:text-2xl pb-3 sm:pb-5">Perform analysis on Driver Performance in a Race: </li>
                        <li>Driver Qualifying (Speed vs Distance or Laps)</li>
                        <li>Driver Laptimes Scatterplot</li>
                        <li>Driver Race Pace (Laptime vs Laps)</li>
                    </ul>
                    <Link href={"/analysis/driver/"} className="self-start md:self-auto">
                        <Button variant="outline" className="text-white bg-black border-purple-500 hover:bg-purple-500 hover:text-black border-white transition-colors w-full md:w-auto">Go To Driver Analysis</Button>
                    </Link>
                </div>

                {/* Driver Comparison Card */}
                <div className="border border-purple-500 p-4 sm:p-6 md:p-10 rounded-xl shadow text-base sm:text-lg md:text-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <ul>
                        <li className="font-extrabold text-xl sm:text-2xl pb-3 sm:pb-5">Pick 2 or more drivers and compare their Performance:</li>
                        <li>Overlaying Speed Traces - Pick any lap and Compare their telemetry data</li>
                        <li>Driver Race Pace Comparison</li>
                    </ul>
                    <Link href={"/analysis/comparison/"} className="self-start md:self-auto">
                        <Button variant="outline" className="text-white bg-black border-purple-500 hover:bg-purple-500 hover:text-black border-white transition-colors w-full md:w-auto">Go To Driver Comparison</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AnalysisHomePage
