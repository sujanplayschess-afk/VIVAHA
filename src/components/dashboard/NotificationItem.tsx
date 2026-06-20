'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye, Bell, Crown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface NotificationItemProps {
    type: string;
    title: string;
    message?: string;
    timeAgo: string;
    isUnread?: boolean;
    onClick?: () => void;
    delay?: number;
}

const iconMap: Record<string, { icon: React.ElementType; bg: string }> = {
    INTEREST_RECEIVED: { icon: Heart, bg: 'bg-pink-100 text-pink-600' },
    INTEREST_ACCEPTED: { icon: CheckCircle, bg: 'bg-green-100 text-green-600' },
    MESSAGE_RECEIVED: { icon: MessageCircle, bg: 'bg-blue-100 text-blue-600' },
    PROFILE_VIEWED: { icon: Eye, bg: 'bg-purple-100 text-purple-600' },
    SYSTEM_ALERT: { icon: AlertTriangle, bg: 'bg-amber-100 text-amber-600' },
    SUBSCRIPTION_UPDATE: { icon: Crown, bg: 'bg-yellow-100 text-yellow-600' },
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ type, title, message, timeAgo, isUnread, onClick, delay = 0 }) => {
    const config = iconMap[type] || { icon: Bell, bg: 'bg-gray-100 text-gray-600' };
    const Icon = config.icon;

    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.3 }}
            onClick={onClick}
            className={`flex items-start gap-3 w-full p-3 rounded-xl text-left transition-all hover:bg-gray-50 ${isUnread ? 'bg-brand-sky/50' : ''
            }`}
        >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${isUnread ? 'font-bold text-brand-navy' : 'font-medium text-brand-navy/80'}`}>
                        {title}
                    </p>
                    {isUnread && <span className="w-2 h-2 rounded-full bg-brand shrink-0" />}
                </div>
                {message && <p className="text-xs text-brand-navy/50 mt-0.5 line-clamp-1">{message}</p>}
                <p className="text-[10px] text-brand-navy/40 mt-1">{timeAgo}</p>
            </div>
        </motion.button>
    );
};
