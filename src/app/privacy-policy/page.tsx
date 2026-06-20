'use client';
import React from 'react';
import Link from 'next/link';
import PublicTopbar from '@/components/PublicTopbar';
import HomeFooter from '@/app/components/HomeFooter';

export default function PrivacyPolicyPage() {
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
          <h1 className="font-display text-4xl font-bold text-center" style={{ color: '#4A0E1A', marginBottom: '32px' }}>Privacy Policy</h1>
          <div className="text-sm" style={{ color: '#7a6050', lineHeight: '1.9' }}>
            <p style={{ marginBottom: '16px' }}><strong style={{ color: '#4A0E1A' }}>Last updated:</strong> January 2025</p>
            <p style={{ marginBottom: '16px' }}>VivahaSetu respects your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our matrimonial platform.</p>
            <h2 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginTop: '24px', marginBottom: '8px' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '12px' }}>We collect personal information you provide during registration including name, email, phone number, date of birth, religion, community, education details, occupation, photographs, and preferences for a life partner.</p>
            <h2 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginTop: '24px', marginBottom: '8px' }}>2. How We Use Your Information</h2>
            <p style={{ marginBottom: '12px' }}>Your information is used to create and maintain your profile, match you with potential partners, verify your identity, process payments, and communicate with you about our services.</p>
            <h2 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginTop: '24px', marginBottom: '8px' }}>3. Data Protection</h2>
            <p style={{ marginBottom: '12px' }}>We implement industry-standard security measures to protect your data. Your profile information is only visible to registered members. We never share your contact details without your explicit consent.</p>
            <h2 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginTop: '24px', marginBottom: '8px' }}>4. Contact</h2>
            <p style={{ marginBottom: '12px' }}>For privacy-related inquiries, please contact us at support@vivahasetu.com.</p>
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
