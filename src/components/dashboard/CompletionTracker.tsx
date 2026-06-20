'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertCircle, ChevronRight } from 'lucide-react';

interface IncompleteSection {
    label: string;
    path: string;
}

interface CompletionTrackerProps {
    percentage: number;
    incompleteSections: IncompleteSection[];
    delay?: number;
}

export const CompletionTracker: React.FC<CompletionTrackerProps> = ({ percentage, incompleteSections, delay = 0 }) => {
    const router = useRouter();
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="card-premium p-6 hover:shadow-premium-hover transition-all"
        >
            <h3 className="text-lg font-bold text-brand-navy mb-4">Profile Completion</h3>
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                    <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
                        <circle cx="64" cy="64" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="10" />
                        <motion.circle
                            cx="64" cy="64" r={radius}
                            fill="none"
                            stroke="url(#completionGradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, delay: delay + 0.3, ease: 'easeOut' }}
                        />
                        <defs>
                            <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#E91E76" />
                                <stop offset="100%" stopColor="#42A5F5" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold brand-gradient-text">{percentage}%</span>
                    </div>
                </div>

                {incompleteSections.length > 0 && (
                    <div className="w-full mt-5 space-y-2">
                        <p className="text-sm font-semibold text-brand-navy/70 flex items-center gap-2">
                            <AlertCircle size={14} className="text-amber-500" />
                            Incomplete Sections
                        </p>
                        {incompleteSections.map((section) => (
                            <button
                                key={section.label}
                                onClick={() => router.push(section.path)}
                                className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-brand-navy/60 hover:bg-gray-50 hover:text-brand transition-all group"
                            >
                                <span>{section.label}</span>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                )}

                {incompleteSections.length === 0 && (
                    <p className="mt-4 text-sm text-green-600 font-semibold">All sections completed!</p>
                )}
            </div>
        </motion.div>
    );
};
