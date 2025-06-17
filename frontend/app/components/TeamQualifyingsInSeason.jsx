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

function TeamQualifyingsInSeason({ constructorId, year }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pre1994, setPre1994] = useState(false)

    useEffect(() => {
        async function fetchTeamQualifyingInSeason() {
            setLoading(true)
            setError(null)
            setData(null)

            try {
                const response = await fetch(`http://localhost:8000/teams/${constructorId}/qualifying/${year}`)
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

        if (year && constructorId) {
            if (year < 1994) {
                setPre1994(true)
                setLoading(false)
                setError(null)
                setData(null)
            } else {
                setPre1994(false)
                fetchTeamQualifyingInSeason()
            }
        }
    }, [year, constructorId])

    if (pre1994) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Qualifying Results in {year}</h2>
                <p className="text-gray-600 mt-2">
                    Qualifying Data available only from 1994 onwards.
                </p>
            </div>
        )
    }

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Qualifying Results in {year}...</div>
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Qualifying Results in {year}</h2>
                <p className="text-red-500 mt-2">Error: {error}</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Qualifying Results in {year}</h2>
                <p className="text-gray-600 mt-2">No data available.</p>
            </div>
        )
    }

    return (
        <div>

            <h1 className='text-center font-bold text-xl'>{constructorId.toUpperCase()} Qualifying Results in {year} season</h1>

            <div className='p-10'>
                <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                    <TableCaption>{constructorId} Qualifying Results in {year}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-white font-bold text-lg">Round</TableHead>
                            <TableHead className="text-white font-bold text-lg">Race</TableHead>
                            <TableHead className="text-white font-bold text-lg">Circuit</TableHead>
                            <TableHead className="text-white font-bold text-lg">Drivers</TableHead>
                            <TableHead className="text-white font-bold text-lg">Position</TableHead>
                            <TableHead className="text-white font-bold text-lg">Q1</TableHead>
                            <TableHead className="text-white font-bold text-lg">Q2</TableHead>
                            <TableHead className="text-white font-bold text-lg">Q3</TableHead>
                            <TableHead className="text-white font-bold text-lg">Date</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((round => (
                            <TableRow key={round.round}>
                                <TableCell>{round.round}</TableCell>
                                <TableCell>{round.raceName}</TableCell>
                                <TableCell>{round.Circuit.circuitName}</TableCell>
                                <TableCell>{round.QualifyingResults.map(driver => (
                                    <p key={driver.Driver.driverId} className='font-bold'>
                                        {driver.Driver.familyName}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.QualifyingResults.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.position}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.QualifyingResults.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.Q1}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.QualifyingResults.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.Q2 || "N/A"}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.QualifyingResults.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.Q3 || "N/A"}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.date}</TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </div>


        </div>
    )
}

export default TeamQualifyingsInSeason
