'use client';
import React from 'react';
import Link from 'next/link';

const communities = [
  { name: 'Billava', count: '48,200+', desc: 'Coastal Karnataka', gradient: 'linear-gradient(135deg, #6A0D25, #4A0E1A)' },
  { name: 'Ediga', count: '32,100+', desc: 'Karnataka', gradient: 'linear-gradient(135deg, #5A1A2A, #3A0E18)' },
  { name: 'Namadhari', count: '18,400+', desc: 'Karnataka', gradient: 'linear-gradient(135deg, #6A0D25, #4A0E1A)' },
];

export default function CommunitiesSection() {
  return (
    <section style={{ background: '#ffffff', padding: '64px 0' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
            <span style={{ color: '#C9A227', fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              3 Communities
            </span>
            <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#4A0E1A' }}>
            Your Community, Your Match
          </h2>
          <p style={{ color: '#7a6050', fontSize: '15px', maxWidth: '520px', margin: '8px auto 0', lineHeight: '1.6' }}>
            VivahaSetu honours community traditions while connecting families across South India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {communities.map((c) => (
            <div key={c.name} style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: c.gradient, padding: '28px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div className="font-display text-2xl font-bold text-white mb-1">{c.name}</div>
                <div style={{ color: '#D4AF37', fontSize: '24px', fontWeight: '700' }}>{c.count}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: '2px' }}>{c.desc}</div>
                <Link href={`/search?community=${c.name.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px', padding: '6px 18px', background: 'rgba(255,255,255,0.15)', borderRadius: '999px', color: '#fff', fontSize: '12px', fontWeight: '600', backdropFilter: 'blur(4px)' }}>
                  View Profiles →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
