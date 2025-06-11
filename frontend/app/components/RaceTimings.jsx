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

async function RaceTimings({ year, round }) {

    const timingsRes = await fetch(`http://localhost:8000/races/schedule/${year}/${round}`)
    if (timingsRes.status === 500) {
        return (
            <div>
                <h1 className='text-center font-bold text-xl'>No Timings Data found for this Race</h1>
            </div>
        )
    }
    const data = await timingsRes.json()

    return (
        <div>

            <h1 className='text-center font-bold text-xl'>Schedule for the {year} Season, Round {round}</h1>

            <Table className="w-full border">
                <TableCaption>Race Schedule</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Round</TableHead>
                        <TableHead className="font-bold text-lg">Race</TableHead>
                        <TableHead className="font-bold text-lg">Circuit</TableHead>
                        <TableHead className="font-bold text-lg">Race</TableHead>
                        <TableHead className="font-bold text-lg">Qualifying</TableHead>
                        <TableHead className="font-bold text-lg">FP1</TableHead>
                        <TableHead className="font-bold text-lg">FP2</TableHead>
                        <TableHead className="font-bold text-lg">FP3</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                        <TableRow>
                            <TableCell>{data.round}</TableCell>
                            <TableCell>{data.season} {data.raceName}</TableCell>
                            <TableCell>{data.Circuit.circuitName}</TableCell>
                            <TableCell>{data.date}, {data.time || ""}</TableCell>
                            <TableCell>{data.Qualifying?.date || ""}, {data.Qualifying?.time || ""}</TableCell>
                            <TableCell>{data.FirstPractice?.date || ""}, {data.FirstPractice?.time || ""}</TableCell>
                            <TableCell>{data.SecondPractice?.date || ""}, {data.SecondPractice?.time || ""}</TableCell>
                            <TableCell>{data.ThirdPractice?.date || ""}, {data.ThirdPractice?.time || ""}</TableCell>
                        </TableRow>
                </TableBody>
            </Table>

        </div>
    )
}

export default RaceTimings
