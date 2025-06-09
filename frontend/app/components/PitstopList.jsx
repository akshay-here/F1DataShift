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

async function PitstopList({ year, round }) {

    const res = await fetch(`http://localhost:8000/races/pitstops/${year}/${round}`)
    if (res.status == 500) {
        return (
            <div className='text-center font-bold text-xl'>
                <h1>No PitStop Data Available!</h1>
            </div>
        )
    }
    const data = await res.json()

    return (
        <div>

            <h1 className='text-center text-xl font-bold'>Pitstop List for round {round}</h1>

            <Table className="w-full border">
                <TableCaption>PitStops</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Driver</TableHead>
                        <TableHead className="font-bold text-lg">Stops</TableHead>
                        <TableHead className="font-bold text-lg">Laps</TableHead>
                        <TableHead className="font-bold text-lg">Duration</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((pitstop => (
                        <TableRow key={pitstop.driverId}>
                            <TableCell>{pitstop.driverId}</TableCell>
                            <TableCell>{pitstop.stops}</TableCell>
                            <TableCell>{pitstop.lap.join(", ")}</TableCell>
                            <TableCell>{pitstop.duration.join(", ")}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
        </div>
    )
}

export default PitstopList
