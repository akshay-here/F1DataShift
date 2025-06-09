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

async function DriverStandings({ year, round }) {

    const endpoint = round === null
        ? `http://localhost:8000/standings/drivers/${year}`
        : `http://localhost:8000/standings/drivers/${year}/${round}`

    const res = await fetch(endpoint)
    const data = await res.json()
    // console.log(data)

    return (
        <div>
            {round == null
                ? <h1 className='text-center font-bold text-xl p-10'>Driver Standings {year}</h1>
                : <h1 className='text-center font-bold text-xl p-10'>Driver Standings after Round {round}</h1>
            }

            <Table className="w-full border">
                <TableCaption>{round == null ? <h1>Driver Standings {year}</h1> : <h1>Driver Standings after Round {round}</h1>}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Position</TableHead>
                        <TableHead className="font-bold text-lg">Driver</TableHead>
                        <TableHead className="font-bold text-lg">Constructor</TableHead>
                        <TableHead className="font-bold text-lg">Wins</TableHead>
                        <TableHead className="font-bold text-lg">Points</TableHead>
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

