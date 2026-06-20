'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
            <div className="relative">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Logo variant="icon" height={100} />
                </motion.div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <p className="text-brand-navy/60 font-poppins text-sm tracking-widest uppercase animate-pulse">
                        Bridging Hearts...
                    </p>
                </div>
            </div>

            {/* Loading Bar */}
            <div className="mt-12 w-48 h-1 bg-gray-50 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-brand-gradient"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>
        </div>
    );
};
