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

async function DriverRacesInSeason({ driverId, year }) {

    const driverRes = await fetch(`http://localhost:8000/drivers/${driverId}/races/${year}`)
    if (driverRes.status === 500) {
        return (
            <div>
                <h1 className='text-center font-bold text-xl'>No Race Data found in {year}</h1>
            </div>
        )
    }
    const data = await driverRes.json()

    return (
        <div>

            <h1 className='text-center font-bold text-xl'>{driverId.toUpperCase()} Race Results in {year} season</h1>

            <div className='p-10'>
                <Table className="w-full border">
                    <TableCaption>{driverId} Race Results in {year}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold text-lg">Round</TableHead>
                            <TableHead className="font-bold text-lg">Race</TableHead>
                            <TableHead className="font-bold text-lg">Circuit</TableHead>
                            <TableHead className="font-bold text-lg">Position</TableHead>
                            <TableHead className="font-bold text-lg">Status</TableHead>
                            <TableHead className="font-bold text-lg">Points</TableHead>
                            <TableHead className="font-bold text-lg">Grid</TableHead>
                            <TableHead className="font-bold text-lg">Laps</TableHead>
                            <TableHead className="font-bold text-lg">Constructor</TableHead>
                            <TableHead className="font-bold text-lg">Date</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((round => (
                            <TableRow key={round.round}>
                                <TableCell>{round.round}</TableCell>
                                <TableCell>{round.raceName}</TableCell>
                                <TableCell>{round.Circuit.circuitName}</TableCell>
                                <TableCell>{round.Results[0].position}</TableCell>
                                <TableCell>{round.Results[0].status} </TableCell>
                                <TableCell>{round.Results[0].points}</TableCell>
                                <TableCell>{round.Results[0].grid}</TableCell>
                                <TableCell>{round.Results[0].laps}</TableCell>
                                <TableCell>{round.Results[0].Constructor.name || "N/A"}</TableCell>
                                <TableCell>{round.date}</TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </div>


        </div>
    )
}

export default DriverRacesInSeason
