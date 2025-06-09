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

async function QualifyingResult({ year, round }) {

    const res = await fetch(`http:localhost:8000/races/qualifying/result/${year}/${round}`)
    if (res.status === 500) {
        return (
            <div className='p-10'>
                <h1 className='font-bold text-center text-xl'>No Qualifying Data Availabale!</h1>
            </div>
        )
    }
    const data = await res.json()
    console.log(res.status)


    return (
        <div>

            <h1 className='text-center font-bold text-xl p-10'>Qualifying Result for Round {round}</h1>

            <Table className="w-full border">
                <TableCaption>Qualifying Results</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Position</TableHead>
                        <TableHead className="font-bold text-lg">Driver</TableHead>
                        <TableHead className="font-bold text-lg">Constructor</TableHead>
                        <TableHead className="font-bold text-lg">Q1</TableHead>
                        <TableHead className="font-bold text-lg">Q2</TableHead>
                        <TableHead className="font-bold text-lg">Q3</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((driver => (
                        <TableRow key={driver.position}>
                            <TableCell>{driver.position}</TableCell>
                            <TableCell>{driver.Driver.givenName} {driver.Driver.familyName}</TableCell>
                            <TableCell>{driver.Constructor.name}</TableCell>
                            <TableCell>{driver.Q1}</TableCell>
                            <TableCell>{driver.Q2 || ""}</TableCell>
                            <TableCell>{driver.Q3 || ""}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default QualifyingResult
