import React from 'react'
import YearSelect from '@/app/components/YearSelect';
import TeamsList from '@/app/components/TeamsList';

async function TeamsYearPage({ params }) {

    const { year } = await params;
    const yearInt = parseInt(year)

    return (
        <div>

            <h1 className='font-bold text-center text-xl'>Teams Racing in {year}</h1>

            <div className='p-10'>
                <YearSelect currentYear={yearInt} endpoint={"teams"} />
            </div>

            <div className='p-10'>
                <TeamsList year={yearInt} />
            </div>

        </div>
    )
}

export default TeamsYearPage
