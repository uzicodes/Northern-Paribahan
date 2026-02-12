'use client';

import { motion } from 'framer-motion';
import { Bus } from 'lucide-react';
import { Satisfy } from 'next/font/google';

const satisfy = Satisfy({
    weight: '400',
    subsets: ['latin'],
});

export default function GlobalLoader() {
    const ringSize = 160; // px — diameter of the orbit ring
    const orbitRadius = ringSize / 2; // radius for the bus to travel

    return (
        <div className="h-screen w-full flex items-center justify-center bg-white">
            <div className="relative" style={{ width: ringSize, height: ringSize }}>

                {/* Orbit Ring */}
                <div
                    className="absolute inset-0 rounded-full border-[3px] border-dashed border-indigo-200"
                />

                {/* Subtle glow ring behind */}
                <div
                    className="absolute inset-2 rounded-full border-[1px] border-indigo-100"
                />

                {/* Text in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        className={satisfy.className}
                        style={{ color: '#FCA311', fontSize: '18px', textAlign: 'center', lineHeight: 1.2 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        Northern<br />Paribahan
                    </motion.span>
                </div>

                {/* Orbiting Bus */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {/* 
                        Position the bus at the top-center of the ring.
                        The parent rotates 360°, carrying the bus along the circular path.
                        We counter-rotate the icon itself so it stays upright,
                        then add rotate-90 so the bus faces forward (tangent to the circle).
                    */}
                    <motion.div
                        className="absolute flex items-center justify-center"
                        style={{
                            top: -12,
                            left: '50%',
                            marginLeft: -12,
                            width: 24,
                            height: 24,
                        }}
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <Bus
                            size={22}
                            className="text-indigo-600 -rotate-90"
                            strokeWidth={2.2}
                        />
                    </motion.div>
                </motion.div>

                {/* Small trailing dots for motion feel */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: 0.3,
                    }}
                >
                    <div
                        className="absolute w-1.5 h-1.5 rounded-full bg-indigo-300 opacity-60"
                        style={{
                            top: -3,
                            left: '50%',
                            marginLeft: -3,
                        }}
                    />
                </motion.div>
                <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: 0.6,
                    }}
                >
                    <div
                        className="absolute w-1 h-1 rounded-full bg-indigo-200 opacity-40"
                        style={{
                            top: -2,
                            left: '50%',
                            marginLeft: -2,
                        }}
                    />
                </motion.div>
            </div>

            {/* Loading text below */}
            <motion.p
                className="absolute mt-56 text-sm font-medium text-indigo-400 tracking-wider"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                Loading...
            </motion.p>
        </div>
    );
}
