import React from 'react';
import PublicTopbar from '@/components/PublicTopbar';
import HeroSection from '@/app/components/HeroSection';
import HowItWorks from '@/app/components/HowItWorks';
import FeaturedProfiles from '@/app/components/FeaturedProfiles';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import HomeFooter from '@/app/components/HomeFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen" suppressHydrationWarning>
      <PublicTopbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturedProfiles />
        <TestimonialsSection />
      </main>
      <HomeFooter />
    </div>
  );
}
