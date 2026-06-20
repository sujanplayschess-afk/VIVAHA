'use client';
import React from 'react';
import { Heart, Users, Shield, Star } from 'lucide-react';

const stats = [
  { value: '2,84,000+', label: 'Verified Profiles', icon: Users },
  { value: '18,420+', label: 'Successful Marriages', icon: Heart },
  { value: '47+', label: 'Communities Served', icon: Shield },
  { value: '96%', label: 'Profile Accuracy Rate', icon: Star },
];

export default function StatsSection() {
  return (
    <section style={{ background: '#FFFDF7', padding: '48px 0' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#f8f0e8' }}>
                <stat.icon size={24} style={{ color: '#6A0D25' }} />
              </div>
              <div className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#4A0E1A' }}>
                {stat.value}
              </div>
              <div style={{ color: '#7a6050', fontSize: '13px', marginTop: '4px', fontWeight: '500' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
