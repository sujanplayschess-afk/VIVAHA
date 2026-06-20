'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Suresh & Mangala',
    community: 'Billava Community',
    location: 'Mangaluru',
    date: '2025',
    text: 'VivahaSetu found us a match within our community that our families approved of immediately. The verified profiles gave everyone confidence. We were married within 8 months.',
    photo: 'https://images.unsplash.com/photo-1587271473532-a4ef50da73b7?w=400&q=80',
    rating: 5,
  },
  {
    name: 'Prakash & Savitha',
    community: 'Ediga Community',
    location: 'Bengaluru',
    date: '2025',
    text: 'As parents, we were worried about using an online platform. But VivahaSetu felt completely different — like speaking to a trusted community elder. Our son found his life partner here.',
    photo: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80',
    rating: 5,
  },
  {
    name: 'Anil & Rekha',
    community: 'Billava Community',
    location: 'Udupi',
    date: '2026',
    text: 'The community-based matching and family-oriented approach made finding a compatible match so much easier. The recommendations were surprisingly accurate about compatibility.',
    photo: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#F5F7FC] to-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#C9A227]" />
            <span className="text-[#C9A227] text-xs font-semibold tracking-[0.2em] uppercase">Success Stories</span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#C9A227]" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0B1488] mb-4">
            Marriages Made Here
          </h2>
          <p className="text-[#6B7280] text-base max-w-xl mx-auto leading-relaxed">
            Over 18,000 families have found their perfect alliance through VivahaSetu.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img src={t.photo} alt={t.name} className="w-full h-52 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-lg text-[#0B1488]">{t.name}</h3>
                    <Quote className="w-6 h-6 text-[#C9A227]/20 shrink-0" />
                  </div>
                  <p className="text-[#C9A227] text-xs font-semibold mb-4">{t.community} · {t.location} · {t.date}</p>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#C9A227]/10 to-transparent border border-[#C9A227]/20">
            <span className="text-[#C9A227] text-lg">&ldquo;</span>
            <span className="text-[#6B7280] text-sm italic">VivahaSetu — where families find their perfect match.</span>
            <span className="text-[#C9A227] text-lg">&rdquo;</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
