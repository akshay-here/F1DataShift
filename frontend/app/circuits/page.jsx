import React from 'react'
import CircuitsList from '../components/CircuitsList'

function CircuitsPage() {
    return (
        <div>
            
            <h1 className='font-bold text-center text-xl'>Circuits Raced in F1</h1>

            <div className='p-10'>
                <CircuitsList />
            </div>

        </div>
    )
}

export default CircuitsPage
