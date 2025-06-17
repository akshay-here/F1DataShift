import React from 'react'
import YearSelect from '@/app/components/YearSelect';
import DriversList from '@/app/components/DriversList';
import ShinyText from '@/app/StyleComponents/ShinyText/ShinyText';

async function DriversYearPage({ params }) {

    const { year } = await params;
    const yearInt = parseInt(year)

    return (
        <div>

            <div className='text-center text-4xl pt-10'>
                <ShinyText text={`Drivers Racing in ${year}`} disabled={false} speed={4} className='custom-class' />
            </div>

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
