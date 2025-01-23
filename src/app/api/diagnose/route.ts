import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from 'next/server'

// Add debug logging
console.log('API Key present:', !!process.env.GOOGLE_API_KEY)

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
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
  console.log('Received request to /api/diagnose')
  
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.error('API key is missing')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const { message, history } = await req.json()
    console.log('Received message:', message)
    console.log('History length:', history.length)

    try {
      // Prepare the conversation history
      let conversationHistory = ''
      if (history.length > 0) {
        history.forEach((msg: any) => {
          conversationHistory += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`
        })
      }

      // Combine everything into a single user message
      const userMessage = `
Context: ${INITIAL_PROMPT}

Previous conversation:
${conversationHistory}
Current user message: ${message}

Please respond as a medical assistant, following the guidelines provided in the context.`

      console.log('Sending message to Gemini')
      const result = await model.generateContent(userMessage)
      const response = await result.response.text()

      if (!response) {
        throw new Error('Empty response from AI model')
      }

      console.log('Sending response back to client')
      return NextResponse.json({ response })
    } catch (modelError: any) {
      console.error('Gemini API Error:', modelError)
      throw new Error(`Gemini API Error: ${modelError.message}`)
    }
  } catch (error: any) {
    console.error('Diagnosis API Error:', error)
    
    const errorResponse = {
      error: 'Failed to process request',
      details: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
} 