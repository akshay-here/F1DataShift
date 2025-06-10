import React from 'react'
import TeamRacesInSeason from '@/app/components/TeamRacesInSeason';
import TeamQualifyingsInSeason from '@/app/components/TeamQualifyingsInSeason';
import TeamSprintsInSeason from '@/app/components/TeamSprintsInSeason';

async function TeamSeasonPage({ params }) {

    const { constructorId, year } = await params;
    const constructor = constructorId;
    const yearInt = parseInt(year)

    return (
        <div>
            
            <TeamRacesInSeason constructorId={constructor} year={yearInt} />
            <TeamQualifyingsInSeason constructorId={constructor} year={yearInt} />
            <TeamSprintsInSeason constructorId={constructor} year={yearInt} />

        </div>
    )
}

export default TeamSeasonPage
