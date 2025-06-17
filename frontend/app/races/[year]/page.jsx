import RaceSchedule from "@/app/components/RaceSchedule";
import YearSelect from "@/app/components/YearSelect";
import ShinyText from "@/app/StyleComponents/ShinyText/ShinyText";

import React from 'react'

async function RaceScheduleYear({ params }) {

    const { year } = await params;
    const yearInt = parseInt(year)

    return (
        <div>

            <div className='text-center text-4xl pt-10'>
                <ShinyText text={`Race Schedule for ${year} Season `} disabled={false} speed={4} className='custom-class' />
            </div>

            <div className="p-10">
                <YearSelect currentYear={yearInt} endpoint={"races"} />
            </div>

            <div className="p-10">
                <RaceSchedule year={yearInt} />
            </div>
        </div>
    )
}

export default RaceScheduleYear
