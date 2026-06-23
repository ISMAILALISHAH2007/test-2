import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'

export type AIProvider = 'gemini' | 'openai' | 'groq' | 'github'

export function getModel(provider: AIProvider = 'gemini') {
  // Use Vercel AI Gateway which supports multiple providers
  switch (provider) {
    case 'openai':
      if (process.env.OPENAI_API_KEY) {
        return openai('gpt-4-mini')
      }
      // Fall through to gemini
    case 'groq':
      // Groq is available through AI Gateway
      return google('gemini-1.5-flash')
    case 'github':
      // GitHub Models available through AI Gateway
      return google('gemini-1.5-flash')
    case 'gemini':
    default:
      return google('gemini-1.5-flash')
  }
}

export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  // Simple heuristic sentiment analysis
  const positive = /happy|great|wonderful|awesome|love|excellent|amazing/i
  const negative = /sad|bad|terrible|awful|hate|horrible|angry/i

  if (negative.test(text)) return 'negative'
  if (positive.test(text)) return 'positive'
  return 'neutral'
}
