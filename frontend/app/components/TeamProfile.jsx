"use client"

import React, { useState, useEffect } from 'react'
import GradientText from '../StyleComponents/GradientText/GradientText';

function TeamProfile({ constructorId }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeamProfile() {
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${constructorId}/profile`)
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                }
                const standings = await response.json()
                setData(standings)
                setError(null)
            } catch (err) {
                console.error('Fetch error:', err.message);
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false)
            }
        }
        if (constructorId) {
            fetchTeamProfile()
        }
    }, [constructorId])



    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Constructor Profile...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Constructor Profile</h2>
                <p className="text-gray-600 text-center">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">Constructor Profile</h2>
                <p className="text-gray-600 text-center">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <div className='p-10 text-2xl'>
                <GradientText colors={["#aa3dd9", "#4078ff", "#40ffaa", "#dea5e8"]} animationSpeed={2} showBorder={false} className="custom-class" >Team Profile</GradientText>
            </div>

            <div className='flex items-center justify-between p-10 text-xl border-5 border-purple-500 rounded'>
                <h1>Team: {data.name}</h1>
                <h2>Nationality: {data.nationality}</h2>
                <h2>Wiki: {data.url}</h2>
            </div>

        </div>
    )
}

export default TeamProfile
