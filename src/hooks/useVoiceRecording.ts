'use client'

import { useState, useRef, useCallback } from 'react'

interface UseVoiceRecordingReturn {
  isRecording: boolean
  transcript: string
  startRecording: () => void
  stopRecording: () => void
  isSupported: boolean
  error: string | null
}

export function useVoiceRecording(): UseVoiceRecordingReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  // Check if browser supports speech recognition
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const startRecording = useCallback(() => {
    if (!isSupported) {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (isMobile) {
        setError('Voice input requires Chrome on Android. iOS Safari does not support voice input.')
      } else {
        setError('Speech recognition not supported. Please use Chrome, Edge, or Safari.')
      }
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsRecording(true)
        setError(null)
        setTranscript('')
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const result = event.results[0]?.[0]?.transcript
        if (result) {
          setTranscript(result)
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone permissions.')
        } else if (event.error === 'network') {
          setError('Network error. Voice requires HTTPS connection.')
        } else {
          setError(`Speech recognition error: ${event.error}`)
        }
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setError('Failed to start speech recognition')
      setIsRecording(false)
    }
  }, [isSupported])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }, [])

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    isSupported,
    error
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any
  }
}