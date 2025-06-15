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

function DriverStandings({ year, round }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDriverStandings() {
            setLoading(true)
            try {
                const endpoint = round === null
                    ? `http://localhost:8000/standings/drivers/${year}`
                    : `http://localhost:8000/standings/drivers/${year}/${round}`

                const response = await fetch(endpoint)
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                }
                const standings = await response.json()
                setData(standings)
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
            fetchDriverStandings()
        }
    }, [year])



    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Driver Standings...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">{year} Driver Standings</h2>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">{year} Driver Standings</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div>
            {round == null
                ? <h1 className='text-center font-bold text-xl p-10'>Driver Standings {year}</h1>
                : <h1 className='text-center font-bold text-xl p-10'>Driver Standings after Round {round}</h1>
            }

            <Table className="w-full border">
                <TableCaption>{round == null ? <h1>Driver Standings {year}</h1> : <h1>Driver Standings after Round {round}</h1>}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Position</TableHead>
                        <TableHead className="font-bold text-lg">Driver</TableHead>
                        <TableHead className="font-bold text-lg">Constructor</TableHead>
                        <TableHead className="font-bold text-lg">Wins</TableHead>
                        <TableHead className="font-bold text-lg">Points</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((driver => (
                        <TableRow key={driver.Driver.driverId}>
                            <TableCell>{driver.position}</TableCell>
                            <TableCell>{driver.Driver.givenName} {driver.Driver.familyName}</TableCell>
                            <TableCell>{driver.Constructors[0]?.name}</TableCell>
                            <TableCell>{driver.wins}</TableCell>
                            <TableCell>{driver.points}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default DriverStandings

