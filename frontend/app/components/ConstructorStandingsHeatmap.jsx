// Since using plotly which has user interactivity, this component has to be client side
"use client";

import React, { useEffect, useState } from 'react';

function ConstructorStandingsHeatmap({ year }) {

    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHeatmapImage() {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/heatmap/constructors/${year}`, {
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
        if (year) {
            fetchHeatmapImage();
        }
    }, [year]);

    if (loading) {
        return <div className="text-center p-10 text-font-bold text-xl">Loading heatmap...</div>;
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold text-center">Constructor Standings Heatmap {year}</h2>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!imageSrc) {
        return (
            <div className="p1-0">
                <h2 className="text-xl font-bold text-center">Constructor Standings Heatmap {year}</h2>
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    return (
        <div className="p-10">
            <h2 className="text-xl font-bold text-center">Constructor Standings Heatmap {year}</h2>
            <div className="w-full max-w-4xl mx-auto">
                <img
                    src={imageSrc}
                    alt={`Constructor Standings Heatmap ${year}`}
                    className="w-full h-auto rounded shadow-md"
                />
            </div>
        </div>
    )
}

export default ConstructorStandingsHeatmap
