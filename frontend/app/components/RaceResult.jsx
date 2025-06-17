"use client"

import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import GradientText from '../StyleComponents/GradientText/GradientText'

function RaceResult({ year, round }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRaceResult() {
            setLoading(true)
            try {
                const response = await fetch(`http://localhost:8000/races/result/${year}/${round}`)

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                }
                const results = await response.json()
                setData(results)
                setError(null)
            } catch (err) {
                console.error("Fetch error: ", err.message)
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }
        if (year && round) {
            fetchRaceResult()
        }
    }, [year, round])

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Race Result...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Race Result</h2>
                <p className="text-gray-600 text-center">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Race Result</h2>
                <p className="text-gray-600 text-center">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <div className='p-10 text-2xl'>
                <GradientText colors={["#aa3dd9", "#4078ff", "#40ffaa", "#dea5e8"]} animationSpeed={2} showBorder={false} className="custom-class" >Race Results</GradientText>
            </div>

            <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                <TableCaption>Race Results</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white font-bold text-lg">Position</TableHead>
                        <TableHead className="text-white font-bold text-lg">Driver</TableHead>
                        <TableHead className="text-white font-bold text-lg">Constructor</TableHead>
                        <TableHead className="text-white font-bold text-lg">Time</TableHead>
                        <TableHead className="text-white font-bold text-lg">Laps</TableHead>
                        <TableHead className="text-white font-bold text-lg">Points</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((driver => (
                        <TableRow key={driver.Driver.driverId}>
                            <TableCell>{driver.position}</TableCell>
                            <TableCell>{driver.Driver.givenName} {driver.Driver.familyName}</TableCell>
                            <TableCell>{driver.Constructor.name}</TableCell>
                            <TableCell>{driver.status === "Finished" ? driver.Time.time : driver.status}</TableCell>
                            <TableCell>{driver.laps}</TableCell>
                            <TableCell>{driver.points}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default RaceResult
