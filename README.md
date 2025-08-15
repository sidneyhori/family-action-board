# Family Action Board

A sleek, responsive todo sharing application for couples to manage tasks together. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 📋 **Post-it Style Todo Board** - Visual kanban-style layout with To Do, In Progress, and Completed columns
- 👥 **Assignment System** - Assign tasks to yourself or your partner
- 🎨 **Color Coding** - 6 color options (yellow, blue, green, red, purple, orange) for categorization
- 📅 **Due Dates** - Set due dates with visual indicators for today, tomorrow, and overdue items
- ✅ **Status Tracking** - Three status levels: pending, in progress, completed
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Updates** - Changes sync instantly between devices

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Icons**: Lucide React
- **Deployment**: Vercel

## Quick Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd family-action-board
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > API to get your project URL and anon key
3. In the SQL Editor, run the schema from `database/schema.sql`

### 3. Environment Variables

Copy `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your Family Action Board!

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Usage

- **Add Todo**: Click "Add New Todo" button
- **Edit Todo**: Click the edit icon on any todo card
- **Change Status**: Click the status buttons (pending, in progress, completed)
- **Assign**: Click the user icon to toggle between "You" and "Partner"
- **Change Color**: Click any of the 6 color dots to categorize your todos
- **Delete**: Click the trash icon to remove a todo

## Database Schema

The app uses a single `todos` table with the following structure:

- `id`: UUID primary key
- `title`: Task title (required)
- `description`: Optional task description
- `status`: pending | in_progress | completed
- `assigned_to`: person1 | person2
- `color`: yellow | blue | green | red | purple | orange
- `due_date`: Optional timestamp
- `created_at`: Auto-generated timestamp
- `updated_at`: Auto-updated timestamp

## Contributing

Feel free to fork and customize for your own use! This is a simple project designed for couples to share tasks without the complexity of user authentication.
