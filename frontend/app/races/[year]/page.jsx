import RaceSchedule from "@/app/components/RaceSchedule";
import YearSelect from "@/app/components/YearSelect";

import React from 'react'

async function RaceScheduleYear({ params }) {

    const { year } = await params;
    const yearInt = parseInt(year)

    return (
        <div>
            <h1 className='text-center font-bold text-xl'>Race Schedule for {yearInt}</h1>

            <div className="p-10">
                <YearSelect currentYear={yearInt} endpoint={"races"}/>
            </div>

            <RaceSchedule year={yearInt} />
        </div>
    )
}

export default RaceScheduleYear
