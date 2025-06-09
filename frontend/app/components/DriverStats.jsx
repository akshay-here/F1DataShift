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

async function DriverStats({ driverId }) {

    const driverRes = await fetch(`http://localhost:8000/drivers/${driverId}/stats`)
    if (driverRes.status === 500) {
        return (
            <div>
                <h1 className='text-center font-bold text-xl'>No Data found for driver {driverId}</h1>
            </div>
        )
    }
    const data = await driverRes.json()

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
                                <TableCell>{year.year}</TableCell>
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
