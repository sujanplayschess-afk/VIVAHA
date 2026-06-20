'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smile, Heart, UtensilsCrossed, Plane, Gamepad2, Activity, Star } from 'lucide-react'

interface EmojiPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (emoji: string) => void
  anchorEl?: HTMLElement | null
}

const categories = [
  { id: 'smileys', icon: Smile, label: 'Smileys' },
  { id: 'heart', icon: Heart, label: 'Emotions' },
  { id: 'food', icon: UtensilsCrossed, label: 'Food' },
  { id: 'travel', icon: Plane, label: 'Travel' },
  { id: 'activities', icon: Gamepad2, label: 'Activities' },
  { id: 'symbols', icon: Star, label: 'Symbols' },
]

const emojisByCategory: Record<string, string[]> = {
  smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😮', '😯', '😲', '😳', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '☠️', '💩'],
  heart: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
  food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯'],
  travel: ['🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🎯', '🎮', '🕹️', '🎰', '♠️', '♥️', '♦️', '♣️', '🃏', '🀄', '🎴', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯'],
  symbols: ['💯', '🔥', '⭐', '🌟', '✨', '💫', '🎉', '🎊', '🎈', '🎁', '💝', '💞', '💗', '✅', '❌', '❓', '❗', '💢', '💬', '💭', '🗨️', '🗯️', '🕳️', '💤', '💦', '💨', '🫂', '💪', '👏', '🙌', '👐', '🤲', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '👋', '🤚', '✋', '🖐️', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👌', '🫵', '🫶'],
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ isOpen, onClose, onSelect, anchorEl }) => {
  const [activeCategory, setActiveCategory] = useState('smileys')

  const currentEmojis = emojisByCategory[activeCategory] || []

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-20 left-4 right-4 md:left-auto md:right-auto md:w-[360px] z-50 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-1 px-3 py-3 border-b border-white/10 overflow-x-auto">
              {categories.map(cat => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand/10 text-brand'
                        : 'text-brand-navy/50 hover:text-brand-navy/70 hover:bg-white/50'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="p-3 max-h-[240px] overflow-y-auto">
              <div className="grid grid-cols-8 gap-1">
                {currentEmojis.map((emoji, i) => (
                  <motion.button
                    key={`${emoji}-${i}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      onSelect(emoji)
                      onClose()
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/50 text-lg transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
