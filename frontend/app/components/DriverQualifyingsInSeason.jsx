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

async function DriverQualifyingsInSeason({ driverId, year }) {

    const driverRes = await fetch(`http://localhost:8000/drivers/${driverId}/qualifying/${year}`)
    if (driverRes.status === 500) {
        return (
            <div className='p-10'>
                <h1 className='text-center font-bold text-xl'>No Qualifying Data found in {year}</h1>
            </div>
        )
    }
    const data = await driverRes.json()

    return (
        <div>

            <h1 className='text-center font-bold text-xl'>{driverId.toUpperCase()} Qualifying Results in {year} season</h1>

            <div className='p-10'>
                <Table className="w-full border">
                    <TableCaption>{driverId} Qualifying Results in {year}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold text-lg">Round</TableHead>
                            <TableHead className="font-bold text-lg">Race</TableHead>
                            <TableHead className="font-bold text-lg">Circuit</TableHead>
                            <TableHead className="font-bold text-lg">Position</TableHead>
                            <TableHead className="font-bold text-lg">Constructor</TableHead>
                            <TableHead className="font-bold text-lg">Q1</TableHead>
                            <TableHead className="font-bold text-lg">Q2</TableHead>
                            <TableHead className="font-bold text-lg">Q3</TableHead>
                            <TableHead className="font-bold text-lg">Date</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((round => (
                            <TableRow key={round.round}>
                                <TableCell>{round.round}</TableCell>
                                <TableCell>{round.raceName}</TableCell>
                                <TableCell>{round.Circuit.circuitName}</TableCell>
                                <TableCell>{round.QualifyingResults[0].position}</TableCell>
                                <TableCell>{round.QualifyingResults[0].Constructor.name}</TableCell>
                                <TableCell>{round.QualifyingResults[0].Q1}</TableCell>
                                <TableCell>{round.QualifyingResults[0].Q2 || "N/A"}</TableCell>
                                <TableCell>{round.QualifyingResults[0].Q3 || "N/A"}</TableCell>
                                <TableCell>{round.date}</TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </div>


        </div>
    )
}

export default DriverQualifyingsInSeason
