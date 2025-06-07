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

async function DriverStandings() {

    const res = await fetch("http://localhost:8000/standings/drivers/2025")
    const data = await res.json()
    // console.log(data)

    return (
        <div>

            <h1>Driver Standings</h1>

            <Table className="w-fit border">
                <TableCaption>Driver Standings</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Constructor</TableHead>
                        <TableHead>Wins</TableHead>
                        <TableHead>Points</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((driver => (
                        <TableRow key={driver.Driver.driverId}>
                            <TableCell>{driver.position}</TableCell>
                            <TableCell>{driver.Driver.givenName} {driver.Driver.familyName}</TableCell>
                            <TableCell>{driver.Constructors[0]?.name}</TableCell>
                            <TableCell>{driver.wins}</TableCell>
                            <TableCell>{driver.points}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default DriverStandings

