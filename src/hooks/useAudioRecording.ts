'use client'

import { useState, useRef, useCallback } from 'react'

interface UseAudioRecordingReturn {
  isRecording: boolean
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob | null>
  isSupported: boolean
  error: string | null
}

export function useAudioRecording(): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  // Check if browser supports MediaRecorder
  const isSupported = typeof window !== 'undefined' && 'MediaRecorder' in window

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Audio recording not supported in this browser')
      return
    }

    try {
      setError(null)
      audioChunksRef.current = []

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })
      
      streamRef.current = stream

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus' // Good compression and quality
      })

      mediaRecorderRef.current = mediaRecorder

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstart = () => {
        setIsRecording(true)
      }

      mediaRecorder.onstop = () => {
        setIsRecording(false)
        // Stop the microphone stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.onerror = (event) => {
        setError(`Recording error: ${event}`)
        setIsRecording(false)
      }

      // Start recording
      mediaRecorder.start()

    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone permissions.')
        } else if (err.name === 'NotFoundError') {
          setError('No microphone found. Please check your device.')
        } else {
          setError(`Recording error: ${err.message}`)
        }
      } else {
        setError('Failed to start recording')
      }
      setIsRecording(false)
    }
  }, [isSupported])

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (!mediaRecorderRef.current) {
      return null
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!
      
      mediaRecorder.onstop = () => {
        // Create audio blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        resolve(audioBlob)
        
        // Cleanup
        mediaRecorderRef.current = null
        audioChunksRef.current = []
      }

      mediaRecorder.stop()
    })
  }, [])

  return {
    isRecording,
    startRecording,
    stopRecording,
    isSupported,
    error
  }
}