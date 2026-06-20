'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: { value: number; isPositive: boolean };
  icon: LucideIcon;
  index?: number;
}

const bgVariants = [
  'from-brand/10 to-transparent',
  'from-brand-dark/10 to-transparent',
  'from-brand-light/10 to-transparent',
  'from-brand-navy/10 to-transparent',
  'from-brand/5 to-transparent',
  'from-brand-dark/5 to-transparent',
];

const iconBgVariants = [
  'bg-brand/10 text-brand',
  'bg-brand-dark/10 text-brand-dark',
  'bg-brand-light/10 text-brand-light',
  'bg-brand-navy/10 text-brand-navy',
  'bg-brand/10 text-brand',
  'bg-brand-dark/10 text-brand-dark',
];

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  index = 0,
}) => {
  const bg = bgVariants[index % bgVariants.length];
  const iconBg = iconBgVariants[index % iconBgVariants.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card p-6 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-bl ${bg} transition-all duration-300 group-hover:scale-125`} />
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-serif text-brand-navy">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  change.isPositive
                    ? 'text-green-700 bg-green-100'
                    : 'text-red-700 bg-red-100'
                }`}
              >
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
