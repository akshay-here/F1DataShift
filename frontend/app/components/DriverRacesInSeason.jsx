"use client"

import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import GradientText from '../StyleComponents/GradientText/GradientText'

function DriverRacesInSeason({ driverId, year }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchDriverRacesInSeason() {
            setLoading(true)
            try {
                const response = await fetch(`http://localhost:8000/drivers/${driverId}/races/${year}`)

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                }
                const results = await response.json()
                setData(results)
                setError(null)
            } catch (err) {
                console.error("Fetch error: ", err.message)
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }
        if (driverId && year) {
            fetchDriverRacesInSeason()
        }
    }, [driverId, year])

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Race Results in {year}...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Race Results in {year}</h2>
                <p className="text-gray-600 text-center">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">Race Results in {year}</h2>
                <p className="text-gray-600 text-center">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <div className='p-10 text-2xl'>
                <GradientText colors={["#aa3dd9", "#4078ff", "#40ffaa", "#dea5e8"]} animationSpeed={2} showBorder={false} className="custom-class" >{driverId.toUpperCase()} Race Results in {year} season</GradientText>
            </div>

            <div className='p-10'>
                <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                    <TableCaption>{driverId} Race Results in {year}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-white font-bold text-lg">Round</TableHead>
                            <TableHead className="text-white font-bold text-lg">Race</TableHead>
                            <TableHead className="text-white font-bold text-lg">Circuit</TableHead>
                            <TableHead className="text-white font-bold text-lg">Position</TableHead>
                            <TableHead className="text-white font-bold text-lg">Status</TableHead>
                            <TableHead className="text-white font-bold text-lg">Points</TableHead>
                            <TableHead className="text-white font-bold text-lg">Grid</TableHead>
                            <TableHead className="text-white font-bold text-lg">Laps</TableHead>
                            <TableHead className="text-white font-bold text-lg">Constructor</TableHead>
                            <TableHead className="text-white font-bold text-lg">Date</TableHead>
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
