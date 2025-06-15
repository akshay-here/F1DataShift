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

function Sprintresult({ year, round }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pre2021, setPre2021] = useState(false)

    useEffect(() => {
        async function fetchSprintResult() {
            setLoading(true)
            setError(null)
            setData(null)

            try {
                const response = await fetch(`http://localhost:8000/races/sprint/result/${year}/${round}`)
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
            if (year < 2021) {
                setPre2021(true)
                setLoading(false)
                setError(null)
                setData(null)
            } else {
                setPre2021(false)
                fetchSprintResult()
            }
        }
    }, [year, round])

    if (pre2021) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Sprint Result</h2>
                <p className="text-gray-600 mt-2">
                    Sprint races were introduced in 2021. Please select a year from 2021 onward.
                </p>
            </div>
        )
    }

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Sprint Result...</div>
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Sprint Result</h2>
                <p className="text-gray-600 mt-2">
                    Not a Sprint Weekend.
                </p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Sprint Result</h2>
                <p className="text-gray-600 mt-2">This race is not a sprint weekend.</p>
            </div>
        )
    }


    return (
        <div>

            <h1 className='text-center font-bold text-xl p-10'>Sprint Result for Round {round}</h1>

            <Table className="w-full border">
                <TableCaption>Sprint Results</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Position</TableHead>
                        <TableHead className="font-bold text-lg">Driver</TableHead>
                        <TableHead className="font-bold text-lg">Constructor</TableHead>
                        <TableHead className="font-bold text-lg">Time</TableHead>
                        <TableHead className="font-bold text-lg">Grid</TableHead>
                        <TableHead className="font-bold text-lg">Laps</TableHead>
                        <TableHead className="font-bold text-lg">Points</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((driver => (
                        <TableRow key={driver.Driver.driverId}>
                            <TableCell>{driver.position}</TableCell>
                            <TableCell>{driver.Driver.givenName} {driver.Driver.familyName}</TableCell>
                            <TableCell>{driver.Constructor.name}</TableCell>
                            <TableCell>{driver.status === "Finished" ? driver.Time.time : driver.status}</TableCell>
                            <TableCell>{driver.grid}</TableCell>
                            <TableCell>{driver.laps}</TableCell>
                            <TableCell>{driver.points}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default Sprintresult
