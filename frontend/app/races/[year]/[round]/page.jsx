import React from 'react'
import RaceResult from '@/app/components/RaceResult'

async function RaceDetailsPage({ params }) {

    console.log(params)

    const { year, round } = await params;
    const yearInt = parseInt(year)
    const roundInt = parseInt(round)

    return (
        <div>
            <RaceResult year={yearInt} round={roundInt} />
        </div>
    )
}

export default RaceDetailsPage
