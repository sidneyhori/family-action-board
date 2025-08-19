'use client'

import { useState, useEffect } from 'react'
import { Todo, TodoAssignee, TodoColor } from '@/types/todo'
import { useVoiceRecording } from '@/hooks/useVoiceRecording'
import { Mic, MicOff, X, Loader2, Volume2 } from 'lucide-react'

interface VoiceTaskModalProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

interface ParsedTask {
  title: string
  description: string | null
  assigned_to: TodoAssignee
  color: TodoColor
  due_date: string | null
}

export default function VoiceTaskModal({ onSubmit, onCancel }: VoiceTaskModalProps) {
  const { isRecording, transcript, startRecording, stopRecording, isSupported, error } = useVoiceRecording()
  const [isParsing, setIsParsing] = useState(false)
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [hasAttemptedParsing, setHasAttemptedParsing] = useState(false)
  const [isEditingTranscript, setIsEditingTranscript] = useState(false)
  const [editedTranscript, setEditedTranscript] = useState('')

  useEffect(() => {
    if (transcript && !isRecording && !hasAttemptedParsing) {
      setEditedTranscript(transcript)
      // Don't auto-parse, show edit option first
    }
  }, [transcript, isRecording, hasAttemptedParsing])

  useEffect(() => {
    if (!isRecording && !transcript && !isParsing && !parsedTask && !parseError) {
      // Handle case where recording stopped but no transcript captured (mobile Chrome issue)
      const timer = setTimeout(() => {
        if (!transcript && !isParsing && !parsedTask && !parseError) {
          setParseError('No speech detected. Please try speaking more clearly or check microphone permissions.')
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isRecording, transcript])

  const parseVoiceInput = async (text: string) => {
    setIsParsing(true)
    setParseError(null)

    try {
      const response = await fetch('/api/parse-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to parse voice input`)
      }

      const parsed: ParsedTask = await response.json()
      setParsedTask(parsed)
    } catch (error) {
      console.error('Error parsing voice:', error)
      
      // More specific error messages
      if (error instanceof Error) {
        setParseError(`Error: ${error.message}`)
      } else {
        setParseError('Failed to understand the task. Please try again.')
      }
    } finally {
      setIsParsing(false)
    }
  }

  const handleConfirm = () => {
    if (parsedTask) {
      onSubmit({
        ...parsedTask,
        status: 'pending'
      })
    }
  }

  const handleTryAgain = () => {
    setParsedTask(null)
    setParseError(null)
    setIsParsing(false)
    setHasAttemptedParsing(false)
    setIsEditingTranscript(false)
    setEditedTranscript('')
    // Note: transcript is managed by the hook, we don't reset it here
  }

  const handleEditTranscript = () => {
    setIsEditingTranscript(true)
  }

  const handleConfirmTranscript = () => {
    setHasAttemptedParsing(true)
    parseVoiceInput(editedTranscript)
  }

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Not Supported</h3>
            <p className="text-gray-600 mb-4">
              Voice input requires Chrome, Edge, or Safari on desktop. Mobile support is limited to Chrome Android.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Please use the regular form instead, or try on a supported browser.
            </p>
            <button
              onClick={onCancel}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Voice Task</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {!parsedTask && !isParsing && !parseError && !editedTranscript && (
          <div className="text-center space-y-4">
            <div className="text-gray-600 mb-4">
              <Volume2 size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="text-sm">
                Speak clearly and use full sentences for better accuracy:
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">
&quot;Remind Sid to update addresses by tomorrow&quot; or &quot;Pri needs to book dentist appointment, red priority&quot;
              </p>
              <p className="text-xs text-orange-600 mt-1">
                💡 Longer phrases work better than single words
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isParsing}
              className={`flex items-center gap-2 mx-auto px-6 py-3 rounded-lg font-medium transition-all ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            {transcript && (
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 mb-1">You said:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">
                  &quot;{transcript}&quot;
                </p>
              </div>
            )}
            
          </div>
        )}

        {editedTranscript && !isParsing && !parseError && !parsedTask && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">I heard you say:</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                {isEditingTranscript ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedTranscript}
                      onChange={(e) => setEditedTranscript(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                      rows={2}
                      placeholder="Edit what you said..."
                      autoFocus
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleConfirmTranscript}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                      >
                        ✓ Process This
                      </button>
                      <button
                        onClick={() => setIsEditingTranscript(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-800 italic font-medium">
                      &quot;{editedTranscript}&quot;
                    </p>
                    <p className="text-xs text-orange-600">
                      Does this look wrong? You can edit it before processing.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleConfirmTranscript}
                        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
                      >
                        ✓ Looks Good
                      </button>
                      <button
                        onClick={handleEditTranscript}
                        className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700"
                      >
                        ✏️ Edit Text
                      </button>
                      <button
                        onClick={handleTryAgain}
                        className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isParsing && (
          <div className="text-center py-8">
            <Loader2 size={32} className="animate-spin mx-auto mb-3 text-indigo-600" />
            <p className="text-gray-600">Understanding your task...</p>
          </div>
        )}

        {parseError && (
          <div className="text-center space-y-4">
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {parseError}
            </div>
            <button
              onClick={handleTryAgain}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {parsedTask && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">I heard you say:</p>
              <p className="text-sm text-gray-800 bg-blue-50 border border-blue-200 p-3 rounded-lg italic font-medium">
&quot;{transcript}&quot;
              </p>
              <p className="text-xs text-gray-500 mt-1">If this is wrong, try speaking more clearly</p>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="text-xs font-medium text-gray-700">Task:</span>
                <p className="text-sm text-gray-900">{parsedTask.title}</p>
              </div>
              
              {parsedTask.description && (
                <div>
                  <span className="text-xs font-medium text-gray-700">Description:</span>
                  <p className="text-sm text-gray-600">{parsedTask.description}</p>
                </div>
              )}

              <div className="flex gap-4">
                <div>
                  <span className="text-xs font-medium text-gray-700">Assigned to:</span>
                  <p className="text-sm text-gray-900">
                    {parsedTask.assigned_to === 'person1' ? 'Sid' : 
                     parsedTask.assigned_to === 'person2' ? 'Pri' : 'Gui'}
                  </p>
                </div>
                
                {parsedTask.due_date && (
                  <div>
                    <span className="text-xs font-medium text-gray-700">Due:</span>
                    <p className="text-sm text-gray-900">{parsedTask.due_date}</p>
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-medium text-gray-700">Color:</span>
                <div className={`inline-block w-4 h-4 rounded-full ml-2 bg-${parsedTask.color}-400`}></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Create Task
              </button>
              <button
                onClick={handleTryAgain}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}