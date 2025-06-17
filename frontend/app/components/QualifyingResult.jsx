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

function QualifyingResult({ year, round }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pre1994, setPre1994] = useState(false)

    useEffect(() => {
        async function fetchQualifyingResults() {
            setLoading(true)
            setError(null)
            setData(null)

            try {
                const response = await fetch(`http://localhost:8000/races/qualifying/result/${year}/${round}`)
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
            if (year < 1994) {
                setPre1994(true)
                setLoading(false)
                setError(null)
                setData(null)
            } else {
                setPre1994(false)
                fetchQualifyingResults()
            }
        }
    }, [year, round])

    if (pre1994) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Qualifying Result</h2>
                <p className="text-gray-600 mt-2">
                    Qualifying Data available only from 1994 onwards.
                </p>
            </div>
        )
    }

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Qualifying Results...</div>
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Qualifying Results</h2>
                <p className="text-red-500 mt-2">Error: {error}</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Qualifying Results</h2>
                <p className="text-gray-600 mt-2">No data available.</p>
            </div>
        )
    }


    return (
        <div>

            <h1 className='text-center font-bold text-xl p-10'>Qualifying Result for Round {round}</h1>

            <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                <TableCaption>Qualifying Results</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white font-bold text-lg">Position</TableHead>
                        <TableHead className="text-white font-bold text-lg">Driver</TableHead>
                        <TableHead className="text-white font-bold text-lg">Constructor</TableHead>
                        <TableHead className="text-white font-bold text-lg">Q1</TableHead>
                        <TableHead className="text-white font-bold text-lg">Q2</TableHead>
                        <TableHead className="text-white font-bold text-lg">Q3</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((driver => (
                        <TableRow key={driver.position}>
                            <TableCell>{driver.position}</TableCell>
                            <TableCell>{driver.Driver.givenName} {driver.Driver.familyName}</TableCell>
                            <TableCell>{driver.Constructor.name}</TableCell>
                            <TableCell>{driver.Q1}</TableCell>
                            <TableCell>{driver.Q2 || "-"}</TableCell>
                            <TableCell>{driver.Q3 || "-"}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default QualifyingResult
