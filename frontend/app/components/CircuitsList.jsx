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

async function CircuitsList() {

    const res = await fetch(`http://localhost:8000/circuits/all`)
    const data = await res.json()

    return (
        <div>

            <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                <TableCaption>Circuits in F{1}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white font-bold text-lg">Circuit Name</TableHead>
                        <TableHead className="text-white font-bold text-lg">Locality</TableHead>
                        <TableHead className="text-white font-bold text-lg">Country</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((circuit => (
                        <TableRow key={circuit.circuitId}>
                            <TableCell>
                                <Link href={`/circuits/${circuit.circuitId}`} className='text-white hover:text-blue-700 hover:underline'>
                                    {circuit.circuitName}
                                </Link>
                            </TableCell>
                            <TableCell>{circuit.Location.locality}</TableCell>
                            <TableCell>{circuit.Location.country}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CircuitsList
