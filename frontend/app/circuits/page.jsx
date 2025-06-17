import React from 'react'
import CircuitsList from '../components/CircuitsList'
import ShinyText from '../StyleComponents/ShinyText/ShinyText'

function CircuitsPage() {
    return (
        <div>
            
            <div className='text-center text-4xl pt-10'>
                <ShinyText text="Circuits Raced in F1" disabled={false} speed={4} className='custom-class' />
            </div>

            <div className='p-10'>
                <CircuitsList />
            </div>

        </div>
    )
}

export default CircuitsPage
