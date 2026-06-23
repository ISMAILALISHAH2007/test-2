'use client'

import { useEffect, useState, useRef } from 'react'
import { getChatSessions, addMessage, getSessionMessages } from '@/app/actions/chat'
import { createChatSession } from '@/app/actions/chat'
import { Button } from '@/components/ui/button'
import { SettingsModal } from '@/components/settings-modal'
import { OrbVisualization } from '@/components/orb-visualization'
import { VoiceInput } from '@/components/voice-input'
import { getTTS } from '@/lib/text-to-speech'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  sentiment?: 'positive' | 'neutral' | 'negative'
}

export function ChatPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [lastSentiment, setLastSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const ttsRef = useRef(getTTS())

  // Load sessions on mount
  useEffect(() => {
    loadSessions()
  }, [])

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      loadMessages()
    }
  }, [currentSessionId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function detectSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = /\b(great|good|happy|love|excellent|amazing|wonderful|perfect|awesome)\b/gi
    const negativeWords = /\b(bad|terrible|hate|awful|horrible|poor|sad|worst)\b/gi
    
    const hasPositive = positiveWords.test(text)
    const hasNegative = negativeWords.test(text)
    
    if (hasPositive && !hasNegative) return 'positive'
    if (hasNegative && !hasPositive) return 'negative'
    return 'neutral'
  }

  async function loadSessions() {
    try {
      const data = await getChatSessions()
      setSessions(data)
      if (data.length > 0 && !currentSessionId) {
        setCurrentSessionId(data[0].id)
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  async function loadMessages() {
    try {
      const data = await getSessionMessages(currentSessionId)
      setMessages(data)
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  function handleVoiceTranscript(text: string) {
    setInput(text)
  }

  async function newChat() {
    try {
      setLoading(true)
      const sessionId = await createChatSession('New Chat')
      setCurrentSessionId(sessionId)
      setMessages([])
      await loadSessions()
    } catch (error) {
      console.error('Failed to create chat:', error)
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || !currentSessionId) return

    const userMessage = input
    setInput('')

    try {
      // Add user message
      await addMessage(currentSessionId, 'user', userMessage)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          content: userMessage,
          createdAt: new Date(),
        },
      ])

      // Stream AI response
      setStreaming(true)
      let aiResponse = ''

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: userMessage },
          ],
          sessionId: currentSessionId,
          provider: 'gemini',
        }),
      })

      if (!response.ok) throw new Error('Failed to get AI response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value)
          aiResponse += text

          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last?.role === 'assistant' && !last.id.startsWith('final-')) {
              return [
                ...prev.slice(0, -1),
                { ...last, content: aiResponse },
              ]
            } else {
              return [
                ...prev,
                {
                  id: `ai-${Date.now()}`,
                  role: 'assistant',
                  content: aiResponse,
                  createdAt: new Date(),
                  sentiment: detectSentiment(aiResponse),
                },
              ]
            }
          })
        }
      }

      // Update orb sentiment and speak response
      const sentiment = detectSentiment(aiResponse)
      setLastSentiment(sentiment)
      if (ttsRef.current) {
        ttsRef.current.speak(aiResponse)
      }

      await loadMessages() // Refresh to ensure persistence
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setStreaming(false)
    }
  }

  return (
    <>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border space-y-2">
            <Button
              onClick={newChat}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              New Chat
            </Button>
            <Button
              onClick={() => setShowSettings(true)}
              className="w-full"
              variant="outline"
            >
              Settings
            </Button>
          </div>
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-2 transition-colors ${
                currentSessionId === session.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              {session.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentSessionId ? (
          <>
            {/* Orb and Header */}
            <div className="border-b border-border p-6 bg-card/50">
              <div className="max-w-2xl mx-auto">
                <OrbVisualization sentiment={lastSentiment} isListening={isListening} />
                <h2 className="text-center mt-4 text-sm text-muted-foreground">
                  Sentiment: {lastSentiment.charAt(0).toUpperCase() + lastSentiment.slice(1)}
                </h2>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Nino</h2>
                    <p>Start a conversation to begin learning together</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-fade-in`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-3xl shadow-lg transition-all ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'glass-effect text-foreground'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="border-t border-border p-4 bg-card glass-effect"
            >
              <div className="flex gap-2 items-center">
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  isListening={isListening}
                  setIsListening={setIsListening}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type or use voice..."
                  disabled={streaming}
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all"
                />
                <Button
                  type="submit"
                  disabled={streaming || !input.trim()}
                >
                  {streaming ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">No chat selected</h2>
              <Button onClick={newChat}>Start a new chat</Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
