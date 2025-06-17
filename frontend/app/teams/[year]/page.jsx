import React from 'react'
import YearSelect from '@/app/components/YearSelect';
import TeamsList from '@/app/components/TeamsList';
import ShinyText from '@/app/StyleComponents/ShinyText/ShinyText';

async function TeamsYearPage({ params }) {

    const { year } = await params;
    const yearInt = parseInt(year)

    return (
        <div>

            <div className='text-center text-4xl pt-10'>
                <ShinyText text={`Teams Racing in ${year}`} disabled={false} speed={4} className='custom-class' />
            </div>

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
