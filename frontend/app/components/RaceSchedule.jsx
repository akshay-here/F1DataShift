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
import Link from 'next/link'

function RaceSchedule({ year }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRaceSchedule() {
            setLoading(true)
            try {
                const response = await fetch(`http://localhost:8000/races/schedule/${year}`)

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                }
                const schedule = await response.json()
                setData(schedule)
                setError(null)
            } catch (err) {
                console.error('Fetch error:', err.message);
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false)
            }
        }
        if (year) {
            fetchRaceSchedule()
        }
    }, [year])

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Race Schedule...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">{year} Race Schedule</h2>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">{year} Race Schedule</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                <TableCaption>Race Schedule</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white font-bold text-lg">Round</TableHead>
                        <TableHead className="text-white font-bold text-lg">Race</TableHead>
                        <TableHead className="text-white font-bold text-lg">Circuit</TableHead>
                        <TableHead className="text-white font-bold text-lg">Date</TableHead>
                        <TableHead className="text-white font-bold text-lg">Locality</TableHead>
                        <TableHead className="text-white font-bold text-lg">Country</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((race => (
                        <TableRow key={race.round}>
                            <TableCell>{race.round}</TableCell>
                            <TableCell>
                                <Link href={`/races/${year}/${race.round}`} className='text-white hover:text-blue-700 hover:underline'>
                                    {race.season} {race.raceName}
                                </Link>
                            </TableCell>
                            <TableCell>{race.Circuit.circuitName}</TableCell>
                            <TableCell>{race.date}</TableCell>
                            <TableCell>{race.Circuit.Location.locality}</TableCell>
                            <TableCell>{race.Circuit.Location.country}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default RaceSchedule
