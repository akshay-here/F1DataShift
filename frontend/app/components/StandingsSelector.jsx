"use client"

import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import DriverStandings from './DriverStandings';
import ConstructorStandings from './ConstructorStandings';

function StandingsSelector({ year, round }) {

    const [selectedStanding, setSelectedStanding] = useState("driver")

    const standingChoices = [
        { standing: "driver", label: "Driver Standings" },
        { standing: "constructor", label: "Constructor Standings" },
    ]

    const standingComponents = {
        driver: <DriverStandings year={year} round={round} />, 
        constructor: <ConstructorStandings year={year} round={round} />
    }

    return (
        <div>

            <div className="flex justify-center">
                <Select value={selectedStanding} onValueChange={setSelectedStanding} className="w-[300px]">
                    <SelectTrigger className="bg-black text-white border-white hover:bg-green-500 hover:text-black focus:ring-green-500 rounded-md shadow-md">
                        <SelectValue placeholder="Select Standings" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white border-white">
                        {standingChoices.map(choice => (
                            <SelectItem
                                key={choice.standing}
                                value={choice.standing}
                                className="hover:bg-green-500 hover:text-black focus:bg-green-500 focus:text-black"
                            >
                                {choice.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedStanding && (
                <div>
                    {standingComponents[selectedStanding]}
                </div>
            )}

        </div>
    )
}

export default StandingsSelector
