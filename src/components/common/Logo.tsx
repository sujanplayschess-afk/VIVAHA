'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
    variant?: 'full' | 'icon' | 'white';
    height?: number;
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({
    variant = 'full',
    height = 48,
    className = ''
}) => {
    const isIconOnly = variant === 'icon';
    const isWhite = variant === 'white';

    return (
        <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
            <svg
                width={height * (isIconOnly ? 1 : 0.8)}
                height={height}
                viewBox="0 0 200 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 280C100 280 40 220 20 160C0 100 20 40 80 40C110 40 130 60 140 80"
                    stroke={isWhite ? "white" : "#0D9488"}
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M100 280C100 280 160 220 180 160C200 100 180 40 120 40C90 40 70 60 60 80"
                    stroke={isWhite ? "white" : "#0D9488"}
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M80 60C80 40 100 20 120 40C140 60 120 80 100 100C80 80 60 60 80 40Z"
                    fill={isWhite ? "white" : "#0D9488"}
                />
            </svg>

            {!isIconOnly && (
                <div className="flex flex-col">
                    <span className={`text-2xl font-bold leading-none ${isWhite ? 'text-white' : 'text-brand-navy'}`}>
                        Vivahasetu<span className="text-brand">.com</span>
                    </span>
                    <span className={`text-[10px] uppercase tracking-widest font-normal ${isWhite ? 'text-white/80' : 'text-soft-gray'}`}>
                        Bridging Hearts, Building Families
                    </span>
                </div>
            )}
        </Link>
    );
};
