'use client';
import React from 'react';
import Link from 'next/link';
import PublicTopbar from '@/components/PublicTopbar';
import HomeFooter from '@/app/components/HomeFooter';

export default function SuccessStoriesPage() {
  return (
    <>
      <PublicTopbar />
      <main style={{ background: '#FFFDF7', minHeight: '60vh', padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
            <span style={{ color: '#C9A227', fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Success Stories</span>
            <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
          </div>
          <h1 className="font-display text-4xl font-bold" style={{ color: '#4A0E1A', marginBottom: '16px' }}>Real Love Stories</h1>
          <p style={{ color: '#7a6050', fontSize: '16px', maxWidth: '560px', margin: '0 auto 48px', lineHeight: '1.7' }}>
            Heartwarming journeys of couples who found their life partners through VivahaSetu. Be inspired by their stories.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              { name: 'Rahul & Priya', date: 'March 2025', story: 'We met through VivahaSetu in January 2025. Our families connected through the platform, and we found we shared the same values and dreams. Got married in a beautiful ceremony in Mangaluru.' },
              { name: 'Arun & Deepika', date: 'December 2024', story: 'After months of searching, I found Deepika through a community match. The verification process gave our families confidence. We are grateful to VivahaSetu for bringing us together.' },
              { name: 'Suresh & Lakshmi', date: 'October 2024', story: 'Both from Ediga community, we were matched through the platform\'s community-based search. Our families appreciated the authentic profiles and detailed background verification.' },
            ].map((story) => (
              <div key={story.name} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8d5b0', padding: '28px' }}>
                <h3 className="font-display text-xl font-bold" style={{ color: '#4A0E1A', marginBottom: '4px' }}>{story.name}</h3>
                <p style={{ color: '#C9A227', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>{story.date}</p>
                <p style={{ color: '#7a6050', fontSize: '14px', lineHeight: '1.8' }}>{story.story}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '48px' }}>
            <p style={{ color: '#7a6050', fontSize: '15px', marginBottom: '16px' }}>Ready to find your life partner?</p>
            <Link href="/register" className="inline-flex items-center px-8 py-3 rounded-lg text-white font-semibold" style={{ background: 'linear-gradient(135deg, #6A0D25, #4A0E1A)' }}>
              Create Your Profile
            </Link>
          </div>
        </div>
      </main>
      <HomeFooter />
    </>
  );
}
