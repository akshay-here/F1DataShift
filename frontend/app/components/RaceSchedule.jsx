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

async function RaceSchedule({year}) {

    const res = await fetch(`http://localhost:8000/races/${year}`)
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
                            <TableCell>{race.season} {race.raceName}</TableCell>
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
