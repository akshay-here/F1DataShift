"use client";

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Hyperspeed to disable SSR
const Hyperspeed = dynamic(() => import('./Hyperspeed'), { ssr: false });

const HyperspeedWrapper = ({ effectOptions, width = '100%', height = '30rem' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.width = width;
      containerRef.current.style.height = height;
      console.log('Container size set:', { width, height });
    }
  }, [width, height]);

  return (
    <div ref={containerRef} className="w-full bg-black">
      <Hyperspeed
        effectOptions={{
          ...effectOptions,
          onSpeedUp: () => console.log('Speeding up!', new Date().toISOString()),
          onSlowDown: () => console.log('Slowing down!', new Date().toISOString()),
        }}
        containerWidth={width}
        containerHeight={height}
      />
    </div>
  );
};

export default HyperspeedWrapper;