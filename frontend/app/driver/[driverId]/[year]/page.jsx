import React from 'react'
import DriverRacesInSeason from '@/app/components/DriverRacesInSeason'
import DriverQualifyingsInSeason from '@/app/components/DriverQualifyingsInSeason';
import DriverSprintsInSeason from '@/app/components/DriverSprintsInSeason';

async function DriverSeasonPage({ params }) {

    const { driverId, year } = await params;
    const driver = driverId;
    const yearInt = parseInt(year)

    return (
        <div>
            
            <DriverRacesInSeason driverId={driver} year={yearInt} />
            <DriverQualifyingsInSeason driverId={driver} year={yearInt} />
            <DriverSprintsInSeason driverId={driver} year={yearInt} />

        </div>
    )
}

export default DriverSeasonPage
