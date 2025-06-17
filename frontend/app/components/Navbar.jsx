"use client";

import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GradientText from '../StyleComponents/GradientText/GradientText';

function Navbar() {
  return (
    <nav className='flex items-center justify-between m-10 p-5 bg-black border-2 border-purple-500 rounded-[1.5rem]'>
      <div className='text-center text-3xl font-extrabold'>
        <Link href="/">
          <GradientText
            colors={["#aa3dd9", "#4078ff", "#40ffaa", "#dea5e8"]}
            animationSpeed={2}
            showBorder={false}
            className="custom-class"
          >
            F1DataShift 
          </GradientText>
        </Link>
      </div>

      <div className='flex items-center space-x-20 text-white text-xl'>
        <Link href="/standings" className="hover:text-purple-500 transition-colors">Standings</Link>
        <Link href="/races" className="hover:text-purple-500 transition-colors">Races</Link>
        <Link href="/drivers" className="hover:text-purple-500 transition-colors">Drivers</Link>
        <Link href="/teams" className="hover:text-purple-500 transition-colors">Teams</Link>
        <Link href="/circuits" className="hover:text-purple-500 transition-colors">Circuits</Link>
        <Link href="/analysis" className="hover:text-purple-500 transition-colors">Analysis</Link>
      </div>

      <div>
        <Button variant="outline" className="text-white bg-black border-purple-500 hover:bg-purple-500 hover:text-black border-white transition-colors">
          Register
        </Button>
      </div>
    </nav>
  )
}

export default Navbar