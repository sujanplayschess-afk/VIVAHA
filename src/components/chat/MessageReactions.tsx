'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

interface MessageReactionsProps {
  reactions: { emoji: string; count: number; userIds: string[] }[]
  onAddReaction: (emoji: string) => void
  onRemoveReaction: (emoji: string) => void
  hasReacted?: string[]
  isOwnMessage?: boolean
}

const commonReactions = ['❤️', '😂', '😮', '😢', '😡', '👍']

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  onAddReaction,
  onRemoveReaction,
  hasReacted = [],
  isOwnMessage = false,
}) => {
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    if (showPicker) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPicker])

  if (!reactions.length && !isOwnMessage) return null

  return (
    <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <AnimatePresence mode="popLayout">
        {reactions.map((reaction) => {
          const isReacted = hasReacted.includes(reaction.emoji)
          return (
            <motion.button
              key={reaction.emoji}
              layout
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => isReacted ? onRemoveReaction(reaction.emoji) : onAddReaction(reaction.emoji)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                isReacted
                  ? 'bg-brand/10 border-brand/30 text-brand'
                  : 'bg-white/30 border-white/20 text-brand-navy/60 hover:bg-white/50'
              }`}
            >
              <span className="text-sm">{reaction.emoji}</span>
              {reaction.count > 1 && (
                <span className="text-[10px] font-bold">{reaction.count}</span>
              )}
            </motion.button>
          )
        })}
      </AnimatePresence>

      <div ref={pickerRef} className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPicker(!showPicker)}
          className="w-6 h-6 rounded-full bg-white/20 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
        >
          <Plus size={10} className="text-brand-navy/50" />
        </motion.button>

        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              className="absolute bottom-full mb-2 left-0 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-xl p-2 z-50"
            >
              <div className="flex items-center gap-1">
                {commonReactions.map(emoji => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      onAddReaction(emoji)
                      setShowPicker(false)
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 text-lg transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
