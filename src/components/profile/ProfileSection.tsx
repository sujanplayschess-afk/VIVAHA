'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Plus } from 'lucide-react';

interface Field {
    label: string;
    value: string | undefined | null;
}

interface ProfileSectionProps {
    title: string;
    fields: Field[];
    onEdit?: () => void;
    isEmpty?: boolean;
    emptyMessage?: string;
    delay?: number;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
    title, fields, onEdit, isEmpty, emptyMessage = 'No information added yet.', delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="card-premium p-6 hover:shadow-premium-hover transition-all relative"
        >
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-brand bg-pink-50 rounded-full hover:bg-pink-100 transition-all"
                    >
                        {isEmpty ? <Plus size={14} /> : <Pencil size={14} />}
                        {isEmpty ? 'Add' : 'Edit'}
                    </button>
                )}
            </div>

            {isEmpty ? (
                <p className="text-sm text-brand-navy/40 italic">{emptyMessage}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {fields.map((field) => (
                        <div key={field.label}>
                            <p className="text-xs font-semibold text-brand-navy/50 uppercase tracking-wider">{field.label}</p>
                            <p className="text-sm font-medium text-brand-navy mt-1">
                                {field.value || <span className="text-brand-navy/30 italic">Not specified</span>}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};
