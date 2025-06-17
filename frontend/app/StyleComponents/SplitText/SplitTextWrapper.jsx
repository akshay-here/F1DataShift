"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SplitText to disable SSR
const SplitText = dynamic(() => import('./SplitText'), { ssr: false });

const SplitTextWrapper = ({
    text,
    className = "text-2xl font-semibold text-center text-white",
    delay = 100,
    duration = 0.6,
    ease = "power3.out",
    splitType = "chars",
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    rootMargin = "-100px",
    textAlign = "center",
}) => {
    // Define the animation complete handler
    const handleAnimationComplete = () => {
        console.log('All letters have animated!', new Date().toISOString());
    };

    return (
        <div className="w-full bg-black py-4">
            <SplitText
                text={text}
                className={className}
                delay={delay}
                duration={duration}
                ease={ease}
                splitType={splitType}
                from={from}
                to={to}
                threshold={threshold}
                rootMargin={rootMargin}
                textAlign={textAlign}
                onLetterAnimationComplete={handleAnimationComplete}
            />
        </div>
    );
};

export default SplitTextWrapper;