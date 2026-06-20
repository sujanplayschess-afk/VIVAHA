'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smile, Image, Paperclip, Mic, Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onSendVoice?: (blob: Blob) => void
  onSendImage?: (file: File) => void
  onOpenEmoji?: () => void
  placeholder?: string
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendVoice,
  onSendImage,
  onOpenEmoji,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isActive = message.trim().length > 0

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [message])

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) onSendImage?.(file)
    }
    input.click()
  }

  return (
    <div className="bg-white/80 backdrop-blur-2xl border-t border-white/20 px-4 py-3">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <div className="flex items-end bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 focus-within:border-brand/50 focus-within:shadow-[0_0_0_3px_rgba(233,30,118,0.1)] transition-all">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="flex-1 bg-transparent text-sm text-brand-navy placeholder:text-brand-navy/30 px-4 py-3 outline-none resize-none max-h-[120px] leading-relaxed"
            />

            <div className="flex items-center gap-1 px-2 pb-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onOpenEmoji}
                type="button"
                className="w-8 h-8 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
              >
                <Smile size={18} className="text-brand-navy/40 hover:text-brand transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleImageUpload}
                type="button"
                className="w-8 h-8 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
              >
                <Image size={18} className="text-brand-navy/40 hover:text-brand transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {}}
                type="button"
                className="w-8 h-8 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
              >
                <Paperclip size={18} className="text-brand-navy/40 hover:text-brand-navy transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSendVoice?.(new Blob())}
                type="button"
                className="w-8 h-8 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
              >
                <Mic size={18} className="text-brand-navy/40 hover:text-brand transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={isActive ? { scale: 1.05 } : {}}
          whileTap={isActive ? { scale: 0.95 } : {}}
          onClick={handleSend}
          disabled={!isActive || disabled}
          className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            isActive
              ? 'bg-brand-gradient text-white shadow-lg shadow-brand/20'
              : 'bg-gray-50 text-brand-navy/30'
          }`}
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  )
}
