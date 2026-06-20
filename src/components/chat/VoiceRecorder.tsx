'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Play, Trash2, Send, Pause } from 'lucide-react'

interface VoiceRecorderProps {
  onSend: (blob: Blob) => void
  onCancel: () => void
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [audioLevels, setAudioLevels] = useState<number[]>(Array.from({ length: 20 }, () => 2))

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)
      analyserRef.current = analyser

      const updateLevels = () => {
        if (!analyserRef.current) return
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)
        const levels = Array.from({ length: 20 }, (_, i) => {
          const idx = Math.floor((i / 20) * dataArray.length)
          return Math.max(2, (dataArray[idx] || 0) / 25)
        })
        setAudioLevels(levels)
        animationFrameRef.current = requestAnimationFrame(updateLevels)
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setRecordedBlob(blob)
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        if (audioContext.state !== 'closed') audioContext.close()
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      updateLevels()

      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1)
      }, 1000)
    } catch {}
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const togglePlayback = () => {
    if (!recordedBlob) return
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      const url = URL.createObjectURL(recordedBlob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => setIsPlaying(false)
      audio.play()
      setIsPlaying(true)
    }
  }

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
    const sec = s % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const handleCancel = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    setRecordedBlob(null)
    setElapsed(0)
    onCancel()
  }

  const handleSend = () => {
    if (recordedBlob) onSend(recordedBlob)
  }

  return (
    <div className="bg-white/80 backdrop-blur-2xl border-t border-white/20 px-4 py-3">
      <div className="flex items-center gap-4 max-w-4xl mx-auto">
        {!recordedBlob && !isRecording && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="w-12 h-12 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-lg shadow-brand/20"
          >
            <Mic size={20} />
          </motion.button>
        )}

        {isRecording && (
          <>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"
            />
            <span className="text-sm font-mono text-red-500 font-bold">{formatTime(elapsed)}</span>
            <div className="flex-1 flex items-end gap-0.5 h-8">
              {audioLevels.map((level, i) => (
                <motion.div
                  key={i}
                  className="w-full bg-brand/60 rounded-full"
                  animate={{ height: level * 8 + 2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center"
            >
              <Square size={16} />
            </motion.button>
          </>
        )}

        {recordedBlob && !isRecording && (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayback}
              className="w-12 h-12 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-lg"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </motion.button>
            <div className="flex-1 h-10 bg-white/30 rounded-full overflow-hidden flex items-center px-3">
              <div className="flex items-center gap-0.5 w-full">
                {audioLevels.slice(0, 30).map((level, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-brand/40 rounded-full"
                    style={{ height: Math.max(2, level * 6) }}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-brand-navy/50 font-mono">{formatTime(elapsed)}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCancel}
              className="w-10 h-10 rounded-full bg-white/50 border border-white/20 flex items-center justify-center"
            >
              <Trash2 size={16} className="text-brand-navy/50" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-lg"
            >
              <Send size={16} />
            </motion.button>
          </>
        )}
      </div>
    </div>
  )
}
