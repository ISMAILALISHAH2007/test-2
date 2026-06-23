export class TextToSpeech {
  private synth: SpeechSynthesis
  private isSpeaking = false

  constructor() {
    this.synth = window.speechSynthesis
  }

  speak(text: string, options?: { rate?: number; pitch?: number; lang?: string }) {
    if (!this.synth) return

    // Cancel any ongoing speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options?.rate || 1
    utterance.pitch = options?.pitch || 1
    utterance.lang = options?.lang || 'en-US'

    utterance.onstart = () => {
      this.isSpeaking = true
    }

    utterance.onend = () => {
      this.isSpeaking = false
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      this.isSpeaking = false
    }

    this.synth.speak(utterance)
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
      this.isSpeaking = false
    }
  }

  getIsSpeaking() {
    return this.isSpeaking
  }
}

let ttsInstance: TextToSpeech | null = null

export function getTTS() {
  if (!ttsInstance && typeof window !== 'undefined') {
    ttsInstance = new TextToSpeech()
  }
  return ttsInstance
}
