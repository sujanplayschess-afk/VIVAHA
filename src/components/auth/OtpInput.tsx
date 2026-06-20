'use client';

import React, { useRef, ClipboardEvent, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split('').slice(0, length);

  const focusInput = (index: number) => {
    const ref = inputRefs.current[index];
    if (ref) ref.focus();
  };

  const handleChange = (index: number, char: string) => {
    if (!/^\d$/.test(char)) return;
    const newDigits = [...digits];
    newDigits[index] = char;
    const newValue = newDigits.join('');
    onChange(newValue);
    if (index < length - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = '';
        onChange(newDigits.join(''));
      } else if (index > 0) {
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        focusInput(index - 1);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(paste);
    const targetIndex = paste.length < length ? paste.length : length - 1;
    focusInput(targetIndex);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {Array.from({ length }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digits[index] || ''}
              disabled={disabled}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-poppins rounded-xl border-2 transition-all duration-200 outline-none
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${error
                  ? 'border-red-400 bg-red-50 text-red-600'
                  : digits[index]
                    ? 'border-brand bg-brand/5 text-brand-navy'
                    : 'border-gray-200 bg-white text-brand-navy focus:border-brand focus:shadow-[0_0_0_3px_rgba(233,30,118,0.1)]'
                }`}
            />
          </motion.div>
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center mt-2 font-inter">{error}</p>
      )}
    </div>
  );
};
