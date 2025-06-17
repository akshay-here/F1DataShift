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

function RaceTimings({ year, round }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRaceTimings() {
            setLoading(true)
            try {
                const response = await fetch(`http://localhost:8000/races/schedule/${year}/${round}`)

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                }
                const timings = await response.json()
                setData(timings)
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
            fetchRaceTimings()
        }
    }, [year, round])

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Race Timings...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Race Timings</h2>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">Race Timings</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <h1 className='text-center font-bold text-xl'>Schedule for the {year} Season, Round {round}</h1>

            <Table className="w-full border">
                <TableCaption>Race Schedule</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white font-bold text-lg">Round</TableHead>
                        <TableHead className="text-white font-bold text-lg">Race</TableHead>
                        <TableHead className="text-white font-bold text-lg">Circuit</TableHead>
                        <TableHead className="text-white font-bold text-lg">Race</TableHead>
                        <TableHead className="text-white font-bold text-lg">Qualifying</TableHead>
                        <TableHead className="text-white font-bold text-lg">FP1</TableHead>
                        <TableHead className="text-white font-bold text-lg">FP2</TableHead>
                        <TableHead className="text-white font-bold text-lg">FP3</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow>
                        <TableCell>{data.round}</TableCell>
                        <TableCell>{data.season} {data.raceName}</TableCell>
                        <TableCell>{data.Circuit.circuitName}</TableCell>
                        <TableCell>{data.date} {data.time || ""}</TableCell>
                        <TableCell>{data.Qualifying?.date || ""} {data.Qualifying?.time || ""}</TableCell>
                        <TableCell>{data.FirstPractice?.date || ""} {data.FirstPractice?.time || ""}</TableCell>
                        <TableCell>{data.SecondPractice?.date || ""} {data.SecondPractice?.time || ""}</TableCell>
                        <TableCell>{data.ThirdPractice?.date || ""} {data.ThirdPractice?.time || ""}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </div>
    )
}

export default RaceTimings
