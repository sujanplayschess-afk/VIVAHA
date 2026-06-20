'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    icon: React.ElementType;
    iconBg: string;
    count: number;
    label: string;
    trend?: { value: number; isUp: boolean };
    delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, iconBg, count, label, trend, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="card-premium p-5 hover:shadow-premium-hover transition-all"
        >
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                    <Icon size={22} className="text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${trend.isUp ? 'text-green-600' : 'text-red-500'}`}>
                        {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {trend.value}%
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-brand-navy">{count.toLocaleString()}</p>
                <p className="text-sm text-brand-navy/60 mt-1">{label}</p>
            </div>
        </motion.div>
    );
};
