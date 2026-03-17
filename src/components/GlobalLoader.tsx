'use client';

import { motion } from 'framer-motion';


export default function GlobalLoader() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-transparent">
            <div className="loader"></div>

            {/* Loading text below */}
            <motion.p
                className="mt-8 text-sm font-medium text-black tracking-wider"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                NORTHERN PARIBAHAN
            </motion.p>
        </div>
    );
}

