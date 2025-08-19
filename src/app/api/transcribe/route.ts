import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Convert File to Buffer for OpenAI API
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a File-like object that OpenAI expects
    const file = new File([buffer], 'audio.webm', { type: 'audio/webm' })

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en', // Specify English for better accuracy
      prompt: 'This is a task description that might include names like Sid, Pri, or Gui, and words like update, address, remind, book, appointment.' // Context helps accuracy
    })

    return NextResponse.json({ text: transcription.text })
  } catch (error) {
    console.error('Error transcribing audio:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
      }
      return NextResponse.json({ error: `Transcription error: ${error.message}` }, { status: 500 })
    }
    
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 })
  }
}