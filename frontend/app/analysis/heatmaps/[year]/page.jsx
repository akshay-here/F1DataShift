import YearSelect from "@/app/components/YearSelect";
import DriverStandingsHeatmap from "@/app/components/DriverStandingsHeatmap";
import ConstructorStandingsHeatmap from "@/app/components/ConstructorStandingsHeatmap";
import ShinyText from "@/app/StyleComponents/ShinyText/ShinyText";


import React from 'react'

async function StandingsHeatmapYearPage({ params }) {

    const { year } = await params; // Await params to resolve the Promise
    const yearInt = parseInt(year);

    return (
        <div>

            <div className='text-center text-4xl pt-10'>
                <ShinyText text={`Standings Heatmap for the ${year} F1 Season`} disabled={false} speed={4} className='custom-class' />
            </div>

            <div className="p-10">
                <YearSelect currentYear={yearInt} endpoint={"analysis/heatmaps"}/>
            </div>
            <div className="p-10 space-y-20">
                <DriverStandingsHeatmap year={yearInt} />
                <ConstructorStandingsHeatmap year={yearInt} />
            </div>
        </div>
    )
}

export default StandingsHeatmapYearPage
