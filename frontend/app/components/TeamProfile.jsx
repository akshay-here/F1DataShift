import React from 'react'

async function TeamProfile({ constructorId }) {

    const teamRes = await fetch(`http://localhost:8000/teams/${constructorId}/profile`)
    if (teamRes.status === 500) {
        return (
            <div>
                <h1 className='text-center font-bold text-xl'>No Data found for team {constructorId}</h1>
            </div>
        )
    }
    const data = await teamRes.json()

    return (
        <div>

            <h1 className='text-center font-bold text-xl pb-5'>Team Profile</h1>

            <div className='flex items-center justify-between p-10 border-5 rounded'>
                <h1>Team: {data.name}</h1>
                <h2>Nationality: {data.nationality}</h2>
                <h2>Wiki: {data.url}</h2>
            </div>

        </div>
    )
}

export default TeamProfile
