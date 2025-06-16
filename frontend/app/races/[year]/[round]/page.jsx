import React from 'react'
import RaceResult from '@/app/components/RaceResult'
import DriverStandings from '@/app/components/DriverStandings';
import ConstructorStandings from '@/app/components/ConstructorStandings';
import QualifyingResult from '@/app/components/QualifyingResult';
import Sprintresult from '@/app/components/SprintResult';
import RaceTimings from '@/app/components/RaceTimings';

async function RaceDetailsPage({ params }) {

    // console.log(params)

    const { year, round } = await params;
    const yearInt = parseInt(year)
    const roundInt = parseInt(round)

    return (
        <div>

            <div className='p-10'>
                <RaceResult year={yearInt} round={roundInt} />
            </div>
            <div className='p-10 space-y-10'>
                <Sprintresult year={yearInt} round={roundInt} />
                <QualifyingResult year={yearInt} round={roundInt} />
                <RaceTimings year={yearInt} round={roundInt} />
                <DriverStandings year={yearInt} round={roundInt} />
                <ConstructorStandings year={yearInt} round={roundInt} />
            </div>
        </div>
    )
}

export default RaceDetailsPage
