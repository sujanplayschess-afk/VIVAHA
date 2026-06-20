'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Briefcase, Crown, ShieldCheck, Heart, BookmarkPlus, Eye, EyeOff } from 'lucide-react';

interface ProfileCardProps {
    name: string;
    age: number;
    location: string;
    religionCaste?: string;
    education?: string;
    occupation?: string;
    isPremium?: boolean;
    isVerified?: boolean;
    photoHidden?: boolean;
    photoInitials?: string;
    delay?: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    name, age, location, religionCaste, education, occupation,
    isPremium, isVerified, photoHidden, photoInitials = '?', delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="card-premium overflow-hidden hover:shadow-premium-hover transition-all group"
        >
            <div className="relative">
                {photoHidden ? (
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-brand/20 to-brand/20 flex items-center justify-center">
                        <div className="text-center">
                            <EyeOff size={32} className="mx-auto text-brand-navy/30 mb-2" />
                            <span className="text-3xl font-bold text-brand-navy/40">{photoInitials}</span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full aspect-[4/3] bg-brand-gradient flex items-center justify-center">
                        <span className="text-5xl font-bold text-white/80">{photoInitials}</span>
                    </div>
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isPremium && (
                        <span className="px-2 py-1 bg-premium-gold text-brand-navy text-[10px] font-bold rounded-md flex items-center gap-1 shadow-md">
                            <Crown size={10} /> PREMIUM
                        </span>
                    )}
                    {isVerified && (
                        <span className="px-2 py-1 bg-premium-verified text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-md">
                            <ShieldCheck size={10} /> VERIFIED
                        </span>
                    )}
                </div>

                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookmarkPlus size={16} className="text-brand" />
                </button>
            </div>

            <div className="p-4">
                <h4 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                    {name}, {age}
                    {isVerified && <ShieldCheck size={14} className="text-premium-verified" />}
                </h4>
                <p className="text-sm text-brand-navy/60 flex items-center gap-1.5 mt-1">
                    <MapPin size={12} /> {location}
                </p>
                {religionCaste && (
                    <p className="text-xs text-brand-navy/50 mt-2">{religionCaste}</p>
                )}
                <div className="mt-3 space-y-1.5">
                    {education && (
                        <p className="text-xs text-brand-navy/60 flex items-center gap-1.5">
                            <GraduationCap size={12} /> {education}
                        </p>
                    )}
                    {occupation && (
                        <p className="text-xs text-brand-navy/60 flex items-center gap-1.5">
                            <Briefcase size={12} /> {occupation}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand-gradient text-white text-xs font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all">
                        <Heart size={14} /> Interest
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-brand text-brand text-xs font-bold rounded-full hover:bg-brand/5 transition-all">
                        Shortlist
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
