// have to manage user interactions in the form of selecting year and race. 
"use client"

import React, { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

function RaceAnalysisSelectors() {

    const [year, setYear] = useState("")                        // keep track of the year
    const [races, setRaces] = useState([])                      // keep track of list of all races in that year
    const [selectedRace, setSelectedRace] = useState("")        // keep track of the selected race in that year
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
                setRaces(data)
                setError(null)
            } catch (err) {
                console.error(`Fetch error for year ${year}:`, err.message);
                setError(err.message);
                setRaces([]);
            } finally {
                setLoading(false);
            }
        }
        fetchRaces()

    }, [year])

    // selecting a race
    const handleRaceSelect = (raceId) => {
        setSelectedRace(raceId)
    }

    // get selected race details
    const selectedRaceData = races.find(race => `${race.season}-${race.round}` === selectedRace)

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
                    <Select onValueChange={handleRaceSelect} value={selectedRace} disabled={!year || loading || races.length === 0}>
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
            </div>

            {/* To display the selected race */}
            {selectedRace && selectedRaceData && (
                <div className="pt-10">
                    <p>Selected Race: {selectedRaceData.raceName} (Round {selectedRaceData.round})</p>
                </div>
            )}

            {/* Components To display the circuit info - track layout, track speed vis, track gear shifts */}

            {/* Components to display position changes of that race, team pace comparison, quali delta and results, tyre strats, driver laptimes distrib */}


        </div>
    )
}

export default RaceAnalysisSelectors
