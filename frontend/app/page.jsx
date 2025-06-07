import React from 'react'
import DriverStandings from './components/DriverStandings'
import ConstructorStandings from './components/ConstructorStandings'

function page() {
  return (
    <div>
      <div className='flex p-10 space-x-20'>
        <DriverStandings />
        <ConstructorStandings />
      </div>
    </div>
  )
}

export default page
