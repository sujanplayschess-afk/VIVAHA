'use client';
import React from 'react';
import Link from 'next/link';
import PublicTopbar from '@/components/PublicTopbar';
import HomeFooter from '@/app/components/HomeFooter';

export default function ContactUsPage() {
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <>
      <PublicTopbar />
      <main style={{ background: '#FFFDF7', minHeight: '60vh', padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
            <span style={{ color: '#C9A227', fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Support</span>
            <div style={{ width: '40px', height: '1px', background: '#C9A227' }} />
          </div>
          <h1 className="font-display text-4xl font-bold" style={{ color: '#4A0E1A', marginBottom: '8px' }}>Contact Us</h1>
          <p style={{ color: '#7a6050', fontSize: '16px', marginBottom: '48px' }}>We are here to help you. Reach out to us anytime.</p>

          <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8d5b0', padding: '32px' }}>
              <h3 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginBottom: '16px' }}>Get in Touch</h3>
              <div className="space-y-4 text-sm" style={{ color: '#7a6050' }}>
                <p><strong style={{ color: '#4A0E1A' }}>Phone:</strong> <a href="tel:08069578121" style={{ color: '#6A0D25' }}>08069578121</a></p>
                <p><strong style={{ color: '#4A0E1A' }}>Email:</strong> <a href="mailto:support@vivahasetu.com" style={{ color: '#6A0D25' }}>support@vivahasetu.com</a></p>
                <p><strong style={{ color: '#4A0E1A' }}>Address:</strong> #42, Brigade Road, Bengaluru, Karnataka 560001</p>
                <p><strong style={{ color: '#4A0E1A' }}>Hours:</strong> Mon–Sat, 10 AM – 7 PM IST</p>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8d5b0', padding: '32px' }}>
              {submitted ? (
                <div className="text-center py-8">
                  <div style={{ color: '#C9A227', fontSize: '48px', marginBottom: '12px' }}>✓</div>
                  <h3 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginBottom: '8px' }}>Message Sent!</h3>
                  <p style={{ color: '#7a6050', fontSize: '14px' }}>We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-lg font-bold" style={{ color: '#4A0E1A', marginBottom: '16px' }}>Send a Message</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Your Name" className="form-input w-full" />
                    <input type="email" placeholder="Your Email" className="form-input w-full" />
                    <textarea placeholder="Your Message" rows={4} className="form-input w-full resize-none" style={{ borderRadius: '6px', border: '1.5px solid #e8d5b0', padding: '10px', fontSize: '13px', width: '100%' }} />
                    <button onClick={() => setSubmitted(true)} style={{ background: 'linear-gradient(135deg, #6A0D25, #4A0E1A)', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                      Send Message
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <HomeFooter />
    </>
  );
}
