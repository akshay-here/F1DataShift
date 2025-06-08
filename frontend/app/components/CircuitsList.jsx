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

async function CircuitsList() {

    const res = await fetch(`http://localhost:8000/circuits/all`)
    const data = await res.json()

    return (
        <div>

            <Table className="w-full border">
                <TableCaption>Circuits in F{1}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Circuit Name</TableHead>
                        <TableHead className="font-bold text-lg">Locality</TableHead>
                        <TableHead className="font-bold text-lg">Countyr</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((circuit => (
                        <TableRow key={circuit.circuitId}>
                            <TableCell>{circuit.circuitName}</TableCell>
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
