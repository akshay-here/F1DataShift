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

function ConstructorStandings({ year, round }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchConstructorStandings() {
            setLoading(true)
            try {
                const endpoint = round === null
                    ? `http://localhost:8000/standings/constructors/${year}`
                    : `http://localhost:8000/standings/constructors/${year}/${round}`

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
            fetchConstructorStandings()
        }
    }, [year])



    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Constructor Standings...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">{year} Constructor Standings</h2>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">{year} Constructor Standings</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div>

            {round == null
                ? <h1 className='text-center font-bold text-xl p-10'>Constructor Standings {year}</h1>
                : <h1 className='text-center font-bold text-xl p-10'>Constructor Standings after Round {round}</h1>
            }

            <Table className="w-full border">
                <TableCaption>{round == null ? <h1>Cosntructor Standings {year}</h1> : <h1>Constructor Standings after Round {round}</h1>}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Position</TableHead>
                        <TableHead className="font-bold text-lg">Constructor</TableHead>
                        <TableHead className="font-bold text-lg">Wins</TableHead>
                        <TableHead className="font-bold text-lg">Points</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((constructor => (
                        <TableRow key={constructor.Constructor.constructorId}>
                            <TableCell>{constructor.position}</TableCell>
                            <TableCell>{constructor.Constructor.name}</TableCell>
                            <TableCell>{constructor.wins}</TableCell>
                            <TableCell>{constructor.points}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default ConstructorStandings

