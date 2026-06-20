'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BrandGradientProps {
    children?: React.ReactNode;
    className?: string;
    intensity?: 'low' | 'medium' | 'high';
    type?: 'linear' | 'radial';
}

export const BrandGradient: React.FC<BrandGradientProps> = ({
    children,
    className = '',
    intensity = 'medium',
    type = 'linear',
}) => {
    const opacityMap = {
        low: 0.05,
        medium: 0.1,
        high: 0.2,
    };

    const bgStyle = type === 'linear'
        ? { backgroundImage: `linear-gradient(135deg, rgba(233, 30, 118, ${opacityMap[intensity]}) 0%, rgba(66, 165, 245, ${opacityMap[intensity]}) 100%)` }
        : { backgroundImage: `radial-gradient(circle at center, rgba(233, 30, 118, ${opacityMap[intensity]}) 0%, rgba(66, 165, 245, ${opacityMap[intensity]}) 100%)` };

    return (
        <div
            className={`relative ${className}`}
            style={bgStyle}
        >
            {children}
        </div>
    );
};
