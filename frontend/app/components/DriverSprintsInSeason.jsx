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

function DriverSprintsInSeason({ driverId, year }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pre2021, setPre2021] = useState(false)

    useEffect(() => {
        async function fetchDriverSprintsInSeason() {
            setLoading(true)
            setError(null)
            setData(null)

            try {
                const response = await fetch(`http://localhost:8000/drivers/${driverId}/sprints/${year}`)
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`)
                }

                const results = await response.json()
                if (results.length === 0) {
                    setData(null)
                } else {
                    setData(results)
                }
                setError(null)
            } catch (err) {
                console.error("Fetch error: ", err.message)
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }

        if (driverId && year) {
            if (year < 2021) {
                setPre2021(true)
                setLoading(false)
                setError(null)
                setData(null)
            } else {
                setPre2021(false)
                fetchDriverSprintsInSeason()
            }
        }
    }, [year, driverId])

    if (pre2021) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Sprint Results in {year}</h2>
                <p className="text-gray-600 mt-2">
                    Sprint races were introduced in 2021. Please select a year from 2021 onward.
                </p>
            </div>
        )
    }

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Sprint Results in {year}...</div>
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Sprint Results in {year}</h2>
                <p className="text-gray-600 mt-2">
                    Not a Sprint Weekend.
                </p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Sprint Results in {year}</h2>
                <p className="text-gray-600 mt-2">This race is not a sprint weekend.</p>
            </div>
        )
    }

    return (
        <div>

            <h1 className='text-center font-bold text-xl'>{driverId.toUpperCase()} Sprint Results in {year} season</h1>

            <div className='p-10'>
                <Table className="w-full border">
                    <TableCaption>{driverId} Sprint Results in {year}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold text-lg">Round</TableHead>
                            <TableHead className="font-bold text-lg">Race</TableHead>
                            <TableHead className="font-bold text-lg">Circuit</TableHead>
                            <TableHead className="font-bold text-lg">Position</TableHead>
                            <TableHead className="font-bold text-lg">Points</TableHead>
                            <TableHead className="font-bold text-lg">Grid</TableHead>
                            <TableHead className="font-bold text-lg">Laps</TableHead>
                            <TableHead className="font-bold text-lg">Constructor</TableHead>
                            <TableHead className="font-bold text-lg">Date</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((round => (
                            <TableRow key={round.round}>
                                <TableCell>{round.round}</TableCell>
                                <TableCell>{round.raceName}</TableCell>
                                <TableCell>{round.Circuit.circuitName}</TableCell>
                                <TableCell>{round.SprintResults[0].positionText === "R" ? round.SprintResults[0].status : round.SprintResults[0].position}</TableCell>
                                <TableCell>{round.SprintResults[0].points}</TableCell>
                                <TableCell>{round.SprintResults[0].grid}</TableCell>
                                <TableCell>{round.SprintResults[0].laps}</TableCell>
                                <TableCell>{round.SprintResults[0].Constructor.name || "N/A"}</TableCell>
                                <TableCell>{round.date}</TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </div>


        </div>
    )
}

export default DriverSprintsInSeason
