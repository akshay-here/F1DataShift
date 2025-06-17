import React from 'react'
import DriverStandings from './components/DriverStandings'
import ConstructorStandings from './components/ConstructorStandings'
import HyperspeedWrapper from './StyleComponents/Hyperspeed/HyperspeedWrapper'
import SplitTextWrapper from './StyleComponents/SplitText/SplitTextWrapper'
import ShinyText from './StyleComponents/ShinyText/ShinyText'

function page() {

  const currYear = new Date().getFullYear()

  const hyperspeedOptions = {
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 20,
    islandWidth: 5,
    lanesPerRoad: 2,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xFFFFFF,
      brokenLines: 0xFFFFFF,
      leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
      rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
      sticks: 0x03B3C3,
    },
  };

  return (
    <div>

      <div className='text-center'>
        <SplitTextWrapper
          text={"Welcome to F1DataShift!"}
          className="text-6xl font-extrabold text-center text-white"
          delay={50}
          duration={2.0}
          ease="power4.out"
          splitType="chars"
          from={{ opacity: 0, y: 50 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-150px"
          textAlign="center"
        />
        <SplitTextWrapper
          text={"Your One Stop To All F1 Data and Analysis."}
          className="text-2xl font-bold text-center text-white"
          delay={50}
          duration={0.5}
          ease="power4.out"
          splitType="chars"
          from={{ opacity: 0, y: 50 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-150px"
          textAlign="center"
        />
      </div>

      <div className="mb-50">
        <HyperspeedWrapper effectOptions={hyperspeedOptions} width="100%" height="50rem" />
      </div>

      <div className='text-center text-4xl'>
        <ShinyText text={`F1 ${currYear} Season `} disabled={false} speed={4} className='custom-class' />
      </div>

      <div className='p-10 space-y-10'>
        <DriverStandings year={currYear} round={null} />
        <ConstructorStandings year={currYear} round={null} />
      </div>


    </div>
  )
}

export default page
