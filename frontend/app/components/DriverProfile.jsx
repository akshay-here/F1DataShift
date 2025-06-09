import React from 'react'

async function DriverProfile({ driverId }) {

    const driverRes = await fetch(`http://localhost:8000/drivers/${driverId}/profile/`)
    if (driverRes.status === 500) {
        return (
            <div>
                <h1 className='text-center font-bold text-xl'>No Data found for driver {driverId}</h1>
            </div>
        )
    }
    const data = await driverRes.json()

    return (
        <div>

            <h1 className='text-center font-bold text-xl pb-5'>Driver Profile</h1>

            <div className='flex items-center justify-between p-10 border-5 rounded'>
                <h1>Driver: {data.givenName} {data.familyName}</h1>
                <h2>Driver Number: {data.permanentNumber || "N/A"}</h2>
                <h2>Date of Birth: {data.dateOfBirth}</h2>
                <h2>Nationality: {data.nationality}</h2>
            </div>

        </div>
    )
}

export default DriverProfile
