import React from 'react'
import TeamProfile from '@/app/components/TeamProfile';
import TeamStats from '@/app/components/TeamStats';

async function TeamPage({ params }) {

    const { constructorId } = await params;
    const constructor = constructorId;

    return (
        <div>
            
            <div className='p-10'>
                <TeamProfile constructorId={constructor} />
                <TeamStats constructorId={constructor} />
            </div>

        </div>
    )
}

export default TeamPage
