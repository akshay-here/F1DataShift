// making this component client side as it has to be rendered on neatly
"use client"

import React, { useState, useEffect } from 'react'

function PositionChangesPlot({ year, round }) {

    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPositionchangesInRace() {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/raceplots/positionchanges/${year}/${round}`, {
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
            fetchPositionchangesInRace();
        }
    }, [year, round]);

    if (loading) {
        return <div className="text-lg font-medium text-gray-600 text-center">Loading Position Changes Plot...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Position Changes Plot</h2>
                <p className="text-gray-600 text-center">{error}</p>
            </div>
        );
    }

    if (!imageSrc) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Position Changes Plot</h2>
                <p className="text-gray-600 text-center">No data available</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <img src={imageSrc} alt={`Position Changes Plot for ${year} Round ${round}`} className="w-full w-[600px] h-[700px] rounded-lg shadow-md" />
        </div>
    )
}

export default PositionChangesPlot
