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

function Sprintresult({ year, round }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pre2021, setPre2021] = useState(false)

    useEffect(() => {
        async function fetchSprintResult() {
            setLoading(true)
            setError(null)
            setData(null)

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/races/sprint/result/${year}/${round}`)
                if (!response.ok) {
                    return (
                        <div className="p-10 text-center">
                            <h2 className="text-xl font-bold">Sprint Result</h2>
                            <p className="text-gray-600 mt-2">
                                Not a Sprint Weekend.
                            </p>
                        </div>
                    )
                }

                const results = await response.json()
                if (results.length === 0) {
                    setData(null)
                } else {
                    setData(results)
                }
                setError(null)
            } catch (err) {
                console.error("Fetch error: ", err.message)
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }

        if (year && round) {
            if (year < 2021) {
                setPre2021(true)
                setLoading(false)
                setError(null)
                setData(null)
            } else {
                setPre2021(false)
                fetchSprintResult()
            }
        }
    }, [year, round])

    if (pre2021) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Sprint Result</h2>
                <p className="text-gray-600 mt-2">
                    Sprint races were introduced in 2021. Please select a year from 2021 onward.
                </p>
            </div>
        )
    }

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Sprint Result...</div>
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold">Sprint Result</h2>
                <p className="text-gray-600 text-center">
                    Not a Sprint Weekend.
                </p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold">Sprint Result</h2>
                <p className="text-gray-600 text-center">This race is not a sprint weekend.</p>
            </div>
        )
    }


    return (
        <div>

            <div className='p-10 text-2xl'>
                <GradientText colors={["#aa3dd9", "#4078ff", "#40ffaa", "#dea5e8"]} animationSpeed={2} showBorder={false} className="custom-class" >Sprint Results</GradientText>
            </div>

            <Table className="w-full border bg-gradient-to-r from-purple-900 via-teal-900 to-blue-900 text-lg">
                <TableCaption>Sprint Results</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white font-bold text-lg">Position</TableHead>
                        <TableHead className="text-white font-bold text-lg">Driver</TableHead>
                        <TableHead className="text-white font-bold text-lg">Constructor</TableHead>
                        <TableHead className="text-white font-bold text-lg">Time</TableHead>
                        <TableHead className="text-white font-bold text-lg">Grid</TableHead>
                        <TableHead className="text-white font-bold text-lg">Laps</TableHead>
                        <TableHead className="text-white font-bold text-lg">Points</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((driver => (
                        <TableRow key={driver.Driver.driverId}>
                            <TableCell>{driver.position}</TableCell>
                            <TableCell>{driver.Driver.givenName} {driver.Driver.familyName}</TableCell>
                            <TableCell>{driver.Constructor.name}</TableCell>
                            <TableCell>{driver.status === "Finished" ? driver.Time.time : driver.status}</TableCell>
                            <TableCell>{driver.grid}</TableCell>
                            <TableCell>{driver.laps}</TableCell>
                            <TableCell>{driver.points}</TableCell>
                        </TableRow>
                    )))}
                </TableBody>
            </Table>

        </div>
    )
}

export default Sprintresult
