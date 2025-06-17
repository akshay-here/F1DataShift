import React from 'react'
import RaceTimings from '@/app/components/RaceTimings';
import SessionSelector from '@/app/components/SessionSelector';
import StandingsSelector from '@/app/components/StandingsSelector';

async function RaceDetailsPage({ params }) {


    const { year, round } = await params;
    const yearInt = parseInt(year)
    const roundInt = parseInt(round)

    return (
        <div>
            <div className='space-y-10 px-10'>
                <RaceTimings year={yearInt} round={roundInt} />
                <SessionSelector year={yearInt} round={roundInt} />
                <StandingsSelector year={yearInt} round={roundInt} />
            </div>
        </div>
    )
}

export default RaceDetailsPage
