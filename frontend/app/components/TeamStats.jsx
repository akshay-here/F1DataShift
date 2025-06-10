import React from 'react'
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

async function TeamStats({ constructorId }) {

    const teamRes = await fetch(`http://localhost:8000/teams/${constructorId}/stats`)
    if (teamRes.status === 500) {
        return (
            <div>
                <h1 className='text-center font-bold text-xl'>No Data found for team {constructorId}</h1>
            </div>
        )
    }
    if (teamRes.status === 429) {
        return (
            <div className='p-10'>
                <h1 className='text-center font-bold text-xl'>Too Many Requests Being Sent. Please Try Again Later</h1>
            </div>
        )
    }
    const data = await teamRes.json()

    return (
        <div>

            <div className='p-10'>
                <h1 className='text-center font-bold text-xl pb-5'>Team Stats</h1>
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
                <h1 className='text-center font-bold text-xl pb-5'>Team Seasons</h1>

                <Table className="w-full border">
                    <TableCaption>Team Seasons</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold text-lg">Year</TableHead>
                            <TableHead className="font-bold text-lg">Championshoip Position</TableHead>
                            <TableHead className="font-bold text-lg">Points</TableHead>
                            <TableHead className="font-bold text-lg">Wins</TableHead>
                            <TableHead className="font-bold text-lg">Rounds</TableHead>
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
