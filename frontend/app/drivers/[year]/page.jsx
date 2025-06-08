import React from 'react'
import YearSelect from '@/app/components/YearSelect';
import DriversList from '@/app/components/DriversList';

async function DriversYearPage({ params }) {

    const { year } = await params;
    const yearInt = parseInt(year)

    return (
        <div>

            <h1 className='font-bold text-center text-xl'>Drivers Racing in {year}</h1>

            <div className='p-10'>
                <YearSelect currentYear={yearInt} endpoint={"drivers"} />
            </div>

            <div className='p-10'>
                <DriversList year={yearInt} />
            </div>

        </div>
    )
}

export default DriversYearPage
