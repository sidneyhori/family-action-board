import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a task parsing assistant. Parse the user's voice input into structured task data.

Names to recognize:
- Sid = person1
- Pri = person2 
- Gui = person3

Colors available: yellow, blue, green, red, purple, orange

Extract and return ONLY a JSON object with these fields:
{
  "title": "extracted task title",
  "description": "extracted description or null",
  "assigned_to": "person1|person2|person3",
  "color": "yellow|blue|green|red|purple|orange",
  "due_date": "YYYY-MM-DD or null"
}

Rules:
- If no assignee mentioned, default to "person1" (Sid)
- If no color mentioned, default to "yellow"
- Parse relative dates like "tomorrow", "next week", "Friday" into YYYY-MM-DD format
- Keep title concise (under 50 chars)
- Extract any additional context as description

Examples:
"Remind Sid to take out trash tomorrow" → {"title": "Take out trash", "description": null, "assigned_to": "person1", "color": "yellow", "due_date": "2025-08-19"}
"Pri needs to book dentist red priority by Friday" → {"title": "Book dentist appointment", "description": null, "assigned_to": "person2", "color": "red", "due_date": "2025-08-22"}

Current date: ${new Date().toISOString().split('T')[0]} (use this as reference for relative dates)`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.1,
      max_tokens: 200
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse the JSON response
    const parsedTask = JSON.parse(result)
    
    return NextResponse.json(parsedTask)
  } catch (error) {
    console.error('Error parsing voice input:', error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
      }
      if (error.message.includes('JSON')) {
        return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 })
      }
      return NextResponse.json({ error: `Parse error: ${error.message}` }, { status: 500 })
    }
    
    return NextResponse.json({ error: 'Failed to parse voice input' }, { status: 500 })
  }
}