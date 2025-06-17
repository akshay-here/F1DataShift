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

function TeamStats({ constructorId }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeamStats() {
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${constructorId}/stats`)
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
        if (constructorId) {
            fetchTeamStats()
        }
    }, [constructorId])



    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Constructor Statistics...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Constructor Statistics</h2>
                <p className="text-gray-600 text-center">Too many Requests being sent. Try again after a few minutes!</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">Constructor Statistics</h2>
                <p className="text-gray-600 text-center">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <div className='p-10 text-xl font-extrabold'>
                <div className='p-10 text-2xl'>
                    <GradientText colors={["#aa3dd9", "#4078ff", "#40ffaa", "#dea5e8"]} animationSpeed={2} showBorder={false} className="custom-class" >Team Stats</GradientText>
                </div>
                <h1>Years Raced: {data.careerStats.yearsRaced}</h1>
                <h2>Championships: {data.careerStats.championships}</h2>
                <h2>Wins: {data.careerStats.wins}</h2>
                <h2>Poles: {data.careerStats.poles}</h2>
                <h2>Podiums: {data.careerStats.podiums}</h2>
                <h2>Total Races: {data.careerStats.totalRaces}</h2>
                <h2>Total Points: {data.careerStats.totalPoints}</h2>
                <h2>Sprint Wins: {data.careerStats.sprintWins || 0}</h2>
                <h2>Fastest Laps: {data.careerStats.fastestLaps || 0}</h2>
            </div>

            <div className='p-10'>
                <div className='p-10 text-2xl'>
                    <GradientText colors={["#aa3dd9", "#4078ff", "#40ffaa", "#dea5e8"]} animationSpeed={2} showBorder={false} className="custom-class" >Team Seasons</GradientText>
                </div>

                <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                    <TableCaption>Team Seasons</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-white font-bold text-lg">Year</TableHead>
                            <TableHead className="text-white font-bold text-lg">Championshoip Position</TableHead>
                            <TableHead className="text-white font-bold text-lg">Points</TableHead>
                            <TableHead className="text-white font-bold text-lg">Wins</TableHead>
                            <TableHead className="text-white font-bold text-lg">Rounds</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.yearlyStandings.map((year => (
                            <TableRow key={year.year}>
                                <TableCell>
                                    <Link href={`/team/${constructorId}/${year.year}`} className='text-blue-500 hover:text-blue-700 hover:underline'>
                                        {year.year}
                                    </Link>
                                </TableCell>
                                <TableCell>{year.position}</TableCell>
                                <TableCell>{year.points}</TableCell>
                                <TableCell>{year.wins}</TableCell>
                                <TableCell>{year.rounds}</TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>

            </div>

        </div>
    )
}

export default TeamStats
