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

async function ConstructorStandings({year}) {

    const res = await fetch(`http://localhost:8000/standings/constructors/${year}`)
    const data = await res.json()
    // console.log(data)

    return (
        <div>

            <h1>Constructor Standings {year}</h1>

            <Table className="w-fit border">
                <TableCaption>Constructor Standings</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Constructor</TableHead>
                        <TableHead>Wins</TableHead>
                        <TableHead>Points</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((constructor => (
                        <TableRow key={constructor.Constructor.constructorId}>
                            <TableCell>{constructor.position}</TableCell>
                            <TableCell>{constructor.Constructor.name}</TableCell>
                            <TableCell>{constructor.wins}</TableCell>
                            <TableCell>{constructor.points}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default ConstructorStandings

