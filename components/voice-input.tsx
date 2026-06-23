'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isListening: boolean
  setIsListening: (listening: boolean) => void
}

export function VoiceInput({ onTranscript, isListening, setIsListening }: VoiceInputProps) {
  const recognitionRef = useRef<any>(null)
  const [transcript, setTranscript] = useState('')
  const [isBrowserSupported, setIsBrowserSupported] = useState(true)

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsBrowserSupported(false)
      return
    }

    recognitionRef.current = new SpeechRecognition()
    const recognition = recognitionRef.current

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript
        interim += transcriptSegment
      }
      setTranscript(interim)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (transcript) {
        onTranscript(transcript)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    return () => {
      recognition.abort()
    }
  }, [onTranscript, transcript])

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setTranscript('')
      recognitionRef.current.start()
    }
  }

  if (!isBrowserSupported) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggleVoiceInput}
        variant={isListening ? 'default' : 'outline'}
        size="sm"
        className={`${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}`}
        title="Voice input (click to start/stop)"
      >
        🎤
      </Button>
      {transcript && (
        <span className="text-xs text-muted-foreground italic">{transcript}</span>
      )}
    </div>
  )
}
