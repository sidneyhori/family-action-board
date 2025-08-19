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

IMPORTANT: The input may contain speech recognition errors. Use context clues and common sense to interpret what the user likely meant.

Common speech recognition mistakes to watch for:
- "pets" → "update" or "set" 
- "book" → "look" or "book"
- "addresses" → "addresses" or "at dresses"
- Short phrases may be misheard more often

Names to recognize (including common mishearings):
- Sid/Sit/Said = person1
- Pri/Pre/Pree = person2 
- Gui/Guy/G = person3

Colors available: yellow, blue, green, red, purple, orange
Priority keywords: urgent, important, high priority → red color

Extract and return ONLY a JSON object with these fields:
{
  "title": "extracted task title (interpret speech errors)",
  "description": "extracted description or null",
  "assigned_to": "person1|person2|person3",
  "color": "yellow|blue|green|red|purple|orange",
  "due_date": "YYYY-MM-DD or null"
}

Rules:
- Use context to correct obvious speech recognition errors
- If unclear, ask yourself "what task would make sense here?"
- If no assignee mentioned, default to "person1" (Sid)
- If no color mentioned, default to "yellow"
- Parse relative dates like "tomorrow", "next week", "Friday" into YYYY-MM-DD format
- Keep title concise but clear (under 50 chars)
- Extract any additional context as description

Examples:
"pets" (likely meant "update addresses") → {"title": "Update addresses", "description": null, "assigned_to": "person1", "color": "yellow", "due_date": null}
"Remind Sit to take out trash tomorrow" → {"title": "Take out trash", "description": null, "assigned_to": "person1", "color": "yellow", "due_date": "2025-08-19"}
"Pre needs to book dentist red priority by Friday" → {"title": "Book dentist appointment", "description": null, "assigned_to": "person2", "color": "red", "due_date": "2025-08-22"}

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