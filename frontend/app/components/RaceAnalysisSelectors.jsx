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

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import CircuitLayout from './CircuitLayout';
import CircuitSpeedLayout from './CircuitSpeedLayout';
import CircuitGearShiftsLayout from './CircuitGearShiftsLayout';

import PositionChangesPlot from './PositionChangesPlot';
import TeamPaceComparisonPlot from './TeamPaceComparisonPlot';
import TyreStratsPlot from './TyreStratsPlot';
import QualiDeltaPlot from './QualiDeltaPlot';
import LapTimesDistribPlot from './LaptimesDistribPlot';

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
                const now = new Date()
                const pastRaces = data.filter(race => new Date(race.date) <= now)                   // to prevent selecting future races
                console.log(`Fetched ${pastRaces.length} past races for ${year}:`, pastRaces)
                setRaces(pastRaces)
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

    // get selected race details
    const selectedRaceData = races.find(race => `${race.season}-${race.round}` === selectedRace)

    // handle year change
    const handleYearChange = (year) => {
        setYear(year)
        setSelectedRace("")
    }

    return (
        <div className='p-10'>

            <div className='flex space-x-10'>
                <div>
                    <Select onValueChange={handleYearChange} value={year}>
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
            </div>

            {/* To display the selected race */}
            {selectedRace && selectedRaceData && (
                <div className="pt-10">
                    <h1 className='text-xl font-bold'>Selected Race: {selectedRaceData.raceName} (Round {selectedRaceData.round})</h1>
                </div>
            )}

            {/* Components To display the circuit info - track layout, track speed vis, track gear shifts */}
            {selectedRace && selectedRaceData && (
                <div>

                    <h1 className='pt-20 text-xl'>Circuit Layouts and Visualizations: </h1>

                    <Carousel className="w-full max-w-2xl mx-auto pt-10" opts={{ align: "start", loop: true }}>
                        <CarouselContent>
                            <CarouselItem>
                                <div>
                                    <CircuitLayout year={year} round={selectedRaceData.round} />
                                    <p className='pt-10 text-center'>Circuit Layout With Corner Annotations</p>
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div>
                                    <CircuitSpeedLayout year={year} round={selectedRaceData.round} />
                                    <p className='pt-10 text-center'>Circuit Speed Visuaization</p>
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div>
                                    <CircuitGearShiftsLayout year={year} round={selectedRaceData.round} />
                                    <p className='pt-10 text-center'>Circuit Gear Shifts Layout</p>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            )}

            {/* Components to display position changes of that race, team pace comparison, quali delta and results, tyre strats, driver laptimes distrib */}
            {selectedRace && selectedRaceData && (
                <div>

                    <h1 className='pt-20 text-xl'>Race Analysis: </h1>

                    <Carousel className="w-full max-w-2xl mx-auto pt-10" opts={{ align: "start", loop: true }}>
                        <CarouselContent>
                            <CarouselItem>
                                <div>
                                    <PositionChangesPlot year={year} round={selectedRaceData.round} />
                                    <p className='pt-10 text-center'>Position Changes In Race</p>
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div>
                                    <TeamPaceComparisonPlot year={year} round={selectedRaceData.round} />
                                    <p className='pt-10 text-center'>Team Race Pace Comparison In Race</p>
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div>
                                    <TyreStratsPlot year={year} round={selectedRaceData.round} />
                                    <p className='pt-10 text-center'>Different Tyre Strategies In Race</p>
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div>
                                    <QualiDeltaPlot year={year} round={selectedRaceData.round} />
                                    <p className='pt-10 text-center'>Qualifying Delta and Performance</p>
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div>
                                    <LapTimesDistribPlot year={year} round={selectedRaceData.round} />
                                    <p className='pt-10 text-center'>Laptime Distribution Of Point Scorers In Race</p>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            )}

        </div>
    )
}

export default RaceAnalysisSelectors
