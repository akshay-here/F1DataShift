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
import Link from 'next/link'

function DriversList({ year }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDriverList() {
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${year}`)

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
        if (year) {
            fetchDriverList()
        }
    }, [year])

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Drivers...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Drivers</h2>
                <p className="text-gray-600 text-center">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">Drivers</h2>
                <p className="text-gray-600 text-center">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                <TableCaption>Drivers in {year}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white font-bold text-lg">Driver</TableHead>
                        <TableHead className="text-white font-bold text-lg">Code</TableHead>
                        <TableHead className="text-white font-bold text-lg">Number</TableHead>
                        <TableHead className="text-white font-bold text-lg">Nationality</TableHead>
                        <TableHead className="text-white font-bold text-lg">DOB</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((driver => (
                        <TableRow key={driver.driverId}>
                            <TableCell>
                                <Link href={`/driver/${driver.driverId}`} className='text-white hover:text-blue-700 hover:underline'>
                                    {driver.givenName} {driver.familyName}
                                </Link>
                            </TableCell>
                            <TableCell>{driver.code || driver.familyName.slice(0, 3).toUpperCase()}</TableCell>
                            <TableCell>{driver.permanentNumber || ""}</TableCell>
                            <TableCell>{driver.nationality}</TableCell>
                            <TableCell>{driver.dateOfBirth}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>
        </div>
    )
}

export default DriversList
