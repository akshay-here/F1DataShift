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

async function ConstructorStandings({ year, round }) {

    const endpoint = round === null
        ? `http://localhost:8000/standings/constructors/${year}`
        : `http://localhost:8000/standings/constructors/${year}/${round}`

    const res = await fetch(endpoint)
    const data = await res.json()
    // console.log(data)

    return (
        <div>

            {round == null ? <h1>Constructor Standings {year}</h1> : <h1>Constructor Standings after Round {round}</h1>}

            <Table className="w-full border">
                <TableCaption>{round == null ? <h1>Cosntructor Standings {year}</h1> : <h1>Constructor Standings after Round {round}</h1>}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Position</TableHead>
                        <TableHead className="font-bold text-lg">Constructor</TableHead>
                        <TableHead className="font-bold text-lg">Wins</TableHead>
                        <TableHead className="font-bold text-lg">Points</TableHead>
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

