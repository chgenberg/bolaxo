import { createTimeoutSignal } from '@/lib/scrapers/abort-helper'

type OpenAIMessage =
  | {
      role: 'system' | 'user' | 'assistant'
      content: string
    }
  | {
      role: 'system' | 'user' | 'assistant'
      content: Array<{ type: 'text'; text: string }>
    }

type TextFormatOption = {
  type: string
  [key: string]: any
}

interface CallResponsesArgs {
  model: string
  messages: OpenAIMessage[]
  maxOutputTokens?: number
  metadata?: Record<string, any>
  timeoutMs?: number
  responseFormat?: TextFormatOption
}

export class OpenAIResponseError extends Error {
  status: number
  body: string

  constructor(message: string, status: number, body: string) {
    super(message)
    this.status = status
    this.body = body
  }
}

export async function callOpenAIResponses({
  model,
  messages,
  maxOutputTokens = 4000,
  metadata,
  timeoutMs = 120000,
  responseFormat
}: CallResponsesArgs): Promise<{ text: string; raw: any }> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  const input = messages.map((message) => ({
    role: message.role,
    content: Array.isArray(message.content)
      ? message.content
      : [{ type: 'text', text: message.content }]
  }))

  const formatPayload =
    responseFormat && typeof responseFormat === 'object'
      ? { text: { format: responseFormat } }
      : {}

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      input,
      modalities: ['text'],
      max_output_tokens: maxOutputTokens,
      metadata,
      ...formatPayload
    }),
    signal: createTimeoutSignal(timeoutMs)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new OpenAIResponseError('OpenAI Responses API call failed', response.status, errorText)
  }

  const raw = await response.json()
  const text = extractResponseText(raw)

  return { text, raw }
}

export function extractResponseText(aiResponse: any): string {
  if (!aiResponse) return ''

  if (Array.isArray(aiResponse.output_text) && aiResponse.output_text.length > 0) {
    return aiResponse.output_text.join('\n').trim()
  }

  if (Array.isArray(aiResponse.output)) {
    for (const item of aiResponse.output) {
      if (item?.content) {
        const textChunk = item.content
          .filter((c: any) => c?.type === 'text' && c.text)
          .map((c: any) => (typeof c.text === 'string' ? c.text : c.text?.value))
          .filter(Boolean)
          .join('\n')
        if (textChunk) return textChunk.trim()
      }
    }
  }

  return aiResponse?.choices?.[0]?.message?.content ?? ''
}


