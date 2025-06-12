// making this component client side as it has to be rendered on neatly
"use client"

import React, { useState, useEffect } from 'react'

function CircuitGearShiftsLayout({ year, round }) {

    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCircuitGearShiftsLayout() {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/circuits/gearshiftslayout/${year}/${round}`, {
                    headers: { 'Accept': 'image/png' },
                    // cache: 'force-cache',
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setImageSrc(url);
                setError(null);
                return () => URL.revokeObjectURL(url); // Clean up
            } catch (err) {
                console.error('Fetch error:', err.message);
                setError(err.message);
                setImageSrc(null);
            } finally {
                setLoading(false);
            }
        }
        if (year && round) {
            fetchCircuitGearShiftsLayout();
        }
    }, [year, round]);

    if (loading) {
        return <div className="text-lg font-medium text-gray-600 text-center">Loading Circuit Gear Shifts Layout...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Circuit Gear Shifts Layout</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!imageSrc) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Circuit Gear Shifts Layout</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <img src={imageSrc} alt={`Circuit Gear Shifts Layout for ${year} Round ${round}`} className="w-full max-w-[500px] h-auto rounded-lg shadow-md" />
        </div>
    )
}

export default CircuitGearShiftsLayout
