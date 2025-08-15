'use client'

import { useState } from 'react'
import { Todo, TodoColor, TodoStatus } from '@/types/todo'
import { Edit3, Trash2, Check, X } from 'lucide-react'
import { format, isAfter, isToday, isTomorrow } from 'date-fns'

interface TodoCardProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
}

const colorAccents: Record<TodoColor, string> = {
  yellow: 'border-l-yellow-400',
  blue: 'border-l-blue-400',
  green: 'border-l-green-400',
  red: 'border-l-red-400',
  purple: 'border-l-purple-400',
  orange: 'border-l-orange-400'
}

const colorDots: Record<TodoColor, string> = {
  yellow: 'bg-yellow-400',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  red: 'bg-red-400',
  purple: 'bg-purple-400',
  orange: 'bg-orange-400'
}

export default function TodoCard({ todo, onUpdate, onDelete }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
  const [editDate, setEditDate] = useState(todo.due_date ? todo.due_date.split('T')[0] : '')

  const handleColorChange = (newColor: TodoColor) => {
    onUpdate(todo.id, { color: newColor })
  }

  const handleAssigneeChange = () => {
    let newAssignee: 'person1' | 'person2' | 'person3'
    if (todo.assigned_to === 'person1') {
      newAssignee = 'person2'
    } else if (todo.assigned_to === 'person2') {
      newAssignee = 'person3'
    } else {
      newAssignee = 'person1'
    }
    onUpdate(todo.id, { assigned_to: newAssignee })
  }

  const handleStatusChange = () => {
    let newStatus: TodoStatus
    if (todo.status === 'pending') {
      newStatus = 'in_progress'
    } else if (todo.status === 'in_progress') {
      newStatus = 'completed'
    } else {
      newStatus = 'pending'
    }
    onUpdate(todo.id, { status: newStatus })
  }

  const getStatusInfo = () => {
    switch (todo.status) {
      case 'pending':
        return { text: 'ToDo', class: 'text-yellow-700 bg-yellow-100 border-yellow-200' }
      case 'in_progress':
        return { text: 'Prog', class: 'text-blue-700 bg-blue-100 border-blue-200' }
      case 'completed':
        return { text: 'Done', class: 'text-green-700 bg-green-100 border-green-200' }
      default:
        return { text: 'ToDo', class: 'text-yellow-700 bg-yellow-100 border-yellow-200' }
    }
  }

  const handleSaveEdit = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription || null
    })
    setIsEditing(false)
  }

  const handleSaveDate = () => {
    onUpdate(todo.id, {
      due_date: editDate ? `${editDate}T12:00:00.000Z` : null
    })
    setIsEditingDate(false)
  }

  const handleDateClick = () => {
    setEditDate(todo.due_date ? todo.due_date.split('T')[0] : '')
    setIsEditingDate(true)
  }

  const getDueDateInfo = () => {
    if (!todo.due_date) return null
    
    // Parse the date as local date to avoid timezone issues
    const dateStr = todo.due_date.split('T')[0] // Get just the date part
    const dueDate = new Date(dateStr + 'T12:00:00') // Force noon local time
    const now = new Date()
    
    // Set time to noon for comparison to avoid edge cases
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (dueDate.toDateString() === today.toDateString()) {
      return { text: 'Today', class: 'text-orange-600 bg-orange-50' }
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return { text: 'Tomorrow', class: 'text-amber-600 bg-amber-50' }
    } else if (dueDate < today) {
      return { text: 'Overdue', class: 'text-red-600 bg-red-50' }
    } else {
      return { text: format(dueDate, 'MMM dd'), class: 'text-gray-600 bg-gray-50' }
    }
  }

  const getDateTag = () => {
    if (!todo.due_date) return null
    // Parse the date as local date to avoid timezone issues
    const dateStr = todo.due_date.split('T')[0]
    const dueDate = new Date(dateStr + 'T12:00:00')
    return format(dueDate, 'M/d')
  }

  const dueDateInfo = getDueDateInfo()

  return (
    <div className={`bg-white border-l-4 ${colorAccents[todo.color]} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group`}>
      <div className="p-3">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-sm font-medium bg-transparent border-0 border-b border-gray-200 focus:border-gray-400 focus:outline-none pb-1 text-gray-900"
              autoFocus
            />
            {editDescription !== null && (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add description..."
                className="w-full text-xs text-gray-900 bg-transparent border-0 border-b border-gray-200 focus:border-gray-400 focus:outline-none pb-1 resize-none placeholder:text-gray-500"
                rows={2}
              />
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 bg-gray-900 text-white px-2 py-1 rounded text-xs hover:bg-gray-800"
              >
                <Check size={10} />
                Save
              </button>
              <button
                onClick={() => {
                  setEditTitle(todo.title)
                  setEditDescription(todo.description || '')
                  setIsEditing(false)
                }}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 px-2 py-1 text-xs"
              >
                <X size={10} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 
                className="font-medium text-gray-900 text-sm leading-tight flex-1 cursor-pointer hover:text-gray-700"
                onClick={() => setIsEditing(true)}
              >
                {todo.title}
              </h3>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="text-gray-500 hover:text-red-500 p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            
            {todo.description && (
              <p className="text-xs text-gray-700 leading-relaxed">{todo.description}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStatusChange}
                  className={`text-xs px-2 py-1 rounded-full transition-colors font-medium border ${getStatusInfo().class}`}
                >
                  {getStatusInfo().text}
                </button>
                
                <button
                  onClick={handleAssigneeChange}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-800 font-medium"
                >
                  {todo.assigned_to === 'person1' ? 'Sid' : todo.assigned_to === 'person2' ? 'Pri' : 'Gui'}
                </button>
                
                {isEditingDate ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="text-xs px-1 py-1 border border-gray-300 rounded text-gray-800"
                      onBlur={handleSaveDate}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveDate()
                        if (e.key === 'Escape') setIsEditingDate(false)
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    {getDateTag() && (
                      <button
                        onClick={handleDateClick}
                        className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full transition-colors font-medium"
                      >
                        {getDateTag()}
                      </button>
                    )}
                    
                    {dueDateInfo && (
                      <span className={`text-xs px-2 py-1 rounded-full ${dueDateInfo.class}`}>
                        {dueDateInfo.text}
                      </span>
                    )}
                  </>
                )}
                
                {!todo.due_date && !isEditingDate && (
                  <button
                    onClick={handleDateClick}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                  >
                    + Date
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  {(['yellow', 'blue', 'green', 'red', 'purple', 'orange'] as TodoColor[]).map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-3 h-3 rounded-full ${colorDots[color]} ${
                        todo.color === color ? 'ring-2 ring-gray-300 ring-offset-1' : 'opacity-40 hover:opacity-70'
                      } transition-all`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}