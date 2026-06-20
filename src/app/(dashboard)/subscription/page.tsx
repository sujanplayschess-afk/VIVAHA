'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Crown, Check, Star, ChevronDown, Zap,
  Sparkles, Loader2, AlertCircle, X,
} from 'lucide-react'

const PLANS = [
  {
    name: 'Silver',
    icon: Star,
    monthlyPrice: 499,
    yearlyPrice: 4999,
    color: 'from-gray-400 to-gray-300',
    badge: null,
    popular: false,
    features: [
      'Send unlimited interests',
      'View basic profile details',
      'Basic search filters',
      'Chat with matched profiles',
      '20 profile views per day',
      'Email support',
      'Basic compatibility score',
    ],
  },
  {
    name: 'Gold',
    icon: Crown,
    monthlyPrice: 999,
    yearlyPrice: 9999,
    color: 'from-yellow-400 to-yellow-300',
    badge: 'Most Popular',
    popular: true,
    features: [
      'Everything in Silver',
      'Unlimited profile views',
      'Advanced search filters',
      'See who viewed your profile',
      'Priority customer support',
      'Photo & video gallery access',
      'Highlighted profile badge',
      'Advanced compatibility report',
    ],
  },
  {
    name: 'Diamond',
    icon: Sparkles,
    monthlyPrice: 1999,
    yearlyPrice: 19999,
    color: 'from-blue-400 to-purple-400',
    badge: 'Premium',
    popular: false,
    features: [
      'Everything in Gold',
      'AI-powered match suggestions',
      'Dedicated relationship manager',
      'Profile verification badge',
      'Video call & voice chat',
      'Astrology & compatibility report',
      'Exclusive events & webinars',
      'Family account manager',
      'Priority matchmaking',
    ],
  },
  {
    name: 'Platinum',
    icon: Crown,
    monthlyPrice: 4999,
    yearlyPrice: 49999,
    color: 'from-premium-gold to-yellow-500',
    badge: 'Ultimate',
    popular: false,
    features: [
      'Everything in Diamond',
      'Personal matchmaking consultant',
      'Concierge support 24/7',
      'Verified celebrity badge',
      'Exclusive VIP events access',
      'Priority profile in searches',
      'Relationship coaching sessions',
      'Background verification included',
      'Premium placement guarantee',
    ],
  },
]

const COMPARISON_ROWS = [
  { feature: 'Send Interests', silver: true, gold: true, diamond: true, platinum: true },
  { feature: 'Profile Views/Day', silver: '20', gold: 'Unlimited', diamond: 'Unlimited', platinum: 'Unlimited' },
  { feature: 'Search Filters', silver: 'Basic', gold: 'Advanced', diamond: 'Advanced', platinum: 'Advanced+' },
  { feature: 'See Who Viewed You', silver: false, gold: true, diamond: true, platinum: true },
  { feature: 'Chat & Messages', silver: true, gold: true, diamond: true, platinum: true },
  { feature: 'Video Calls', silver: false, gold: false, diamond: true, platinum: true },
  { feature: 'Highlighted Profile', silver: false, gold: true, diamond: true, platinum: true },
  { feature: 'Verified Badge', silver: false, gold: false, diamond: true, platinum: true },
  { feature: 'AI Match Suggestions', silver: false, gold: false, diamond: true, platinum: true },
  { feature: 'Dedicated Manager', silver: false, gold: false, diamond: true, platinum: true },
  { feature: 'Priority Support', silver: false, gold: true, diamond: true, platinum: true },
  { feature: 'VIP Events', silver: false, gold: false, diamond: true, platinum: true },
  { feature: 'Matchmaking Consultant', silver: false, gold: false, diamond: false, platinum: true },
]

const FAQS = [
  { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can upgrade anytime. Downgrades take effect at the end of your current billing cycle.' },
  { q: 'Is there a free trial available?', a: 'Yes! We offer a 7-day free trial on our Gold plan. No credit card required.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. You can cancel your subscription at any time. Your access continues until the end of the billing period.' },
  { q: 'How does billing work?', a: 'We bill monthly or yearly depending on your chosen plan. You\'ll receive a receipt via email.' },
  { q: 'Is my payment secure?', a: 'Yes, all payments are processed securely through Razorpay/Stripe with industry-standard encryption.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, Net Banking, and popular digital wallets.' },
  { q: 'Can I get a refund?', a: 'Yes, we offer a 7-day money-back guarantee on all plans. No questions asked.' },
]

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalPlan, setModalPlan] = useState<string | null>(null)

  const handleSelect = async (planName: string) => {
    setSelectedPlan(planName)
    setLoading(true)
    try {
      const price = isYearly ? PLANS.find(p => p.name === planName)?.yearlyPrice : PLANS.find(p => p.name === planName)?.monthlyPrice
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName.toLowerCase(), billing: isYearly ? 'yearly' : 'monthly', price }),
      })
      const data = await res.json()
      if (data.success) {
        setModalPlan(planName)
        setShowModal(true)
      } else {
        setModalPlan(planName)
        setShowModal(true)
      }
    } catch {
      setModalPlan(planName)
      setShowModal(true)
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand/10 rounded-full text-brand text-xs font-medium mb-4"
        >
          <Zap className="w-3.5 h-3.5" />
          Premium Plans
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          <span className="brand-gradient-text">Upgrade Your Matchmaking</span>
          <br />
          <span className="text-brand-navy">Experience</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-brand-navy/60 max-w-2xl mx-auto"
        >
          Unlock premium features to find your perfect match faster with enhanced privacy and priority support.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-4 mb-10"
      >
        <span className={`text-sm font-medium ${!isYearly ? 'text-brand-navy' : 'text-brand-navy/40'}`}>Monthly</span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={`relative w-16 h-8 rounded-full transition-all ${isYearly ? 'bg-brand-gradient' : 'bg-gray-200'}`}
        >
          <motion.div
            animate={{ x: isYearly ? 32 : 2 }}
            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
          />
        </button>
        <span className={`text-sm font-medium flex items-center gap-1 ${isYearly ? 'text-brand-navy' : 'text-brand-navy/40'}`}>
          Yearly
          <span className="text-[10px] text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full font-semibold">Save 15%</span>
        </span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {PLANS.map((plan, index) => {
          const Icon = plan.icon
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative bg-white/80 backdrop-blur-md rounded-3xl shadow-premium border overflow-hidden ${
                plan.popular
                  ? 'border-brand ring-2 ring-brand/20 scale-105 lg:scale-110 z-10'
                  : 'border-white/50'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0">
                  <div className={`px-4 py-1.5 text-xs font-bold text-white rounded-bl-2xl ${
                    plan.popular ? 'bg-brand-gradient' : 'bg-gradient-to-r ' + plan.color
                  }`}>
                    {plan.popular ? (
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-white" />{plan.badge}</span>
                    ) : plan.badge}
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-navy">{plan.name}</h3>
                    {plan.popular && (
                      <span className="text-[10px] text-brand font-semibold">Best Value</span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-brand-navy">₹{price.toLocaleString()}</span>
                  <span className="text-sm text-brand-navy/50 ml-1">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                  {isYearly && (
                    <div className="text-xs text-green-500 mt-1">
                      ₹{(plan.monthlyPrice * 12).toLocaleString()} yearly value
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-brand-navy/70">{feat}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(plan.name)}
                  disabled={loading && selectedPlan === plan.name}
                  className={`w-full h-12 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-brand-gradient text-white shadow-lg shadow-brand/25'
                      : 'border-2 border-brand/30 text-brand hover:bg-brand/5'
                  }`}
                >
                  {loading && selectedPlan === plan.name ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      {selectedPlan === plan.name ? 'Processing...' : 'Choose Plan'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-premium p-6 sm:p-8 border border-white/50 mb-16 overflow-x-auto"
      >
        <h2 className="text-xl font-bold text-brand-navy mb-6 text-center">
          Feature Comparison
        </h2>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left py-3 px-4 font-medium text-brand-navy/60">Feature</th>
              <th className="text-center py-3 px-4 font-semibold text-brand-navy">Silver</th>
              <th className="text-center py-3 px-4 font-semibold text-brand">Gold</th>
              <th className="text-center py-3 px-4 font-semibold text-brand-navy">Diamond</th>
              <th className="text-center py-3 px-4 font-semibold text-premium-gold">Platinum</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={i} className="border-b border-gray-50/50">
                <td className="py-3 px-4 text-brand-navy/70">{row.feature}</td>
                {(['silver', 'gold', 'diamond', 'platinum'] as const).map((tier) => (
                  <td key={tier} className="text-center py-3 px-4">
                    {typeof row[tier] === 'boolean' ? (
                      row[tier] ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XIcon className="w-4 h-4 text-red-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-brand-navy/70 text-xs">{row[tier]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-xl font-bold text-brand-navy mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 overflow-hidden shadow-premium"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-semibold text-brand-navy">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-brand-navy/40 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-sm text-brand-navy/60 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="text-center mt-12 mb-8">
        <p className="text-xs text-brand-navy/30">
          All plans are backed by a 7-day money-back guarantee. No questions asked.
        </p>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-[#C9A227]" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">
                {modalPlan} Plan Selected
              </h3>
              <p className="text-sm text-brand-navy/60 mb-6">
                Thank you for choosing the {modalPlan} plan! Our team will contact you shortly to complete the subscription process. You can also complete payment from your dashboard settings.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-brand-navy/70 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => { setShowModal(false); router.push('/settings') }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#d4af37] text-[#0B1488] text-sm font-bold hover:shadow-lg transition-all"
                >
                  Go to Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
