import YearSelect from "@/app/components/YearSelect";
import DriverStandingsHeatmap from "@/app/components/DriverStandingsHeatmap";
import ConstructorStandingsHeatmap from "@/app/components/ConstructorStandingsHeatmap";


import React from 'react'

async function StandingsHeatmapYearPage({ params }) {

    const { year } = await params; // Await params to resolve the Promise
    const yearInt = parseInt(year);

    return (
        <div>

            <h1 className="font-bold text-center text-xl">Standings Heatmap for the {year} F1 Season</h1>

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
