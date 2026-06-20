'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Circle } from 'lucide-react';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  isActive: boolean;
}

interface ChatListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ conversations, activeId, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/40" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="input-field w-full pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Search className="w-10 h-10 text-brand-navy/20 mb-3" />
            <p className="text-sm text-brand-navy/40 font-inter">No conversations found</p>
          </div>
        ) : (
          filtered.map((conversation) => (
            <motion.button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-start gap-3 p-3 text-left transition-colors ${
                conversation.id === activeId
                  ? 'bg-brand/5 border-l-2 border-brand'
                  : 'hover:bg-gray-50 border-l-2 border-transparent'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-sm">
                  {conversation.name.charAt(0).toUpperCase()}
                </div>
                {conversation.isOnline && (
                  <Circle className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-green-500 fill-green-500 stroke-white stroke-[2px]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-brand-navy truncate">
                    {conversation.name}
                  </span>
                  <span className="text-[10px] text-brand-navy/40 whitespace-nowrap ml-2">
                    {formatTime(conversation.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-navy/50 truncate">
                    {conversation.lastMessage}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};
