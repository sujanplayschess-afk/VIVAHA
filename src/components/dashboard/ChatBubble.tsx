'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, Paperclip, Image, FileText } from 'lucide-react';

interface ChatBubbleProps {
  content: string;
  timestamp: Date;
  isSent: boolean;
  readStatus?: 'sent' | 'delivered' | 'read';
  mediaType?: 'image' | 'document' | null;
  mediaUrl?: string | null;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  content,
  timestamp,
  isSent,
  readStatus = 'sent',
  mediaType = null,
  mediaUrl = null,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderReadStatus = () => {
    switch (readStatus) {
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-white/60" />;
      default:
        return <Check className="w-3.5 h-3.5 text-white/60" />;
    }
  };

  const renderMedia = () => {
    if (!mediaType || !mediaUrl) return null;
    if (mediaType === 'image') {
      return (
        <div className="rounded-xl overflow-hidden mb-2">
          <img src={mediaUrl} alt="Shared image" className="w-full max-w-[200px] rounded-xl" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 mb-2">
        <FileText className="w-4 h-4" />
        <span className="text-xs truncate">{mediaUrl}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`max-w-[75%] min-w-[80px] ${
          isSent
            ? 'bg-brand-gradient text-white rounded-2xl rounded-br-md'
            : 'bg-gray-50 text-brand-navy rounded-2xl rounded-bl-md'
        } px-4 py-2.5 shadow-sm`}
      >
        {renderMedia()}
        {content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        )}
        <div className={`flex items-center justify-end gap-1 mt-1 ${isSent ? '' : 'justify-end'}`}>
          <span className={`text-[10px] ${isSent ? 'text-white/60' : 'text-brand-navy/40'}`}>
            {formatTime(timestamp)}
          </span>
          {isSent && renderReadStatus()}
        </div>
      </div>
    </motion.div>
  );
};
