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
import Link from 'next/link'

async function TeamsList({ year }) {

    const res = await fetch(`http://localhost:8000/teams/${year}`)
    if (res.status === 500) {
        return (
            <div className='p-10'>
                <h1 className='font-bold text-center text-xl'>No Teams Availabale for {year}!</h1>
            </div>
        )
    }
    const data = await res.json()

    return (
        <div>

            <Table className="w-full border">
                <TableCaption>Teams in {year}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Team Name</TableHead>
                        <TableHead className="font-bold text-lg">Nationality</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((team => (
                        <TableRow key={team.constructorId}>
                            <TableCell>
                                <Link href={`/team/${team.constructorId}`} className='text-blue-500 hover:text-blue-700 hover:underline'>
                                    {team.name}
                                </Link>
                            </TableCell>
                            <TableCell>{team.nationality}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
        </div>
    )
}

export default TeamsList
