// this is the component which is responsible for rendering the lap telemetry data using charts.js
"use client"

import React, { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import QualifyingSpeedTrace from './QualifyingSpeedTrace';

function DriverAnalysisSelectors() {

    const [year, setYear] = useState("")                        // keep track of the year
    const [races, setRaces] = useState([])                      // keep track of list of all races in that year
    const [selectedRace, setSelectedRace] = useState("")        // keep track of the selected race in that year
    const [drivers, setDrivers] = useState([])                    // keep track of the list of all drivers
    const [selectedDriver, setSelectedDriver] = useState("")    // keep track of the selected driver in that race
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const currentYear = new Date().getFullYear()

    // data available only from 2018 onwards
    const years = Array.from({ length: currentYear - 2018 + 1 }, (_, i) => 2018 + i)      // array of all years from 2018 to now

    // fetch the race schedule for a season as and when the year changes
    useEffect(() => {
        if (!year) return

        async function fetchRaces() {
            setLoading(true)
            setRaces([])
            setSelectedRace("")
            setDrivers([])
            setSelectedDriver("")

            try {
                const raceRes = await fetch(`http://localhost:8000/races/schedule/${year}`, {
                    headers: { "Accept": "application/json" },
                })
                if (!raceRes.ok) {
                    if (raceRes.status === 404) {
                        throw new Error(`No races found for ${year}`);
                    }
                    throw new Error(`HTTP ${raceRes.status}: ${await raceRes.text()}`);
                }

                const data = await raceRes.json()
                const now = new Date()
                const pastRaces = data.filter(race => new Date(race.date) <= now)
                console.log(`Fetched ${pastRaces.length} past races for ${year}:`, pastRaces)
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

    // fetch drivers that have raced in entire season(could cause bugs)
    useEffect(() => {
        if (!year || !selectedRace) return

        async function fetchDrivers() {
            setLoading(true)
            setDrivers([])
            setSelectedDriver("")

            try {
                const [season, round] = selectedRace.split('-')
                const driverRes = await fetch(`http://localhost:8000/drivers/${year}`, {
                    headers: { "Accept": "application/json" },
                })
                if (!driverRes.ok) {
                    if (driverRes.status === 404) {
                        throw new Error(`No drivers found for ${season} round ${round}`)
                    }
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

    // get selected race and driver details
    const selectedRaceData = races.find(race => `${race.season}-${race.round}` === selectedRace)
    const selectedDriverData = drivers.find(driver => driver.driverId === selectedDriver)

    return (
        <div className='p-10'>

            <div className='flex space-x-10'>
                <div>
                    <Select onValueChange={setYear} value={year}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => (
                                <SelectItem key={y} value={y.toString()}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select onValueChange={setSelectedRace} value={selectedRace} disabled={!year || loading || races.length === 0}>
                        <SelectTrigger>
                            <SelectValue placeholder={year ? "Select Race" : "Select a year first"} />
                        </SelectTrigger>
                        <SelectContent>
                            {races.map(race => (
                                <SelectItem key={`${race.season}-${race.round}`} value={`${race.season}-${race.round}`}>
                                    {race.raceName} (Round {race.round})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select onValueChange={setSelectedDriver} value={selectedDriver} disabled={!selectedRace || loading || drivers.length === 0}>
                        <SelectTrigger>
                            <SelectValue placeholder={selectedRace ? "Select Driver" : "Select a Race first"} />
                        </SelectTrigger>
                        <SelectContent>
                            {drivers.map(driver => (
                                <SelectItem key={driver.driverId} value={driver.driverId}>
                                    {driver.givenName} {driver.familyName} ({driver.code || driver.driverId})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* To display the selected race */}
            {selectedRace && selectedRaceData && (
                <div className="pt-10">
                    <h1 className='text-xl font-bold'>Selected Race: {selectedRaceData.raceName} (Round {selectedRaceData.round})</h1>
                </div>
            )}

            {/* To display the selected driver */}
            {selectedDriver && selectedDriverData && (
                <div className="pt-5">
                    <h1 className="text-xl font-bold">Selected Driver: {selectedDriverData.givenName} {selectedDriverData.familyName} ({selectedDriverData.code || selectedDriverData.driverId})</h1>
                </div>
            )}

            {/* To display the qualifying speed trace of the driver */}
            {selectedDriver && selectedDriverData && (
                <QualifyingSpeedTrace driverCode={selectedDriverData.code} year={year} round={selectedRaceData.round} />
            )}

        </div>
    )
}

export default DriverAnalysisSelectors
