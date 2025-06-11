import React from 'react'
import CircuitRaces from '@/app/components/CircuitRaces'

async function CircuitPage({ params }) {

    const { circuitId } = await params;
    const circuit = circuitId

    return (
        <div>

            <div className='p-10'>
                <CircuitRaces circuitId={circuit} />
            </div>

        </div>
    )
}

export default CircuitPage
