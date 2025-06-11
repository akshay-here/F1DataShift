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

async function RaceSchedule({ year }) {

    const res = await fetch(`http://localhost:8000/races/schedule/${year}`)
    if (res.status === 500) {
        return (
            <div className='p-10'>
                <h1 className='font-bold text-center text-xl'>No Race Schedule found for the year {year}!</h1>
            </div>
        )
    }
    const data = await res.json()

    return (
        <div>

            <Table className="w-full border mx-auto">
                <TableCaption>Race Schedule</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Round</TableHead>
                        <TableHead className="font-bold text-lg">Race</TableHead>
                        <TableHead className="font-bold text-lg">Circuit</TableHead>
                        <TableHead className="font-bold text-lg">Date</TableHead>
                        <TableHead className="font-bold text-lg">Locality</TableHead>
                        <TableHead className="font-bold text-lg">Country</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((race => (
                        <TableRow key={race.round}>
                            <TableCell>{race.round}</TableCell>
                            <TableCell>
                                <Link href={`/races/${year}/${race.round}`} className='text-blue-500 hover:text-blue-700 hover:underline'>
                                    {race.season} {race.raceName}
                                </Link>
                            </TableCell>
                            <TableCell>{race.Circuit.circuitName}</TableCell>
                            <TableCell>{race.date}</TableCell>
                            <TableCell>{race.Circuit.Location.locality}</TableCell>
                            <TableCell>{race.Circuit.Location.country}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default RaceSchedule
