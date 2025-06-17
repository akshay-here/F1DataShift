"use client";

import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GradientText from '../StyleComponents/GradientText/GradientText';

function Navbar() {
  return (
    <nav className='flex flex-col md:flex-row items-center justify-between m-4 md:m-10 p-3 md:p-5 bg-black border-2 border-purple-500 rounded-xl md:rounded-[1.5rem]'>
      <div className='text-center text-2xl md:text-3xl font-extrabold mb-4 md:mb-0'>
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

      <div className='flex flex-wrap justify-center items-center gap-6 md:gap-20 text-white text-lg md:text-xl'>
        <Link href="/standings" className="hover:text-purple-500 transition-colors">Standings</Link>
        <Link href="/races" className="hover:text-purple-500 transition-colors">Races</Link>
        <Link href="/drivers" className="hover:text-purple-500 transition-colors">Drivers</Link>
        <Link href="/teams" className="hover:text-purple-500 transition-colors">Teams</Link>
        <Link href="/circuits" className="hover:text-purple-500 transition-colors">Circuits</Link>
        <Link href="/analysis" className="hover:text-purple-500 transition-colors">Analysis</Link>
      </div>

    </nav>
  )
}

export default Navbar