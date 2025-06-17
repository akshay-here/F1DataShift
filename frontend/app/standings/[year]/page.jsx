import DriverStandings from "@/app/components/DriverStandings";
import ConstructorStandings from "@/app/components/ConstructorStandings";
import YearSelect from "@/app/components/YearSelect";
import ShinyText from "@/app/StyleComponents/ShinyText/ShinyText";


import React from 'react'

async function StandingsYearPage({ params }) {

    const { year } = await params; // Await params to resolve the Promise
    const yearInt = parseInt(year);

    return (
        <div>

            <div className='text-center text-4xl pt-10'>
                <ShinyText text={`F1 ${year} Season `} disabled={false} speed={4} className='custom-class' />
            </div>

            <div className="p-10">
                <YearSelect currentYear={yearInt} endpoint={"standings"} />
            </div>
            <div className="p-10 space-y-20">
                <DriverStandings year={yearInt} round={null} />
                <ConstructorStandings year={yearInt} round={null} />
            </div>
        </div>
    )
}

export default StandingsYearPage
