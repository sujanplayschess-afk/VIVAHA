'use client';
import React from 'react';
import Link from 'next/link';
import PublicTopbar from '@/components/PublicTopbar';
import HomeFooter from '@/app/components/HomeFooter';

export default function TermsOfServicePage() {
  return (
    <>
      <PublicTopbar />
      <main style={{ background: '#FFFDF7', minHeight: '60vh', padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
            <span style={{ color: '#C9A227', fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Legal</span>
            <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
          </div>
          <h1 className="font-display text-4xl font-bold text-center" style={{ color: '#4A0E1A', marginBottom: '32px' }}>Terms of Service</h1>
          <div className="text-sm" style={{ color: '#7a6050', lineHeight: '1.9' }}>
            <p style={{ marginBottom: '16px' }}><strong style={{ color: '#4A0E1A' }}>Last updated:</strong> January 2025</p>
            <p style={{ marginBottom: '16px' }}>By using VivahaSetu, you agree to these terms. Please read them carefully.</p>
            <h2 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginTop: '24px', marginBottom: '8px' }}>1. Account Registration</h2>
            <p style={{ marginBottom: '12px' }}>You must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
            <h2 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginTop: '24px', marginBottom: '8px' }}>2. User Conduct</h2>
            <p style={{ marginBottom: '12px' }}>Users must not post fake profiles, harass other members, share inappropriate content, or use the platform for any illegal purpose. Violations may result in account suspension.</p>
            <h2 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginTop: '24px', marginBottom: '8px' }}>3. Payments & Subscriptions</h2>
            <p style={{ marginBottom: '12px' }}>Premium subscriptions are auto-renewing unless cancelled. Refund requests are handled on a case-by-case basis. All prices are in Indian Rupees (INR).</p>
            <h2 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginTop: '24px', marginBottom: '8px' }}>4. Limitation of Liability</h2>
            <p style={{ marginBottom: '12px' }}>VivahaSetu is a platform for connecting individuals. We are not responsible for the conduct of any user or the success of any match. Use the platform at your own discretion.</p>
          </div>
          <div className="text-center mt-12">
            <Link href="/register" className="inline-flex items-center px-8 py-3 rounded-lg text-white font-semibold" style={{ background: 'linear-gradient(135deg, #6A0D25, #4A0E1A)' }}>
              Register Now
            </Link>
          </div>
        </div>
      </main>
      <HomeFooter />
    </>
  );
}
