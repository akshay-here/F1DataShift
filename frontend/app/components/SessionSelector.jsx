"use client"

import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import RaceResult from './RaceResult';
import QualifyingResult from './QualifyingResult';
import Sprintresult from './SprintResult';

function SessionSelector({ year, round }) {

    const [selectedSession, setSelectedSession] = useState("race")

    const sessionChoices = [
        { session: "race", label: "Race Result" },
        ...(year >= 1994 ? [{ session: 'qualifying', label: "Qualifying Result" }] : []),
        ...(year >= 2021 ? [{ session: 'sprint', label: "Sprint Result" }] : []),
    ]

    const sessionComponents = {
        race: <RaceResult year={year} round={round} />,
        qualifying: <QualifyingResult year={year} round={round} />,
        sprint: <Sprintresult year={year} round={round} />,
    }

    return (
        <div>

            <div className="flex justify-center">
                <Select value={selectedSession} onValueChange={setSelectedSession} className="w-[300px]">
                    <SelectTrigger className="bg-black text-white border-white hover:bg-green-500 hover:text-black focus:ring-green-500 rounded-md shadow-md">
                        <SelectValue placeholder="Select a session" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white border-white">
                        {sessionChoices.map(choice => (
                            <SelectItem
                                key={choice.session}
                                value={choice.session}
                                className="hover:bg-green-500 hover:text-black focus:bg-green-500 focus:text-black"
                            >
                                {choice.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedSession && (
                <div>
                    {sessionComponents[selectedSession]}
                </div>
            )}

        </div>
    )
}

export default SessionSelector
