"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function ComparisonQualifyingSpeedTrace({ driverCodes, year, round }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                const driverData = await Promise.all(
                    driverCodes.map(async (code) => {
                        const response = await fetch(`http://localhost:8000/driverplots/qualifyingspeedtrace/${code}/${year}/${round}`, {
                            headers: { 'Accept': 'application/json' }
                        })
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${await response.text()}`)
                        }
                        return await response.json()
                    })
                )
                // Combine data for Recharts
                const maxPoints = Math.max(...driverData.map(d => d.telemetry.length))
                const combinedData = Array.from({ length: maxPoints }, (_, index) => {
                    const combinedPoint = {}
                    driverData.forEach(driver => {
                        const point = driver.telemetry[index]
                        if (point) {
                            combinedPoint.distance = point.distance
                            combinedPoint[`speed_${driver.driverCode}`] = point.speed
                        }
                    })
                    return combinedPoint
                }).filter(point => point.distance !== undefined)
                setData({ drivers: driverData, combinedData })
                setError(null)
            } catch (err) {
                console.error(`Error fetching speed traces for ${driverCodes.join(', ')}:`, err.message)
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }
        if (driverCodes.length > 0 && year && round) {
            fetchData()
        } else {
            setData(null)
            setLoading(false)
            setError(null)
        }
    }, [driverCodes, year, round])

    if (loading) {
        return <div className="text-lg font-medium text-gray-600 text-center pt-4">Loading Speed Traces...</div>
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Qualifying Speed Traces</h2>
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (!data || !data.drivers.length) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Qualifying Speed Traces</h2>
                <p className="text-gray-600">Select drivers to view speed traces</p>
            </div>
        )
    }

    return (
        <div className="p-6 bg-white shadow-md mt-6">
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
                Qualifying Speed Traces (Year {year}, Round {round})
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <XAxis
                        dataKey="distance"
                        label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
                        tickFormatter={value => Math.round(value)}
                        interval={100}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }}
                        domain={['auto', 'auto']}
                        tickFormatter={value => value.toFixed(0)}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value, name) => [`${value.toFixed(1)} km/h`, name.replace('speed_', '')]}
                        labelFormatter={value => `Distance: ${value.toFixed(1)} m`}
                    />
                    <Legend />
                    {data.drivers.map(driver => (
                        <Line
                            key={driver.driverCode}
                            type="monotone"
                            dataKey={`speed_${driver.driverCode}`}
                            stroke={driver.teamColor}
                            strokeWidth={2}
                            dot={false}
                            name={driver.driverCode}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ComparisonQualifyingSpeedTrace