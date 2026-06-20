'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
    id: string;
    url?: string;
    isPrimary?: boolean;
    isPrivate?: boolean;
}

interface PhotoGalleryProps {
    photos?: Photo[];
    maxPhotos?: number;
    onUpload?: () => void;
    onToggleVisibility?: (id: string) => void;
    onRemove?: (id: string) => void;
    delay?: number;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
    photos = [], maxPhotos = 6, onUpload, onToggleVisibility, onRemove, delay = 0
}) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const primary = photos.find((p) => p.isPrimary);
    const rest = photos.filter((p) => !p.isPrimary);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="card-premium p-6 hover:shadow-premium-hover transition-all"
        >
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-brand-navy">Photos</h3>
                {photos.length < maxPhotos && onUpload && (
                    <button
                        onClick={onUpload}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-brand bg-pink-50 rounded-full hover:bg-pink-100 transition-all"
                    >
                        <Plus size={14} /> Upload
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {primary && (
                    <div className="col-span-2 row-span-2 relative group rounded-xl overflow-hidden">
                        <div className="w-full aspect-square bg-brand-gradient flex items-center justify-center">
                            <span className="text-6xl font-bold text-white/60">P</span>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                            <button onClick={() => setLightboxIndex(0)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                                <Eye size={16} className="text-brand-navy" />
                            </button>
                            {onToggleVisibility && (
                                <button onClick={() => onToggleVisibility(primary.id)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                                    {primary.isPrivate ? <EyeOff size={16} className="text-brand-navy" /> : <Eye size={16} className="text-brand-navy" />}
                                </button>
                            )}
                            {onRemove && (
                                <button onClick={() => onRemove(primary.id)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                                    <X size={16} className="text-red-500" />
                                </button>
                            )}
                        </div>
                        {primary.isPrivate && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded-md flex items-center gap-1">
                                <EyeOff size={10} /> Private
                            </div>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-premium-gold text-brand-navy text-[10px] font-bold rounded">Primary</span>
                    </div>
                )}

                {rest.map((photo, i) => (
                    <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square">
                        <div className="w-full h-full bg-gradient-to-br from-brand/20 to-brand/20 flex items-center justify-center">
                            <span className="text-2xl font-bold text-brand-navy/40">{i + 2}</span>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button onClick={() => setLightboxIndex(i + (primary ? 1 : 0))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <Eye size={14} className="text-brand-navy" />
                            </button>
                            {onToggleVisibility && (
                                <button onClick={() => onToggleVisibility(photo.id)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    {photo.isPrivate ? <EyeOff size={14} className="text-brand-navy" /> : <Eye size={14} className="text-brand-navy" />}
                                </button>
                            )}
                            {onRemove && (
                                <button onClick={() => onRemove(photo.id)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <X size={14} className="text-red-500" />
                                </button>
                            )}
                        </div>
                        {photo.isPrivate && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded flex items-center gap-1">
                                <EyeOff size={8} /> Private
                            </div>
                        )}
                    </div>
                ))}

                {Array.from({ length: Math.min(maxPhotos, 6) - photos.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-xl border-2 border-dashed border-gray-50 flex items-center justify-center">
                        <div className="text-center">
                            <Plus size={20} className="mx-auto text-brand-navy/20" />
                            <p className="text-[10px] text-brand-navy/20 mt-1">Add Photo</p>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button
                            className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <X size={20} className="text-white" />
                        </button>

                        <button
                            className="absolute left-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => prev !== null && prev > 0 ? prev - 1 : prev); }}
                            disabled={lightboxIndex === 0}
                        >
                            <ChevronLeft size={20} className="text-white" />
                        </button>

                        <div className="w-96 h-96 bg-brand-gradient rounded-2xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <span className="text-8xl font-bold text-white/40">{lightboxIndex + 1}</span>
                        </div>

                        <button
                            className="absolute right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => prev !== null && prev < photos.length - 1 ? prev + 1 : prev); }}
                            disabled={lightboxIndex === photos.length - 1}
                        >
                            <ChevronRight size={20} className="text-white" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
