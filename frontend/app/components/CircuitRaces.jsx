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
import GradientText from '../StyleComponents/GradientText/GradientText'

function CircuitRaces({ circuitId }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCircuitRaces() {
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/circuits/${circuitId}/races`)

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
        if (circuitId) {
            fetchCircuitRaces()
        }
    }, [circuitId])

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Circuit Races...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Circuit Races</h2>
                <p className="text-gray-600 text-center">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Circuit Races</h2>
                <p className="text-gray-600 text-center">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <div className='p-10 text-2xl'>
                <GradientText colors={["#aa3dd9", "#4078ff", "#40ffaa", "#dea5e8"]} animationSpeed={2} showBorder={false} className="custom-class" >All races in {data[0].Circuit.circuitName}</GradientText>
            </div>

            <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                <TableCaption>All Races</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white font-bold text-lg">Round</TableHead>
                        <TableHead className="text-white font-bold text-lg">Race</TableHead>
                        <TableHead className="text-white font-bold text-lg">Winner</TableHead>
                        <TableHead className="text-white font-bold text-lg">Podium</TableHead>
                        <TableHead className="text-white font-bold text-lg">Laps</TableHead>
                        <TableHead className="text-white font-bold text-lg">Date</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((race) => {
                        const winner = race.Results?.find(r => r.position === "1");
                        const podium = [
                            race.Results?.find(r => r.position === "1")?.Driver?.familyName,
                            race.Results?.find(r => r.position === "2")?.Driver?.familyName,
                            race.Results?.find(r => r.position === "3")?.Driver?.familyName,
                        ].filter(Boolean).join(', ') || 'N/A';
                        return (
                            <TableRow key={`${race.season}-${winner?.Driver?.familyName}`}>
                                <TableCell>{race.round}</TableCell>
                                <TableCell>
                                    <Link href={`/races/${race.season}/${race.round}`} className='text-white hover:text-blue-700 hover:underline'>
                                        {race.season} {race.raceName}
                                    </Link>
                                </TableCell>
                                <TableCell>{winner?.Driver?.familyName || 'N/A'}</TableCell>
                                <TableCell>{podium}</TableCell>
                                <TableCell>{winner?.laps || 'N/A'}</TableCell>
                                <TableCell>{race.date}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

        </div>
    )
}

export default CircuitRaces
