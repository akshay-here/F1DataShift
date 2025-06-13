"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Button } from '@/components/ui/button'
import DriverRaceTelemetryPlots from './DriverRaceTelemetryPlots'

function RacePacePlot({ driverCodes, year, round }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedLap, setSelectedLap] = useState(null)

    useEffect(() => {
        async function fetchRacePace() {
            setLoading(true)
            setError(null)
            try {
                const driverData = await Promise.all(
                    driverCodes.map(async (code) => {
                        const response = await fetch(`http://localhost:8000/driverplots/racepace/${code}/${year}/${round}`, {
                            headers: { 'Accept': 'application/json' },
                        })
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${await response.text()}`)
                        }
                        return await response.json()
                    })
                )
                // Combine data for Recharts
                const maxLaps = Math.max(...driverData.map(d => d.lapData.length))
                const combinedData = Array.from({ length: maxLaps }, (_, index) => {
                    const combinedPoint = { lapNumber: index + 1 }
                    driverData.forEach(driver => {
                        const lap = driver.lapData.find(l => l.lapNumber === index + 1)
                        if (lap) {
                            combinedPoint[`lapTime_${driver.driverCode}`] = lap.lapTime
                        }
                    })
                    return combinedPoint
                }).filter(point => Object.keys(point).length > 1) // Remove empty points
                setData({ drivers: driverData, combinedData })
                setError(null)
            } catch (err) {
                console.error(`Fetch error for race pace ${driverCodes.join(', ')}/${year}/${round}:`, err.message)
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }
        if (driverCodes.length > 0 && year && round) {
            fetchRacePace()
        } else {
            setData(null)
            setLoading(false)
            setError(null)
        }
    }, [driverCodes, year, round])

    const handleLapClick = (data) => {
        if (data && data.activePayload && data.activePayload[0]) {
            const lap = data.activePayload[0].payload.lapNumber
            setSelectedLap(lap === selectedLap ? null : lap) // Toggle selection
        }
    }

    if (loading) {
        return <div className="text-lg font-medium text-gray-600 text-center pt-10">Loading Race Pace Plot...</div>
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Race Pace Plot</h2>
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (!data || !data.drivers.length) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Race Pace Plot</h2>
                <p className="text-gray-600">Select drivers to view race pace</p>
            </div>
        )
    }

    const lapTimes = data.combinedData.flatMap(point => 
        Object.values(point).filter(v => typeof v === 'number' && v !== point.lapNumber)
    )
    const minLapTime = Math.min(...lapTimes)
    const maxLapTime = Math.max(...lapTimes)

    return (
        <div className="p-6 bg-white shadow-md mt-6">
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
                Race Pace Plot (Year {year}, Round {round})
            </h2>
            <ResponsiveContainer width="100%" height={500}>
                <LineChart
                    data={data.combinedData}
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
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value, name) => [`${value.toFixed(3)} s`, name.replace('lapTime_', '')]}
                        labelFormatter={lap => `Lap: ${lap}`}
                    />
                    <Legend />
                    {data.drivers.map(driver => (
                        <Line
                            key={`lapTime_${driver.driverCode}`}
                            type="monotone"
                            dataKey={`lapTime_${driver.driverCode}`}
                            stroke={driver.teamColor}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name={driver.driverCode}
                        />
                    ))}
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
                        driverCodes={driverCodes}
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