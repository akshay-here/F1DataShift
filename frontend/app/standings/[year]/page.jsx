import DriverStandings from "@/app/components/DriverStandings";
import ConstructorStandings from "@/app/components/ConstructorStandings";
import YearSelect from "@/app/components/YearSelect";


import React from 'react'

async function StandingsYearPage({ params }) {

    const { year } = await params; // Await params to resolve the Promise
    const yearInt = parseInt(year);

    return (
        <div>
            <div className="p-10">
                <YearSelect currentYear={yearInt} />
            </div>
            <div className="flex flex-row p-10 space-x-40">
                <DriverStandings year={yearInt} />
                <ConstructorStandings year={yearInt} />
            </div>
        </div>
    )
}

export default StandingsYearPage
