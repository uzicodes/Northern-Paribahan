'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';

export default function GlobalLoader() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="h-full w-full min-h-[calc(100vh-57px)] flex flex-col items-center justify-center bg-transparent">
            <div className="loader"></div>

            {/* Loading text below */}
            <LazyMotion features={domAnimation}>
                <m.p
                    className="mt-8 text-sm font-medium text-black tracking-wider"
                    animate={{ opacity: shouldReduceMotion ? 1 : [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    NORTHERN PARIBAHAN
                </m.p>
            </LazyMotion>
        </div>
    );
}

