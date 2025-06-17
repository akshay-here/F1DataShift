"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'
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
                // Log raw driver data for debugging
                console.log('Driver Data:', driverData)

                // Determine total race laps (use actualLaps from first driver, assume consistent)
                const actualLaps = driverData[0]?.actualLaps || Math.max(...driverData.flatMap(driver =>
                    driver.lapData.map(lap => Number(lap.lapNumber))
                ))
                console.log('Actual Laps:', actualLaps)

                let combinedData;
                if (driverCodes.length === 1) {
                    // Single-driver mode: Include all laps from 1 to actualLaps
                    const driver = driverData[0]
                    combinedData = Array.from({ length: actualLaps }, (_, index) => {
                        const lapNumber = index + 1
                        const lap = driver.lapData.find(l => Number(l.lapNumber) === lapNumber)
                        const lapTime = lap && typeof lap.lapTime === 'number' && !isNaN(lap.lapTime) ? lap.lapTime : undefined
                        if (lapTime === undefined && lap) {
                            console.log(`Invalid lapTime for ${driver.driverCode}, lap ${lapNumber}:`, lap.lapTime)
                        }
                        return {
                            lapNumber,
                            [`lapTime_${driver.driverCode}`]: lapTime
                        }
                    })
                } else {
                    // Multi-driver mode: Include all laps from 1 to actualLaps
                    combinedData = Array.from({ length: actualLaps }, (_, index) => {
                        const lapNumber = index + 1
                        const combinedPoint = { lapNumber }
                        driverData.forEach(driver => {
                            const lap = driver.lapData.find(l => Number(l.lapNumber) === lapNumber)
                            const lapTime = lap && typeof lap.lapTime === 'number' && !isNaN(lap.lapTime) ? lap.lapTime : undefined
                            if (lapTime === undefined && lap) {
                                console.log(`Invalid lapTime for ${driver.driverCode}, lap ${lapNumber}:`, lap.lapTime)
                            }
                            combinedPoint[`lapTime_${driver.driverCode}`] = lapTime
                        })
                        return combinedPoint
                    })
                }

                // Log combined data for debugging
                console.log('Combined Data:', combinedData)
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

    // Determine strokeDasharray for each driver based on teamColor duplicates
    const colorCounts = {}
    const strokeStyles = data.drivers.map(driver => {
        const color = driver.teamColor
        colorCounts[color] = (colorCounts[color] || 0) + 1
        return {
            driverCode: driver.driverCode,
            teamColor: color,
            strokeDasharray: colorCounts[color] > 1 && colorCounts[color] === 2 ? '5 5' : '0'
        }
    })

    return (
        <div className="p-6 shadow-md mt-6">
            <h2 className="text-lg font-semibold text-center mb-4">
                Race Pace Plot (Year {year}, Round {round})
            </h2>
            <ResponsiveContainer width="100%" height={500}>
                <LineChart
                    data={data.combinedData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                    onClick={handleLapClick}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="lapNumber"
                        label={{ value: 'Lap Number', position: 'insideBottom', offset: -5, fill: "white" }}
                        tickFormatter={value => Math.round(value)}
                        tick={{ fontSize: 12, fill: "white" }}
                        domain={[1, 'dataMax']}
                        interval="preserveStartEnd"
                        tickCount={10}
                    />
                    <YAxis
                        label={{ value: 'Lap Time (s)', angle: -90, position: 'insideLeft', fill: "white" }}
                        domain={[minLapTime - 0.5, maxLapTime + 0.5]}
                        tickFormatter={value => value.toFixed(2)}
                        tickCount={10}
                        tick={{ fontSize: 12, fill: "white" }}
                    />
                    <Tooltip
                        wrapperStyle={{ backgroundColor: 'black', border: '2px solid white' }}
                        contentStyle={{ backgroundColor: 'black', color: 'white', border: 'none' }}
                        labelStyle={{ color: 'white' }}
                        formatter={(value, name) => [`${value ? value.toFixed(3) : 'N/A'} s`, name.replace('lapTime_', '')]}
                        labelFormatter={lap => `Lap: ${lap}`}
                    />
                    <Legend />
                    {strokeStyles.map(style => (
                        <Line
                            key={`lapTime_${style.driverCode}`}
                            type="monotone"
                            dataKey={`lapTime_${style.driverCode}`}
                            stroke={style.teamColor}
                            strokeWidth={2}
                            strokeDasharray={style.strokeDasharray}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name={style.driverCode}
                            connectNulls={true}
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