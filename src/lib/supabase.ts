import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase')) {
  console.warn('Supabase credentials not configured. Using mock client.')
}

export const supabase = createClient(
  supabaseUrl || 'https://mock.supabase.co', 
  supabaseAnonKey || 'mock-key'
)

export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed'
          assigned_to: 'person1' | 'person2' | 'person3'
          color: 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'orange'
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          assigned_to: 'person1' | 'person2' | 'person3'
          color?: 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'orange'
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          assigned_to?: 'person1' | 'person2'
          color?: 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'orange'
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}