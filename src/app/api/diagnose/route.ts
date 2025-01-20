import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024,
  },
})

const INITIAL_PROMPT = `You are a medical diagnostic assistant. Your role is to ask relevant questions about the user's symptoms and provide potential diagnoses based on their responses. Follow these guidelines:

1. Ask one question at a time
2. Use simple, clear language
3. Focus on gathering key symptoms and their duration
4. After gathering sufficient information, provide:
   - Possible conditions (with likelihood levels)
   - Recommended next steps
   - Whether immediate medical attention is needed
5. Always include appropriate medical disclaimers
6. Never provide definitive diagnoses
7. Encourage seeking professional medical advice

Remember to be empathetic and professional.`

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY is not defined')
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    )
  }

  try {
    const { message, history } = await req.json()

    // Combine history and current message into a single prompt
    const conversationHistory = history
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n')

    const fullPrompt = `${INITIAL_PROMPT}\n\nConversation history:\n${conversationHistory}\n\nUser: ${message}\nAssistant:`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response.text()

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error('Diagnosis API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error.message 
      },
      { status: 500 }
    )
  }
} 