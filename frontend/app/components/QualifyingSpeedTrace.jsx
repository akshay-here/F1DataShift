// will be a client component as the speed traace will be interactive
"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function QualifyingSpeedTrace({ driverCode, year, round }) {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchQualiSpeedTrace() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`http://localhost:8000/driverplots/qualifyingspeedtrace/${driverCode}/${year}/${round}`, {
                    headers: { 'Accept': 'application/json' },
                })
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${await res.text()}`)
                }

                const telemetryData = await res.json()

                const chartData = telemetryData.telemetry.map(point => (
                    {
                        distance: point.distance,
                        speed: point.speed
                    }
                ))

                setData({ ...telemetryData, chartData })
                setError(null)
            } catch (err) {
                onsole.error(`Fetch error for telemetry ${driver}/${year}/${round}:`, err.message)
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }

        if (year && round && driverCode) {
            fetchQualiSpeedTrace()
        }
    }, [year, round, driverCode])

    if (loading) {
        return <div className="text-lg font-medium text-gray-600 text-center">Loading Qualifying Speed Trace...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Qualifying Speed Trace</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!data || !data.telemetry.length) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Qualifying Speed Trace</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div className='pt-20'>

            <h1 className='text-center font-semibold text-xl'>Qualifying Speed Trace for {driverCode}</h1>

            <ResponsiveContainer width="100%" height={500}>
                <LineChart data={data.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                    <XAxis
                        dataKey="distance"
                        label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
                        tickFormatter={value => Math.round(value)}
                    />
                    <YAxis
                        label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        formatter={(value) => `${value.toFixed(1)} km/h`}
                        labelFormatter={distance => `Distance: ${distance.toFixed(1)} m`}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="speed"
                        stroke={data.teamColor}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5 }}
                        name={data.driverCode}
                    />
                </LineChart>
            </ResponsiveContainer>

        </div>
    )
}

export default QualifyingSpeedTrace
