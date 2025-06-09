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

async function RaceResult({ year, round }) {

    const res = await fetch(`http://localhost:8000/races/result/${year}/${round}`)
    if (res.status === 500) {
        return (
            <div className='p-10'>
                <h1 className='font-bold text-center text-xl'>No Race Result for {year} and {round}!</h1>
            </div>
        )
    }
    const data = await res.json()

    return (
        <div>

            <Table className="w-full border">
                <TableCaption>Race Results</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Position</TableHead>
                        <TableHead className="font-bold text-lg">Driver</TableHead>
                        <TableHead className="font-bold text-lg">Constructor</TableHead>
                        <TableHead className="font-bold text-lg">Time</TableHead>
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
                            <TableCell>{driver.laps}</TableCell>
                            <TableCell>{driver.points}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default RaceResult
