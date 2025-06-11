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

async function CircuitRaces({ circuitId }) {

    const circuitRacesRes = await fetch(`http://localhost:8000/circuits/${circuitId}/races`)
    if (circuitRacesRes.status === 500) {
        return (
            <div>
                <h1 className='text-center font-bold text-xl'>No Race data found for this circuit</h1>
            </div>
        )
    }
    const data = await circuitRacesRes.json()

    return (
        <div>

            <h1 className='text-center font-bold text-xl p-10'>All races in {data[0].Circuit.circuitName}</h1>

            <Table className="w-full border">
                <TableCaption>All Races</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-lg">Round</TableHead>
                        <TableHead className="font-bold text-lg">Race</TableHead>
                        <TableHead className="font-bold text-lg">Winner</TableHead>
                        <TableHead className="font-bold text-lg">Podium</TableHead>
                        <TableHead className="font-bold text-lg">Laps</TableHead>
                        <TableHead className="font-bold text-lg">Date</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((race) => {
                        const winner = race.Results?.find(r => r.position === "1");
                        const podium = [
                            race.Results?.find(r => r.position === "1")?.Driver?.familyName,
                            race.Results?.find(r => r.position === "2")?.Driver?.familyName,
                            race.Results?.find(r => r.position === "3")?.Driver?.familyName,
                        ].filter(Boolean).join(', ') || 'N/A';
                        return (
                            <TableRow key={`${race.season}-${winner?.Driver?.familyName}`}>
                                <TableCell>{race.round}</TableCell>
                                <TableCell>{race.season} {race.raceName}</TableCell>
                                <TableCell>{winner?.Driver?.familyName || 'N/A'}</TableCell>
                                <TableCell>{podium}</TableCell>
                                <TableCell>{winner?.laps || 'N/A'}</TableCell>
                                <TableCell>{race.date}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

        </div>
    )
}

export default CircuitRaces
