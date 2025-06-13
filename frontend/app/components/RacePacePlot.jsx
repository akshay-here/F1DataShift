"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function RacePacePlot({ driverCode, year, round }) {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    return (
        <div className='pt-20'>

            <h1 className="text-center font-semibold text-xl">Race Pace Plot for {data.driverCode} ({year}, Round {round})</h1>

            <ResponsiveContainer width="100%" height={500}>
                <LineChart data={data.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                    <XAxis
                        dataKey="lapNumber"
                        label={{ value: 'Lap Number', position: 'insideBottom', offset: -5 }}
                        tickFormatter={value => Math.round(value)}
                        interval={0}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        label={{ value: 'Lap Time (s)', angle: -90, position: 'insideLeft' }}
                        domain={['auto', data => Math.ceil(data / 10) * 10]}
                        tickFormatter={value => value.toFixed(1)}
                        interval={0}
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
                        activeDot={{ r: 6 }}
                        name={data.driverCode}
                    />
                </LineChart>
            </ResponsiveContainer>

        </div>
    )
}

export default RacePacePlot
