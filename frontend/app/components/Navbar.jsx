"use client";

import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function Navbar() {
  return (
    <nav className='flex items-center justify-between p-10'>
        <div className='flex items-center space-x-5'>
            <Link href="/" className="hover:text-red-400">Logo</Link>
            <Link href="/" className="hover:text-red-400">F1</Link>
        </div>

        <div className='flex items-center space-x-20'>
            <Link href="/standings" className="hover:text-red-400">Standings</Link>
            <Link href="/races" className="hover:text-red-400">Races</Link>
            <Link href="/drivers" className="hover:text-red-400">Drivers</Link>
            <Link href="/teams" className="hover:text-red-400">Teams</Link>
            <Link href="/circuits" className="hover:text-red-400">Circuits</Link>
            <Link href="/analysis" className="hover:text-red-400">Analysis</Link>
        </div>

        <div>
            <Button variant="outline">Register</Button>
        </div>
    </nav>
  )
}

export default Navbar
