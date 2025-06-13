"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function DriverRaceTelemetryPlots({ driverCode, year, round, lapNumber }) {

    const [telemetryData, setTelemetryData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!driverCode || !year || !round || !lapNumber) {
            setTelemetryData(null)
            setError(null)
            setLoading(false)
            return
        }

        async function fetchTelemetry() {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`http://localhost:8000/driverplots/racetelemetry/${driverCode}/${year}/${round}/${lapNumber}`, {
                    headers: { 'Accept': 'application/json' },
                })
                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`HTTP ${response.status}: ${errorText}`)
                }
                const telData = await response.json()

                // Prepare telemetry data for Recharts
                const chartData = telData.telemetry.map(point => ({
                    distance: point.distance,
                    speed: point.speed,
                    throttle: point.throttle,
                    brake: point.brake,
                    rpm: point.rpm,
                    gear: point.gear,
                    drs: point.drs
                }))

                setTelemetryData({ ...telData, chartData })
                setError(null)
            } catch (err) {
                console.error(`Fetch error for telemetry ${driverCode}/${year}/${round}/Lap ${lapNumber}:`, err.message, err.stack)
                setError(err.message)
                setTelemetryData(null)
            } finally {
                setLoading(false)
            }
        }
        console.log(`Fetching telemetry for lap ${lapNumber} of ${driverCode}/${year}/${round}`)
        fetchTelemetry()
    }, [driverCode, year, round, lapNumber])

    if (!lapNumber) {
        return null
    }

    if (loading) {
        return <div className="text-lg font-medium text-gray-600 text-center">Loading Telemetry...</div>
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Telemetry Plot</h2>
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (!telemetryData) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Telemetry Plot</h2>
                <p className="text-gray-600">No telemetry data available</p>
            </div>
        )
    }

    // Custom tooltip for telemetry plots
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-300 shadow">
                    <p>{`Distance: ${label.toFixed(1)} m`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value !== null ? entry.value.toFixed(1) : 'N/A'}${entry.name === 'speed' ? ' km/h' : entry.name === 'throttle' || entry.name === 'brake' ? ' %' : entry.name === 'rpm' ? '' : ''}`}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className='space-y-10'>

            {/* Speed Plot */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Speed (km/h) - Lap {lapNumber}</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={telemetryData.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <XAxis
                            dataKey="distance"
                            label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
                            tickFormatter={value => Math.round(value)}
                            interval={50}
                            minTickGap={40}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }}
                            domain={['auto', 'auto']}
                            tickFormatter={value => value.toFixed(0)}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="speed"
                            stroke={telemetryData.teamColor}
                            strokeWidth={2}
                            dot={false}
                            name="Speed"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Throttle Plot */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Throttle (%) - Lap {lapNumber}</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={telemetryData.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <XAxis
                            dataKey="distance"
                            label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
                            tickFormatter={value => Math.round(value)}
                            interval={50}
                            minTickGap={40}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            label={{ value: 'Throttle (%)', angle: -90, position: 'insideLeft' }}
                            domain={[0, 100]}
                            tickFormatter={value => value.toFixed(0)}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="throttle"
                            stroke={telemetryData.teamColor}
                            strokeWidth={2}
                            dot={false}
                            name="Throttle"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Brake Plot */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Brake (%) - Lap {lapNumber}</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={telemetryData.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <XAxis
                            dataKey="distance"
                            label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
                            tickFormatter={value => Math.round(value)}
                            interval={50}
                            minTickGap={40}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            label={{ value: 'Brake', angle: -90, position: 'insideLeft' }}
                            domain={[0, 1]}
                            ticks={[0, 1]}
                            tickFormatter={value => value.toFixed(0)}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="step"
                            dataKey="brake"
                            stroke={telemetryData.teamColor}
                            strokeWidth={2}
                            dot={false}
                            name="Brake"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* RPM Plot */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">RPM - Lap {lapNumber}</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={telemetryData.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <XAxis
                            dataKey="distance"
                            label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
                            tickFormatter={value => Math.round(value)}
                            interval={50}
                            minTickGap={40}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            label={{ value: 'RPM', angle: -90, position: 'insideLeft' }}
                            domain={['auto', 'auto']}
                            tickFormatter={value => value.toFixed(0)}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="rpm"
                            stroke={telemetryData.teamColor}
                            strokeWidth={2}
                            dot={false}
                            name="RPM"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Gear Plot */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Gear - Lap {lapNumber}</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={telemetryData.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <XAxis
                            dataKey="distance"
                            label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
                            tickFormatter={value => Math.round(value)}
                            interval={50}
                            minTickGap={40}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            label={{ value: 'Gear', angle: -90, position: 'insideLeft' }}
                            domain={[1, 8]}
                            tickFormatter={value => Math.round(value)}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="step"
                            dataKey="gear"
                            stroke={telemetryData.teamColor}
                            strokeWidth={2}
                            dot={false}
                            name="Gear"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* DRS Plot */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">DRS - Lap {lapNumber}</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={telemetryData.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <XAxis
                            dataKey="distance"
                            label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
                            tickFormatter={value => Math.round(value)}
                            interval={50}
                            minTickGap={40}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            label={{ value: 'DRS', angle: -90, position: 'insideLeft' }}
                            domain={[0, 1]}
                            tickFormatter={value => value.toFixed(0)}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="step"
                            dataKey="drs"
                            stroke={telemetryData.teamColor}
                            strokeWidth={2}
                            dot={false}
                            name="DRS"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}

export default DriverRaceTelemetryPlots
