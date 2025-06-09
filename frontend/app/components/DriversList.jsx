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

async function DriversList({ year }) {

    const res = await fetch(`http://localhost:8000/drivers/${year}`)
    if (res.status === 500) {
        return (
            <div className='p-10'>
                <h1 className='font-bold text-center text-xl'>No Drivers Available for {year}!</h1>
            </div>
        )
    }
    const data = await res.json()

    return (
        <div>

            <Table className="w-full border">
                <TableCaption>Drivers in {year}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Driver</TableHead>
                        <TableHead className="font-bold text-lg">Code</TableHead>
                        <TableHead className="font-bold text-lg">Number</TableHead>
                        <TableHead className="font-bold text-lg">Nationality</TableHead>
                        <TableHead className="font-bold text-lg">DOB</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((driver => (
                        <TableRow key={driver.driverId}>
                            <TableCell>{driver.givenName} {driver.familyName}</TableCell>
                            <TableCell>{driver.code || driver.familyName.slice(0, 3).toUpperCase()}</TableCell>
                            <TableCell>{driver.permanentNumber || ""}</TableCell>
                            <TableCell>{driver.nationality}</TableCell>
                            <TableCell>{driver.dateOfBirth}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
        </div>
    )
}

export default DriversList
