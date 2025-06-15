"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'

function DriverRaceTelemetryPlots({ driverCodes, year, round, lapNumber }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchTelemetry() {
            setLoading(true)
            setError(null)
            try {
                const driverData = await Promise.all(
                    driverCodes.map(async (code) => {
                        const response = await fetch(`http://localhost:8000/driverplots/racetelemetry/${code}/${year}/${round}/${lapNumber}`, {
                            headers: { 'Accept': 'application/json' },
                        })
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${await response.text()}`)
                        }
                        return await response.json()
                    })
                )
                // Combine telemetry data for Recharts
                const maxPoints = Math.max(...driverData.map(d => d.telemetry.length))
                const combinedData = Array.from({ length: maxPoints }, (_, index) => {
                    const combinedPoint = {}
                    driverData.forEach(driver => {
                        const point = driver.telemetry[index]
                        if (point) {
                            combinedPoint.distance = point.distance
                            combinedPoint[`speed_${driver.driverCode}`] = point.speed
                            combinedPoint[`throttle_${driver.driverCode}`] = point.throttle
                            combinedPoint[`brake_${driver.driverCode}`] = point.brake
                            combinedPoint[`rpm_${driver.driverCode}`] = point.rpm
                            combinedPoint[`gear_${driver.driverCode}`] = point.gear
                            combinedPoint[`drs_${driver.driverCode}`] = point.drs
                        }
                    })
                    return combinedPoint
                }).filter(point => point.distance !== undefined)
                setData({ drivers: driverData, combinedData })
                setError(null)
            } catch (err) {
                console.error(`Fetch error for telemetry ${driverCodes.join(', ')}/${year}/${round}/Lap ${lapNumber}:`, err.message)
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }
        if (driverCodes.length > 0 && year && round && lapNumber) {
            fetchTelemetry()
        } else {
            setData(null)
            setLoading(false)
            setError(null)
        }
    }, [driverCodes, year, round, lapNumber])

    if (!lapNumber) {
        return null
    }

    if (loading) {
        return <div className="text-lg font-medium text-gray-600 text-center pt-4">Loading Telemetry...</div>
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Race Telemetry Plots</h2>
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (!data || !data.drivers.length) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Race Telemetry Plots</h2>
                <p className="text-gray-600">No telemetry data available</p>
            </div>
        )
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-300 shadow">
                    <p>{`Distance: ${label.toFixed(1)} m`}</p>
                    {payload.map((entry, index) => {
                        const driverCode = entry.name.replace(/^(speed|throttle|brake|rpm|gear|drs)_/, '')
                        const isStepMetric = ['brake', 'drs', 'gear'].some(m => entry.name.startsWith(`${m}_`))
                        return (
                            <p key={index} style={{ color: entry.color }}>
                                {`${driverCode}: ${entry.value !== null
                                    ? isStepMetric
                                        ? entry.value.toFixed(0)
                                        : entry.value.toFixed(1)
                                    : 'N/A'
                                    }${entry.name.startsWith('speed_') ? ' km/h' : entry.name.startsWith('throttle_') ? ' %' : ''}`}
                            </p>
                        )
                    })}
                </div>
            )
        }
        return null
    }

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
        <div className="p-6 bg-white shadow-md mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
                Race Telemetry Plots - Lap {lapNumber} (Year {year}, Round {round})
            </h2>

            {/* Speed Plot */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
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
                    <Legend />
                    {strokeStyles.map(style => (
                        <Line
                            key={`speed_${style.driverCode}`}
                            type="monotone"
                            dataKey={`speed_${style.driverCode}`}
                            stroke={style.teamColor}
                            strokeWidth={2}
                            strokeDasharray={style.strokeDasharray}
                            dot={false}
                            name={style.driverCode}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* Throttle Plot */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
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
                    <Legend />
                    {strokeStyles.map(style => (
                        <Line
                            key={`throttle_${style.driverCode}`}
                            type="monotone"
                            dataKey={`throttle_${style.driverCode}`}
                            stroke={style.teamColor}
                            strokeWidth={2}
                            strokeDasharray={style.strokeDasharray}
                            dot={false}
                            name={style.driverCode}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* Brake Plot */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
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
                    <Legend />
                    {strokeStyles.map(style => (
                        <Line
                            key={`brake_${style.driverCode}`}
                            type="step"
                            dataKey={`brake_${style.driverCode}`}
                            stroke={style.teamColor}
                            strokeWidth={2}
                            strokeDasharray={style.strokeDasharray}
                            dot={false}
                            name={style.driverCode}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* RPM Plot */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
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
                    <Legend />
                    {strokeStyles.map(style => (
                        <Line
                            key={`rpm_${style.driverCode}`}
                            type="monotone"
                            dataKey={`rpm_${style.driverCode}`}
                            stroke={style.teamColor}
                            strokeWidth={2}
                            strokeDasharray={style.strokeDasharray}
                            dot={false}
                            name={style.driverCode}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* Gear Plot */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
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
                    <Legend />
                    {strokeStyles.map(style => (
                        <Line
                            key={`gear_${style.driverCode}`}
                            type="step"
                            dataKey={`gear_${style.driverCode}`}
                            stroke={style.teamColor}
                            strokeWidth={2}
                            strokeDasharray={style.strokeDasharray}
                            dot={false}
                            name={style.driverCode}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* DRS Plot */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
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
                        ticks={[0, 1]}
                        tickFormatter={value => value.toFixed(0)}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {strokeStyles.map(style => (
                        <Line
                            key={`drs_${style.driverCode}`}
                            type="step"
                            dataKey={`drs_${style.driverCode}`}
                            stroke={style.teamColor}
                            strokeWidth={2}
                            strokeDasharray={style.strokeDasharray}
                            dot={false}
                            name={style.driverCode}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DriverRaceTelemetryPlots