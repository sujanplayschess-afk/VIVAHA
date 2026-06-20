'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Star, MapPin, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

const profiles = [
  {
    name: 'Kavitha S.', age: 27, community: 'Billava Community', location: 'Mangaluru',
    occupation: 'Software Engineer', education: 'M.Tech, NITK',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    premium: true, verified: true,
  },
  {
    name: 'Arjun K.', age: 30, community: 'Ediga Community', location: 'Bengaluru',
    occupation: 'Doctor (MBBS)', education: 'MBBS, Kasturba Medical',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    premium: false, verified: true,
  },
  {
    name: 'Deepika R.', age: 25, community: 'Namadhari Community', location: 'Mysuru',
    occupation: 'Chartered Accountant', education: 'B.Com, CA Final',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    premium: true, verified: true,
  },
  {
    name: 'Rahul B.', age: 32, community: 'Billava Community', location: 'Udupi',
    occupation: 'Business Owner', education: 'MBA, Manipal University',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    premium: false, verified: true,
  },
];

export default function FeaturedProfiles() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#C9A227]" />
            <span className="text-[#C9A227] text-xs font-semibold tracking-[0.2em] uppercase">Curated Matches</span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#C9A227]" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0B1488] mb-4">
            Featured Profiles
          </h2>
          <p className="text-[#6B7280] text-base max-w-xl mx-auto leading-relaxed">
            Handpicked verified profiles from trusted South Indian families seeking meaningful matrimonial alliances.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href="/search" className="block group">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img src={p.photo} alt={p.name}
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {p.verified && (
                        <span className="bg-[#0B1488] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                      {p.premium && (
                        <span className="bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1488] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> Premium
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-bold text-lg text-[#0B1488]">{p.name}, {p.age}</h3>
                    </div>
                    <p className="text-[#C9A227] text-xs font-semibold mb-3">{p.community}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#6B7280] text-sm">
                        <MapPin className="w-3.5 h-3.5" /> {p.location}
                      </div>
                      <div className="flex items-center gap-2 text-[#6B7280] text-sm">
                        <Briefcase className="w-3.5 h-3.5" /> {p.occupation}
                      </div>
                      <div className="flex items-center gap-2 text-[#6B7280] text-sm">
                        <GraduationCap className="w-3.5 h-3.5" /> {p.education}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-[#C9A227] text-[#C9A227] font-semibold text-sm hover:bg-[#C9A227] hover:text-white transition-all group"
          >
            View All Profiles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
