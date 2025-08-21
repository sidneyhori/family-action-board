# Family Action Board

A family todo sharing web application built with Next.js, TypeScript, Tailwind CSS, Supabase, and OpenAI.

## Overview

This is a sleek post-it board style todo app for families to share tasks. Features include assignment system, color coding, due dates, status tracking, and AI-powered voice input.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Currently open (no auth)
- **AI**: OpenAI GPT-4o-mini + Whisper
- **Deployment**: Vercel + GitHub integration

## Family Members

The app is configured for 3 people:
- **person1**: Sid
- **person2**: Pri  
- **person3**: Gui

## Features

### Core Todo Management
- **Post-it style cards** with color coding (yellow, blue, green, red, purple, orange)
- **Three-column layout**: To Do, In Progress, Done
- **Assignment system** for family members
- **Due dates** with smart display (Today, Tomorrow, Overdue, M/d format)
- **Clickable status tags** to move tasks between columns
- **Inline editing** for titles, descriptions, and dates

### Voice-to-Task Feature
- **OpenAI Whisper transcription** for high accuracy speech recognition
- **GPT-4o-mini parsing** to convert natural language to structured tasks
- **Review & edit** transcripts before processing
- **Smart date parsing** (relative dates like "tomorrow", "Friday")
- **Context-aware** name recognition and task understanding

### UI/UX
- **Sticky header** with filter buttons (All, Sid, Pri, Gui) and action buttons
- **Mobile responsive** design
- **Smooth animations** and transitions
- **Error handling** with helpful messages
- **Loading states** for all async operations

## Database Schema

```sql
-- Supabase todos table
create table todos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  assigned_to text check (assigned_to in ('person1', 'person2', 'person3')) not null,
  color text check (color in ('yellow', 'blue', 'green', 'red', 'purple', 'orange')) default 'yellow',
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration (for voice features)
OPENAI_API_KEY=your-openai-api-key
```

## API Routes

### `/api/parse-voice` (POST)
- Parses natural language text into structured task data
- Uses GPT-4o-mini with specialized prompt
- Handles speech recognition errors and name variations
- Input: `{ text: string }`
- Output: `{ title, description, assigned_to, color, due_date }`

### `/api/transcribe` (POST)
- Transcribes audio files using OpenAI Whisper
- Accepts audio/webm format from MediaRecorder
- Context-aware prompting for better accuracy
- Input: FormData with audio file
- Output: `{ text: string }`

## Component Architecture

```
src/
├── app/
│   ├── page.tsx                 # Main landing page
│   └── api/
│       ├── parse-voice/route.ts # GPT task parsing
│       └── transcribe/route.ts  # Whisper transcription
├── components/
│   ├── TodoBoard.tsx           # Main container & state
│   ├── TodoCard.tsx            # Individual task cards
│   ├── AddTodoForm.tsx         # New task form
│   ├── StickyHeader.tsx        # Filter & actions
│   └── VoiceTaskModal.tsx      # Voice input interface
├── hooks/
│   └── useAudioRecording.ts    # Audio recording logic
├── lib/
│   └── supabase.ts            # Database client
└── types/
    └── todo.ts                # TypeScript types
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run type checking
npm run typecheck
```

## Key Implementation Notes

### Date Handling
- All dates stored as UTC timestamps
- Local parsing at noon to avoid timezone issues
- Smart display logic for Today/Tomorrow/Overdue

### Voice Recognition
- **Not using Web Speech API** (poor accuracy)
- **Using OpenAI Whisper** for professional transcription
- MediaRecorder API for browser audio capture
- Cost: ~$0.006/minute but much more accurate

### Error Handling
- Comprehensive error states for network, API, and permission issues
- Graceful fallbacks for unsupported browsers
- Clear user feedback for all failure scenarios

### Mobile Optimization
- Responsive design with mobile-first approach
- Touch-friendly interface elements
- Optimized header for small screens
- Always-visible edit/delete buttons on mobile

## Deployment

The app auto-deploys to Vercel via GitHub integration:
1. Push to main branch
2. Vercel builds and deploys
3. Environment variables configured in Vercel dashboard
4. Database hosted on Supabase cloud

## Performance

- Static generation where possible
- Optimized bundle size with Next.js tree shaking
- Efficient database queries with Supabase
- Minimal re-renders with proper React patterns

## Future Enhancements

- User authentication and multi-family support
- Real-time updates with Supabase subscriptions
- Push notifications for due dates
- File attachments for tasks
- Advanced filtering and search
- Task templates and recurring tasks