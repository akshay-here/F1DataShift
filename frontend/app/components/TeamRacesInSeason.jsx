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

async function TeamRacesInSeason({ constructorId, year }) {

    const teamRes = await fetch(`http://localhost:8000/teams/${constructorId}/races/${year}`)
    if (teamRes.status === 500) {
        return (
            <div>
                <h1 className='text-center font-bold text-xl'>No Race Data found in {year}</h1>
            </div>
        )
    }
    const data = await teamRes.json()

    return (
        <div>

            <h1 className='text-center font-bold text-xl'>{constructorId.toUpperCase()} Race Results in {year} season</h1>

            <div className='p-10'>
                <Table className="w-full border">
                    <TableCaption>{constructorId} Race Results in {year}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold text-lg">Round</TableHead>
                            <TableHead className="font-bold text-lg">Race</TableHead>
                            <TableHead className="font-bold text-lg">Circuit</TableHead>
                            <TableHead className="font-bold text-lg">Drivers</TableHead>
                            <TableHead className="font-bold text-lg">Position</TableHead>
                            <TableHead className="font-bold text-lg">Status</TableHead>
                            <TableHead className="font-bold text-lg">Points</TableHead>
                            <TableHead className="font-bold text-lg">Grid</TableHead>
                            <TableHead className="font-bold text-lg">Laps</TableHead>
                            <TableHead className="font-bold text-lg">Date</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((round => (
                            <TableRow key={round.round}>
                                <TableCell>{round.round}</TableCell>
                                <TableCell>{round.raceName}</TableCell>
                                <TableCell>{round.Circuit.circuitName}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId} className='font-bold'>
                                        {driver.Driver.familyName}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.position}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.status}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.points}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.grid}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.laps}
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

export default TeamRacesInSeason
