"use client"

import React, { useState, useEffect } from 'react'

function DriverProfile({ driverId }) {

    const [data, setData] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDriverProfile() {
            setLoading(true)
            try {
                const response = await fetch(`http://localhost:8000/drivers/${driverId}/profile`)
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
        if (driverId) {
            fetchDriverProfile()
        }
    }, [driverId])



    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading Driver Profile...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Driver Profile</h2>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">Driver Profile</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div>

            <h1 className='text-center font-bold text-xl pb-5'>Driver Profile</h1>

            <div className='flex items-center justify-between p-10 border-5 rounded'>
                <h1>Driver: {data.givenName} {data.familyName}</h1>
                <h2>Driver Number: {data.permanentNumber || "N/A"}</h2>
                <h2>Date of Birth: {data.dateOfBirth}</h2>
                <h2>Nationality: {data.nationality}</h2>
            </div>

        </div>
    )
}

export default DriverProfile
