'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import PublicTopbar from '@/components/PublicTopbar';
import HomeFooter from '@/app/components/HomeFooter';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'How do I create a profile on VivahaSetu?', a: 'Click on "Register Free" and fill in your details including name, email, mobile number, and basic preferences. It takes less than 5 minutes to create your profile.' },
  { q: 'Is VivahaSetu only for South Indian communities?', a: 'While we focus on Billava, Ediga, and Namadhari communities, we welcome all individuals seeking meaningful matrimonial alliances within these communities.' },
  { q: 'How does profile verification work?', a: 'Users can upload government-issued ID documents (Aadhaar, PAN, Passport, etc.) for verification. Our team reviews documents and verifies profiles to ensure authenticity.' },
  { q: 'What is a Premium subscription?', a: 'Premium membership gives you access to advanced features like unlimited messaging, profile visibility boost, priority support, and detailed compatibility insights.' },
  { q: 'How do I contact support?', a: 'You can reach us at 08069578121 or email support@vivahasetu.com. Our team is available Monday to Saturday, 10 AM to 7 PM IST.' },
  { q: 'Is my data safe on VivahaSetu?', a: 'Yes, we use industry-standard encryption to protect your data. Your contact details are only shared with matches you choose to connect with.' },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <>
      <PublicTopbar />
      <main style={{ background: '#FFFDF7', minHeight: '60vh', padding: '80px 0' }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
              <span style={{ color: '#C9A227', fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Help Centre</span>
              <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
            </div>
            <h1 className="font-display text-4xl font-bold" style={{ color: '#4A0E1A' }}>Frequently Asked Questions</h1>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8d5b0', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenId(openId === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span className="font-display font-bold" style={{ color: '#4A0E1A', fontSize: '15px' }}>{faq.q}</span>
                  {openId === i ? <ChevronUp size={18} style={{ color: '#C9A227' }} /> : <ChevronDown size={18} style={{ color: '#C9A227' }} />}
                </button>
                {openId === i && (
                  <div style={{ padding: '0 16px 16px' }}>
                    <p style={{ color: '#7a6050', fontSize: '14px', lineHeight: '1.8' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p style={{ color: '#7a6050', fontSize: '14px', marginBottom: '12px' }}>Still have questions?</p>
            <Link href="/contact-us" className="inline-flex items-center px-6 py-2.5 rounded-lg text-white font-semibold" style={{ background: 'linear-gradient(135deg, #6A0D25, #4A0E1A)' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <HomeFooter />
    </>
  );
}
