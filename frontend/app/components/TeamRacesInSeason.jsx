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

function TeamRacesInSeason({ constructorId, year }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchTeamRacesInSeason() {
            setLoading(true)
            try {
                const response = await fetch(`http://localhost:8000/teams/${constructorId}/races/${year}`)

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
        if (constructorId && year) {
            fetchTeamRacesInSeason()
        }
    }, [constructorId, year])

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
                <GradientText colors={["#aa3dd9", "#4078ff", "#40ffaa", "#dea5e8"]} animationSpeed={2} showBorder={false} className="custom-class" >{constructorId.toUpperCase()} Race Results in {year} season</GradientText>
            </div>

            <div className='p-10'>
                <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                    <TableCaption>{constructorId} Race Results in {year}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-white font-bold text-lg">Round</TableHead>
                            <TableHead className="text-white font-bold text-lg">Race</TableHead>
                            <TableHead className="text-white font-bold text-lg">Circuit</TableHead>
                            <TableHead className="text-white font-bold text-lg">Drivers</TableHead>
                            <TableHead className="text-white font-bold text-lg">Position</TableHead>
                            <TableHead className="text-white font-bold text-lg">Status</TableHead>
                            <TableHead className="text-white font-bold text-lg">Points</TableHead>
                            <TableHead className="text-white font-bold text-lg">Grid</TableHead>
                            <TableHead className="text-white font-bold text-lg">Laps</TableHead>
                            <TableHead className="text-white font-bold text-lg">Date</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((round => (
                            <TableRow key={round.round}>
                                <TableCell>{round.round}</TableCell>
                                <TableCell>{round.raceName}</TableCell>
                                <TableCell>{round.Circuit.circuitName}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId} className='font-bold'>
                                        {driver.Driver.familyName}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.position}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.status}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.points}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.grid}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.Results.map(driver => (
                                    <p key={driver.Driver.driverId}>
                                        {driver.laps}
                                    </p>
                                ))}</TableCell>
                                <TableCell>{round.date}</TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </div>


        </div>
    )
}

export default TeamRacesInSeason
