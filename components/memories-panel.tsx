'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Memory {
  id: string
  key: string
  value: string
  importance: number
  createdAt: string
}

export function MemoriesPanel() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMemories()
  }, [])

  async function loadMemories() {
    try {
      setLoading(true)
      const response = await fetch('/api/memories')
      if (response.ok) {
        const data = await response.json()
        setMemories(data)
      }
    } catch (error) {
      console.error('Failed to load memories:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteMemory(id: string) {
    try {
      const response = await fetch(`/api/memories?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setMemories((prev) => prev.filter((m) => m.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete memory:', error)
    }
  }

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading memories...</div>
  }

  if (memories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No memories yet. Chat with Nino to start building your memory profile!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Learned Facts</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="flex items-start justify-between gap-3 p-3 bg-accent/50 rounded-lg border border-border/50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{memory.key}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{memory.value}</p>
              <div className="flex gap-2 mt-2">
                <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">
                  Importance: {memory.importance}/10
                </span>
              </div>
            </div>
            <Button
              onClick={() => deleteMemory(memory.id)}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
