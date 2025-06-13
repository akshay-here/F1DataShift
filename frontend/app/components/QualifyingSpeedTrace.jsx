// will be a client component as the speed traace will be interactive
"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Toggle } from "@/components/ui/toggle"

function QualifyingSpeedTrace({ driverCode, year, round }) {

    const [view, setView] = useState("distance") // "distance" or "corners"
    const [data, setData] = useState({ distance: null, corners: null })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchQualiSpeedTrace() {
            setLoading(true)
            setError(null)
            try {
                // Fetch distance-based data
                const distanceRes = await fetch(`http://localhost:8000/driverplots/qualifyingspeedtrace/${driverCode}/${year}/${round}`, {
                    headers: { 'Accept': 'application/json' },
                })
                if (!distanceRes.ok) {
                    throw new Error(`Distance data: HTTP ${distanceRes.status}: ${await distanceRes.text()}`)
                }
                const distanceData = await distanceRes.json()
                const distanceChartData = distanceData.telemetry.map(point => ({
                    distance: point.distance,
                    speed: point.speed
                }))

                // Fetch corner-based data
                const cornersRes = await fetch(`http://localhost:8000/driverplots/qualifyingspeedtrace/corners/${driverCode}/${year}/${round}`, {
                    headers: { 'Accept': 'application/json' },
                })
                if (!cornersRes.ok) {
                    throw new Error(`Corners data: HTTP ${cornersRes.status}: ${await cornersRes.text()}`)
                }
                const cornersData = await cornersRes.json()
                const cornersChartData = cornersData.cornerData.map(point => ({
                    corner: point.corner,
                    speed: point.speed,
                    distance: point.distance
                }))

                setData({
                    distance: { ...distanceData, chartData: distanceChartData },
                    corners: { ...cornersData, chartData: cornersChartData }
                })
                setError(null)
            } catch (err) {
                console.error(`Fetch error for telemetry ${driverCode}/${year}/${round}:`, err.message)
                setError(err.message)
                setData({ distance: null, corners: null })
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

    if (!data[view] || !data[view].chartData.length) {
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
                <LineChart data={data[view].chartData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                    <XAxis
                        dataKey={view === "distance" ? "distance" : "corner"}
                        label={{
                            value: view === "distance" ? "Distance (m)" : "Corner",
                            position: "insideBottom",
                            offset: -5
                        }}
                        tickFormatter={value => view === "distance" ? Math.round(value) : value}
                        interval={view === "distance" ? 50 : 0}
                        minTickGap={view === "distance" ? 40 : undefined}
                        tick={view === "corners" ? { fontSize: 12 } : { fontSize: 12 }}
                    />
                    <YAxis
                        label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }}
                        domain={['auto', data => Math.ceil(data / 10) * 10 + 20]}
                    />
                    <Tooltip
                        formatter={(value) => `${value.toFixed(1)} km/h`}
                        labelFormatter={label => view === "distance" ? `Distance: ${label.toFixed(1)} m` : `Corner: ${label}`}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white p-2 border border-gray-300 shadow">
                                        <p>{view === "distance" ? `Distance: ${label.toFixed(1)} m` : `Corner: ${label}`}</p>
                                        <p>{`Speed: ${payload[0].value.toFixed(1)} km/h`}</p>
                                        {view === "corners" && <p>{`Distance: ${payload[0].payload.distance.toFixed(1)} m`}</p>}
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Legend />
                    {view === "corners" && data.corners.chartData.map(point => (
                        <ReferenceLine
                            key={point.corner}
                            x={point.corner}
                            stroke="grey"
                            strokeDasharray="3 3"
                            strokeOpacity={0.5}
                        />
                    ))}
                    <Line
                        type="monotone"
                        dataKey="speed"
                        stroke={data[view].teamColor}
                        strokeWidth={2}
                        dot={view === "corners" ? { r: 4 } : false}
                        activeDot={{ r: 6 }}
                        name={data[view].driverCode}
                    />
                </LineChart>
            </ResponsiveContainer>

            <Toggle
                pressed={view === "corners"}
                onPressedChange={() => setView(view === "distance" ? "corners" : "distance")}
                className="bg-gray-200 text-gray-800 font-semibold data-[state=on]:bg-gray-800 data-[state=on]:text-white px-4 py-2 rounded-md"
            >
                {view === "distance" ? "Show Corners" : "Show Distance"}
            </Toggle>

        </div>
    )
}

export default QualifyingSpeedTrace
