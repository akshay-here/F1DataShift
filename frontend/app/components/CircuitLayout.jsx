// making this component client side as it has to be rendered on neatly
"use client"

import React, { useState, useEffect } from 'react'

function CircuitLayout({ year, round }) {

    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCircuitLayout() {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/circuits/layout/${year}/${round}`, {
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
            fetchCircuitLayout();
        }
    }, [year, round]);
    // So in useEffect, whatever is specified within the [], only if there are any changes to those values, then only the the function is called. 
    // So in our case, only when the year and round prop changed due to selection from the Select components, then only the fetch function will be called to 
    // re render for a different year and round selection

    if (loading) {
        return <div className="text-lg font-medium text-gray-600 text-center">Loading Circuit Layout...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Circuit Layout</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!imageSrc) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Circuit Layout</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <img src={imageSrc} alt={`Circuit Layout for ${year} Round ${round}`} className="w-full max-w-[600px] h-auto rounded-lg shadow-md" />
        </div>
    )
}

export default CircuitLayout
