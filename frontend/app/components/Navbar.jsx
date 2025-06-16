"use client";

import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function Navbar() {
  return (
    <nav className='flex items-center justify-between m-10 p-5 bg-black border rounded-[2rem]'>
      <div className='text-center text-3xl font-extrabold tracking-tight text-white'>
        <Link href="/" className="hover:text-green-500 transition-colors">F1DataShift</Link>
      </div>

      <div className='flex items-center space-x-20 text-white text-xl'>
        <Link href="/standings" className="hover:text-green-500 transition-colors">Standings</Link>
        <Link href="/races" className="hover:text-green-500 transition-colors">Races</Link>
        <Link href="/drivers" className="hover:text-green-500 transition-colors">Drivers</Link>
        <Link href="/teams" className="hover:text-green-500 transition-colors">Teams</Link>
        <Link href="/circuits" className="hover:text-green-500 transition-colors">Circuits</Link>
        <Link href="/analysis" className="hover:text-green-500 transition-colors">Analysis</Link>
      </div>

      <div>
        <Button variant="outline" className="text-white bg-black border-white hover:bg-green-500 hover:text-black transition-colors">
          Register
        </Button>
      </div>
    </nav>
  )
}

export default Navbar