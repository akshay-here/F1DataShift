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

function PitstopList({ year, round }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pre2011, setPre2011] = useState(false)

    useEffect(() => {
        async function fetchPitstopList() {
            setLoading(true)
            setError(null)
            setData(null)

            try {
                const response = await fetch(`http://localhost:8000/races/pitstops/${year}/${round}`)
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

        if (year && round) {
            if (year < 2011) {
                setPre2011(true)
                setLoading(false)
                setError(null)
                setData(null)
            } else {
                setPre2011(false)
                fetchPitstopList()
            }
        }
    }, [year, round])

    if (pre2011) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Pitstop List</h2>
                <p className="text-gray-600 mt-2">
                    Pitstop Data available only from 2011 onwards.
                </p>
            </div>
        )
    }

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Pitstop List...</div>
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Pitstop List</h2>
                <p className="text-red-500 mt-2">Error: {error}</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Pitstop List</h2>
                <p className="text-gray-600 mt-2">No data available.</p>
            </div>
        )
    }

    return (
        <div>

            <h1 className='text-center text-xl font-bold'>Pitstop List for round {round}</h1>

            <Table className="w-full border">
                <TableCaption>PitStops</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Driver</TableHead>
                        <TableHead className="font-bold text-lg">Stops</TableHead>
                        <TableHead className="font-bold text-lg">Laps</TableHead>
                        <TableHead className="font-bold text-lg">Duration</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((pitstop => (
                        <TableRow key={pitstop.driverId}>
                            <TableCell>{pitstop.driverId}</TableCell>
                            <TableCell>{pitstop.stops}</TableCell>
                            <TableCell>{pitstop.lap.join(", ")}</TableCell>
                            <TableCell>{pitstop.duration.join(", ")}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
        </div>
    )
}

export default PitstopList
