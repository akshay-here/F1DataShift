import React from 'react'
import DriverStandings from './components/DriverStandings'
import ConstructorStandings from './components/ConstructorStandings'

function page() {

    const currYear = new Date().getFullYear()

    return (
      <div>
          <h1 className='font-bold text-center text-xl'>F1 2025 Season</h1>

          <div className='p-10 space-y-10'>
            <DriverStandings year={currYear} round={null}/>
            <ConstructorStandings year={currYear} round={null}/>
          </div>
      </div>
    )
}

export default page
