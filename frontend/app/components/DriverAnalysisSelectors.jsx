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

import ShinyText from '../StyleComponents/ShinyText/ShinyText';
import GradientText from '../StyleComponents/GradientText/GradientText';

import QualifyingSpeedTrace from './QualifyingSpeedTrace';
import RacePacePlot from './RacePacePlot';

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
                const raceRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/races/schedule/${year}`, {
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
                const driverRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${year}`, {
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

    // handle year change
    const handleYearChange = (year) => {
        setYear(year)
        setSelectedRace("")
        setSelectedDriver("")
    }

    // handle race change
    const handleRaceChange = (selectedRace) => {
        setSelectedRace(selectedRace)
        setSelectedDriver("")
    }

    return (
        <div className='p-10'>

            <div className='flex flex-col space-y-5'>
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
                    <Select onValueChange={handleRaceChange} value={selectedRace} disabled={!year || loading || races.length === 0}>
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
                    <Select onValueChange={setSelectedDriver} value={selectedDriver} disabled={!selectedRace || loading || drivers.length === 0}>
                        <SelectTrigger className="bg-black text-white border-white hover:bg-purple-500 hover:text-black focus:ring-purple-500 rounded-md shadow-md">
                            <SelectValue placeholder={selectedRace ? "Select Driver" : "Select a Race first"} />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white border-white">
                            {drivers.map(driver => (
                                <SelectItem key={driver.driverId} value={driver.driverId} className="hover:bg-purple-500 hover:text-black focus:bg-purple-500 focus:text-black">
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
                    <div className='text-2xl'>
                        <ShinyText text={`Selected Race: ${selectedRaceData.raceName} (Round ${selectedRaceData.round})`} disabled={false} speed={4} className='custom-class' />
                    </div>
                </div>
            )}

            {/* To display the selected driver */}
            {selectedDriver && selectedDriverData && (
                <div className="pt-5">
                    <div className='text-2xl'>
                        <ShinyText text={`Selected Driver: ${selectedDriverData.givenName} ${selectedDriverData.familyName} (${selectedDriverData.code || selectedDriverData.driverId})`} disabled={false} speed={4} className='custom-class' />
                    </div>
                </div>
            )}

            {/* To display the qualifying speed trace of the driver */}
            {selectedDriver && selectedDriverData && (
                <QualifyingSpeedTrace driverCode={selectedDriverData.code} year={year} round={selectedRaceData.round} />
            )}

            {/* to display the race pace plot */}
            {selectedDriver && selectedDriverData && (
                <RacePacePlot driverCodes={[selectedDriverData.code]} year={year} round={selectedRaceData.round} />
            )}

        </div>
    )
}

export default DriverAnalysisSelectors
