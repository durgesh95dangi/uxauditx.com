// src/lib/ai-provider.ts

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIProvider = 'openai' | 'gemini' | 'grok' | 'anthropic'

const provider = (process.env.AI_PROVIDER || 'openai') as AIProvider

// ─────────────────────────────────────────────────────────
// Universal function — call this from claude.ts (runParam)
// Returns plain text that must be valid JSON
// ─────────────────────────────────────────────────────────
export async function analyzeWithAI({
  systemPrompt,
  userText,
  imageBase64,        // optional: desktop screenshot
  imageBase64Mobile,  // optional: mobile screenshot
  maxTokens = 600,
}: {
  systemPrompt: string
  userText: string
  imageBase64?: string
  imageBase64Mobile?: string
  maxTokens?: number
}): Promise<string> {
  switch (provider) {
    case 'openai':
      return runOpenAI({ systemPrompt, userText, imageBase64, imageBase64Mobile, maxTokens })
    case 'grok':
      return runGrok({ systemPrompt, userText, imageBase64, imageBase64Mobile, maxTokens })
    case 'gemini':
      return runGemini({ systemPrompt, userText, imageBase64, imageBase64Mobile, maxTokens })
    case 'anthropic':
      return runAnthropic({ systemPrompt, userText, imageBase64, imageBase64Mobile, maxTokens })
    default:
      throw new Error(`Unknown AI_PROVIDER: ${provider}. Use openai | gemini | grok | anthropic`)
  }
}

// ─────────────────────────────────────────────────────────
// OpenAI — GPT-4o (supports vision)
// ─────────────────────────────────────────────────────────
async function runOpenAI(args: {
  systemPrompt: string
  userText: string
  imageBase64?: string
  imageBase64Mobile?: string
  maxTokens: number
}): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = []

  if (args.imageBase64) {
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${args.imageBase64}`, detail: 'high' },
    })
  }
  if (args.imageBase64Mobile) {
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${args.imageBase64Mobile}`, detail: 'low' },
    })
  }
  userContent.push({ type: 'text', text: args.userText })

  const res = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    max_tokens: args.maxTokens,
    messages: [
      { role: 'system', content: args.systemPrompt },
      { role: 'user', content: userContent },
    ],
    response_format: { type: 'json_object' },
  })

  return res.choices[0]?.message?.content || '{}'
}

// ─────────────────────────────────────────────────────────
// Grok by xAI — grok-2-vision (uses OpenAI-compatible SDK)
// ─────────────────────────────────────────────────────────
async function runGrok(args: {
  systemPrompt: string
  userText: string
  imageBase64?: string
  imageBase64Mobile?: string
  maxTokens: number
}): Promise<string> {
  // Grok uses OpenAI SDK with a different baseURL
  const client = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  })

  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = []

  if (args.imageBase64) {
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${args.imageBase64}` },
    })
  }
  if (args.imageBase64Mobile) {
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${args.imageBase64Mobile}` },
    })
  }
  userContent.push({ type: 'text', text: args.userText })

  const res = await client.chat.completions.create({
    model: process.env.GROK_MODEL || 'grok-2-vision-1212',
    max_tokens: args.maxTokens,
    messages: [
      { role: 'system', content: args.systemPrompt },
      { role: 'user', content: userContent },
    ],
  })

  return res.choices[0]?.message?.content || '{}'
}

// ─────────────────────────────────────────────────────────
// Google Gemini — gemini-2.0-flash (supports vision)
// ─────────────────────────────────────────────────────────
async function runGemini(args: {
  systemPrompt: string
  userText: string
  imageBase64?: string
  imageBase64Mobile?: string
  maxTokens: number
}): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    systemInstruction: args.systemPrompt,
    generationConfig: {
      maxOutputTokens: args.maxTokens,
      responseMimeType: 'application/json',
    },
  })

  const parts: any[] = []

  if (args.imageBase64) {
    parts.push({ inlineData: { data: args.imageBase64, mimeType: 'image/jpeg' } })
  }
  if (args.imageBase64Mobile) {
    parts.push({ inlineData: { data: args.imageBase64Mobile, mimeType: 'image/jpeg' } })
  }
  parts.push({ text: args.userText })

  const res = await model.generateContent({ contents: [{ role: 'user', parts }] })
  return res.response.text() || '{}'
}

// ─────────────────────────────────────────────────────────
// Anthropic Claude — claude-sonnet (supports vision)
// ─────────────────────────────────────────────────────────
async function runAnthropic(args: {
  systemPrompt: string
  userText: string
  imageBase64?: string
  imageBase64Mobile?: string
  maxTokens: number
}): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const content: Anthropic.MessageParam['content'] = []

  if (args.imageBase64) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: args.imageBase64 },
    })
  }
  if (args.imageBase64Mobile) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: args.imageBase64Mobile },
    })
  }
  content.push({ type: 'text', text: args.userText })

  const res = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: args.maxTokens,
    system: args.systemPrompt,
    messages: [{ role: 'user', content }],
  })

  const block = res.content[0]
  return block.type === 'text' ? block.text : '{}'
}

// Export which provider + model is active (for saving to DB)
export function getProviderInfo() {
  const map: Record<string, string> = {
    openai:    process.env.OPENAI_MODEL    || 'gpt-4o',
    grok:      process.env.GROK_MODEL      || 'grok-2-vision-1212',
    gemini:    process.env.GEMINI_MODEL    || 'gemini-2.0-flash-exp',
    anthropic: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
  }
  return { provider, model: map[provider] }
}
