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

function DriverStats({ driverId }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDriverStats() {
            setLoading(true)
            try {
                const response = await fetch(`http://localhost:8000/drivers/${driverId}/stats`)
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
        if (driverId) {
            fetchDriverStats()
        }
    }, [driverId])



    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Driver Statistics...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Driver Statistics</h2>
                <p className="text-gray-600 text-center">Too many Requests being sent. Try again after a few minutes!</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">Driver Statistics</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <div className='p-10'>
                <h1 className='text-center font-bold text-xl pb-5'>Driver Stats</h1>
                <h1>Season Driven: {data.careerStats.seasonsDriven}</h1>
                <h2>Championships: {data.careerStats.championships}</h2>
                <h2>Wins: {data.careerStats.wins}</h2>
                <h2>Poles: {data.careerStats.poles}</h2>
                <h2>Podiums: {data.careerStats.podiums}</h2>
                <h2>Total Races: {data.careerStats.totalRaces}</h2>
                <h2>Total Points: {data.careerStats.totalPoints}</h2>
                <h2>Sprint Wins: {data.careerStats.sprintWins || 0}</h2>
                <h2>Fastest Laps: {data.careerStats.fastestLaps || 0}</h2>
                <h2>Points Finishes: {data.careerStats.pointsFinishes}</h2>
                <h2>Outside Points Finishes: {data.careerStats.outsidePoints}</h2>
            </div>

            <div className='p-10'>
                <h1 className='text-center font-bold text-xl pb-5'>Driver Seasons</h1>

                <Table className="w-full border">
                    <TableCaption>Driver Seasons</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold text-lg">Year</TableHead>
                            <TableHead className="font-bold text-lg">Championshoip Position</TableHead>
                            <TableHead className="font-bold text-lg">Points</TableHead>
                            <TableHead className="font-bold text-lg">Wins</TableHead>
                            <TableHead className="font-bold text-lg">Constructor</TableHead>
                            <TableHead className="font-bold text-lg">Rounds</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.yearlyStandings.map((year => (
                            <TableRow key={year.year}>
                                <TableCell>
                                    <Link href={`/driver/${driverId}/${year.year}`} className='text-blue-500 hover:text-blue-700 hover:underline'>
                                        {year.year}
                                    </Link>
                                </TableCell>
                                <TableCell>{year.position}</TableCell>
                                <TableCell>{year.points}</TableCell>
                                <TableCell>{year.wins}</TableCell>
                                <TableCell>{year.constructor}</TableCell>
                                <TableCell>{year.rounds}</TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>

            </div>

        </div>
    )
}

export default DriverStats
