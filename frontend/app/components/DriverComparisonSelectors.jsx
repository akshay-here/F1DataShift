"use client"

import React, { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'

import ComparisonQualifyingSpeedTrace from './ComparisonQualifyingSpeedTrace'
import QualifyingTelemetryPlots from './QualifyingTelemetryPlots'
import RacePacePlot from './RacePacePlot'
import ShinyText from '../StyleComponents/ShinyText/ShinyText'

function DriverComparisonSelectors({ onSelect }) {
    const [year, setYear] = useState("")
    const [races, setRaces] = useState([])
    const [selectedRace, setSelectedRace] = useState("")
    const [drivers, setDrivers] = useState([])
    const [selectedDriverCodes, setSelectedDriverCodes] = useState([])
    const [currentDriver, setCurrentDriver] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 2018 + 1 }, (_, i) => 2018 + i)

    // Fetch races when year changes
    useEffect(() => {
        if (!year) return

        async function fetchRaces() {
            setLoading(true)
            setRaces([])
            setSelectedRace("")
            setDrivers([])
            setSelectedDriverCodes([])
            setCurrentDriver("")

            try {
                const raceRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/races/schedule/${year}`, {
                    headers: { "Accept": "application/json" }
                })
                if (!raceRes.ok) {
                    throw new Error(`HTTP ${raceRes.status}: ${await raceRes.text()}`)
                }

                const data = await raceRes.json()
                const now = new Date()
                const pastRaces = data.filter(race => new Date(race.date) <= now)
                console.log(`Fetched ${pastRaces.length} past races for ${year}`)
                setRaces(pastRaces)
                setError(null)
            } catch (err) {
                console.error(`Fetch error for year ${year}:`, err.message)
                setError(err.message)
                setRaces([])
            } finally {
                setLoading(false)
            }
        }
        fetchRaces()
    }, [year])

    // Fetch drivers when race changes
    useEffect(() => {
        if (!year || !selectedRace) return

        async function fetchDrivers() {
            setLoading(true)
            setDrivers([])
            setSelectedDriverCodes([])
            setCurrentDriver("")

            try {
                const driverRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${year}`, {
                    headers: { "Accept": "application/json" }
                })
                if (!driverRes.ok) {
                    throw new Error(`HTTP ${driverRes.status}: ${await driverRes.text()}`)
                }

                const driverData = await driverRes.json()
                setDrivers(driverData)
                setError(null)
            } catch (err) {
                console.error(`Fetch error for drivers ${year}/${selectedRace}:`, err.message)
                setError(err.message)
                setDrivers([])
            } finally {
                setLoading(false)
            }
        }
        fetchDrivers()
    }, [year, selectedRace])

    // Notify parent of selection changes
    useEffect(() => {
        if (onSelect) {
            onSelect({
                year: year ? parseInt(year) : null,
                round: selectedRace ? parseInt(selectedRace.split('-')[1]) : null,
                driverCodes: selectedDriverCodes
            })
        }
    }, [year, selectedRace, selectedDriverCodes, onSelect])

    // Handle year change
    const handleYearChange = (year) => {
        setYear(year)
        setSelectedRace("")
        setSelectedDriverCodes([])
        setCurrentDriver("")
    }

    // Handle race change
    const handleRaceChange = (selectedRace) => {
        setSelectedRace(selectedRace)
        setSelectedDriverCodes([])
        setCurrentDriver("")
    }

    // Handle driver selection
    const handleDriverChange = (driverCode) => {
        if (selectedDriverCodes.length < 5 && !selectedDriverCodes.includes(driverCode)) {
            setSelectedDriverCodes([...selectedDriverCodes, driverCode])
        }
        setCurrentDriver("") // Reset dropdown after selection
    }

    // Handle driver removal
    const handleRemoveDriver = (driverCode) => {
        setSelectedDriverCodes(selectedDriverCodes.filter(code => code !== driverCode))
    }

    // Get selected race and driver details
    const selectedRaceData = races.find(race => `${race.season}-${race.round}` === selectedRace)
    const selectedDriversData = selectedDriverCodes.map(code =>
        drivers.find(driver => (driver.code || driver.driverId) === code)
    ).filter(driver => !!driver)

    return (
        <div className="p-10">
            <div className="flex flex-col space-y-5">
                <div>
                    <Select onValueChange={handleYearChange} value={year}>
                        <SelectTrigger className="bg-black text-white border-white hover:bg-purple-500 hover:text-black focus:ring-purple-500 rounded-md shadow-md">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white border-white">
                            {years.map(y => (
                                <SelectItem key={y} value={y.toString()} className="hover:bg-purple-500 hover:text-black focus:bg-purple-500 focus:text-black">
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select
                        onValueChange={handleRaceChange}
                        value={selectedRace}
                        disabled={!year || loading || races.length === 0}
                    >
                        <SelectTrigger className="bg-black text-white border-white hover:bg-purple-500 hover:text-black focus:ring-purple-500 rounded-md shadow-md">
                            <SelectValue placeholder={year ? "Select Race" : "Select a year first"} />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white border-white">
                            {races.map(race => (
                                <SelectItem key={`${race.season}-${race.round}`} value={`${race.season}-${race.round}`} className="hover:bg-purple-500 hover:text-black focus:bg-purple-500 focus:text-black">
                                    {race.raceName} (Round {race.round})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select
                        onValueChange={handleDriverChange}
                        value={currentDriver}
                        disabled={!selectedRace || loading || drivers.length === 0 || selectedDriverCodes.length >= 5}
                    >
                        <SelectTrigger className="bg-black text-white border-white hover:bg-purple-500 hover:text-black focus:ring-purple-500 rounded-md shadow-md">
                            <SelectValue placeholder={selectedRace ? "Select Driver" : "Select a race first"} />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white border-white">
                            {drivers.map(driver => {
                                const driverCode = driver.code || driver.driverId
                                return (
                                    <SelectItem
                                        key={driver.driverId}
                                        value={driverCode}
                                        disabled={selectedDriverCodes.includes(driverCode)}
                                        className="hover:bg-purple-500 hover:text-black focus:bg-purple-500 focus:text-black"
                                    >
                                        {driver.givenName} {driver.familyName} ({driverCode})
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {error && (
                <div className="pt-10 text-red-500">
                    <p>{error}</p>
                </div>
            )}

            {selectedRace && selectedRaceData && (
                <div className="pt-10">
                    <div className='text-2xl'>
                        <ShinyText text={`Selected Race: ${selectedRaceData.raceName} (Round ${selectedRaceData.round})`} disabled={false} speed={4} className='custom-class' />
                    </div>
                </div>
            )}

            {selectedDriversData.length > 0 && (
                <div className="pt-5">
                    <div className='text-2xl'>
                        <ShinyText text={`Selected Drivers: `} disabled={false} speed={4} className='custom-class' />
                    </div>
                    <div className="pt-2">
                        {selectedDriversData.map(driver => (
                            <div key={driver.driverId} className="flex items-center space-x-10">
                                <div className='text-xl'>
                                    <ShinyText text={`${driver.givenName} ${driver.familyName} (${driver.code || driver.driverId})`} disabled={false} speed={4} className='custom-class' />
                                </div>
                                <p onClick={() => handleRemoveDriver(driver.code || driver.driverId)} className='hover:cursor-pointer'>
                                    ✖️
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* to display the qualifying speed trace of the drivers */}
            {selectedDriversData.length > 0 && (
                <div>
                    <ComparisonQualifyingSpeedTrace driverCodes={selectedDriverCodes} year={year} round={selectedRaceData.round} />
                    <QualifyingTelemetryPlots driverCodes={selectedDriverCodes} year={year} round={selectedRaceData.round} />
                </div>
            )}

            {/* to display the race pace plot along with telemetry plots for the selected laps */}
            {selectedDriversData.length > 0 && (
                <div className='pt-20'>
                    <RacePacePlot driverCodes={selectedDriverCodes} year={year} round={selectedRaceData.round} />
                </div>
            )}
        </div>
    )
}

export default DriverComparisonSelectors