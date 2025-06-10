import React from 'react'
import DriverProfile from '@/app/components/DriverProfile'
import DriverStats from '@/app/components/DriverStats';

async function DriverPage({ params }) {

    const { driverId } = await params;
    const driver = driverId;

    return (
        <div>
            
            <div className='p-10'>
                <DriverProfile driverId={driver} />
                <DriverStats driverId={driver} />
            </div>

        </div>
    )
}

export default DriverPage
