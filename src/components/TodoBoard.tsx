'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Todo, TodoStatus } from '@/types/todo'
import TodoCard from './TodoCard'
import AddTodoForm from './AddTodoForm'
import { Plus } from 'lucide-react'

export default function TodoBoard() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching todos:', error)
        return
      }

      setTodos(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert(todo)
        .select()
        .single()

      if (error) {
        console.error('Error adding todo:', error)
        return
      }

      setTodos(prev => [data, ...prev])
      setShowAddForm(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating todo:', error)
        return
      }

      setTodos(prev => prev.map(todo => todo.id === id ? data : todo))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting todo:', error)
        return
      }

      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    )
  }

  const statusColumns = [
    { status: 'pending' as TodoStatus, title: 'To Do', icon: '📝' },
    { status: 'in_progress' as TodoStatus, title: 'In Progress', icon: '⚡' },
    { status: 'completed' as TodoStatus, title: 'Done', icon: '✅' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <AddTodoForm
              onSubmit={addTodo}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {statusColumns.map(column => (
          <div key={column.status} className="bg-gray-50 rounded-lg min-h-96">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{column.icon}</span>
                <h2 className="font-semibold text-gray-900">{column.title}</h2>
              </div>
              <p className="text-sm text-gray-600">
                {todos.filter(todo => todo.status === column.status).length} tasks
              </p>
            </div>
            <div className="p-3 space-y-3">
              {todos
                .filter(todo => todo.status === column.status)
                .map(todo => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              {todos.filter(todo => todo.status === column.status).length === 0 && (
                <div className="text-center py-8 text-gray-600 text-sm">
                  No tasks yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}