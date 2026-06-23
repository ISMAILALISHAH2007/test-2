import { auth } from '@/lib/auth'
import { addMessage, getUserMemories, updateMemory } from '@/app/actions/chat'
import { headers } from 'next/headers'
import { streamText } from 'ai'
import { getModel, analyzeSentiment } from '@/lib/ai-provider'
import { getDb } from '@/lib/db'
import { userSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { extractMemories, buildMemoryContext } from '@/lib/memory-service'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages, sessionId } = await req.json()
    
    // Get user's preferred provider
    const db = getDb()
    const userSettingsRecord = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1)
    
    const provider = userSettingsRecord[0]?.aiProvider || 'gemini'

    if (!messages || !sessionId) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Get user memories for context
    const memories = await getUserMemories()
    const memoryContext = buildMemoryContext(memories)

    const systemPrompt = `You are Nino, an AI learning companion designed to have meaningful conversations and learn about users. 
You should be thoughtful, engaging, and remember details about the user from previous conversations.
${memoryContext ? memoryContext : 'No previous facts learned yet, but you should work to learn more about the user!'}

Be conversational, ask follow-up questions, and look for opportunities to learn more about the user's interests, goals, and preferences.
When the user shares something personal or interesting, demonstrate that you're learning by referencing it in future conversations.`

    const model = getModel(provider)
    const result = streamText({
      model,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
      maxTokens: 1024,
    })

    // Stream the response
    let fullResponse = ''
    
    const stream = result.toAIStream({
      onFinal() {
        // Store the response after streaming completes
        const sentiment = analyzeSentiment(fullResponse)
        addMessage(sessionId, 'assistant', fullResponse, sentiment).catch(console.error)
        
        // Extract and store learnable facts
        extractMemories(messages[messages.length - 1]?.content || '', fullResponse)
          .then((newMemories) => {
            newMemories.forEach((mem) => {
              updateMemory(mem.key, mem.value, mem.importance).catch(console.error)
            })
          })
          .catch(console.error)
      },
    })

    // Buffer the response for storing
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const text = decoder.decode(value, { stream: true })
            fullResponse += text
            controller.enqueue(value)
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
