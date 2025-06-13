"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Button } from '@/components/ui/button'

import DriverRaceTelemetryPlots from './DriverRaceTelemetryPlots'

function RacePacePlot({ driverCode, year, round }) {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedLap, setSelectedLap] = useState(null)

    useEffect(() => {
        async function fetchRacePace() {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`http://localhost:8000/driverplots/racepace/${driverCode}/${year}/${round}`, {
                    headers: { 'Accept': 'application/json' },
                })
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`)
                }
                const paceData = await response.json()

                // Prepare data for Recharts
                const chartData = paceData.lapData.map(point => ({
                    lapNumber: point.lapNumber,
                    lapTime: point.lapTime
                }))

                setData({ ...paceData, chartData })
                setError(null)
            } catch (err) {
                console.error(`Fetch error for race pace ${driverCode}/${year}/${round}:`, err.message)
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }
        if (driverCode && year && round) {
            fetchRacePace()
        }
    }, [driverCode, year, round])

    // Handle click on lap data point
    const handleLapClick = (data) => {
        if (data && data.activePayload && data.activePayload[0]) {
            const lap = data.activePayload[0].payload.lapNumber
            setSelectedLap(lap === selectedLap ? null : lap) // Toggle selection
        }
    }

    if (loading) {
        return <div className="text-lg font-medium text-gray-600 text-center pt-10">Loading Race Pace Plot...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Race Pace Plot</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!data || !data.lapData.length) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Race Pace Plot</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    // Calculate min and max lap times for Y-axis domain
    const lapTimes = data.chartData.map(point => point.lapTime)
    const minLapTime = Math.min(...lapTimes)
    const maxLapTime = Math.max(...lapTimes)

    return (
        <div className='pt-20'>

            <h1 className="text-center font-semibold text-xl">Race Pace Plot for {data.driverCode} ({year}, Round {round})</h1>

            <ResponsiveContainer width="100%" height={500}>
                <LineChart
                    data={data.chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                    onClick={handleLapClick}
                >
                    <XAxis
                        dataKey="lapNumber"
                        label={{ value: 'Lap Number', position: 'insideBottom', offset: -5 }}
                        tickFormatter={value => Math.round(value)}
                        interval={0}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        label={{ value: 'Lap Time (s)', angle: -90, position: 'insideLeft' }}
                        domain={[minLapTime - 0.5, maxLapTime + 0.5]}
                        tickFormatter={value => value.toFixed(2)}
                        tickCount={10}
                        interval={0}
                        minTickGap={20}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value) => `${value.toFixed(3)} s`}
                        labelFormatter={lap => `Lap: ${lap}`}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="lapTime"
                        stroke={data.teamColor}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, onClick: (e, payload) => setSelectedLap(payload.payload.lapNumber) }}
                        name={data.driverCode}
                    />
                    {selectedLap && (
                        <ReferenceLine x={selectedLap} stroke="red" strokeDasharray="3 3" label={`Lap ${selectedLap}`} />
                    )}
                </LineChart>
            </ResponsiveContainer>

            {selectedLap && (
                <div className="mt-4">
                    <Button
                        onClick={() => setSelectedLap(null)}
                        className="mb-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                        Deselect Lap
                    </Button>
                    <DriverRaceTelemetryPlots
                        driverCode={driverCode}
                        year={year}
                        round={round}
                        lapNumber={selectedLap}
                    />
                </div>
            )}

        </div>
    )
}

export default RacePacePlot
