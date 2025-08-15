'use client'

import { useState } from 'react'
import { Todo, TodoAssignee, TodoColor } from '@/types/todo'
import { X, Calendar, User, Palette } from 'lucide-react'

interface AddTodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

const colorOptions: { color: TodoColor; name: string; class: string }[] = [
  { color: 'yellow', name: 'Yellow', class: 'bg-yellow-400' },
  { color: 'blue', name: 'Blue', class: 'bg-blue-400' },
  { color: 'green', name: 'Green', class: 'bg-green-400' },
  { color: 'red', name: 'Red', class: 'bg-red-400' },
  { color: 'purple', name: 'Purple', class: 'bg-purple-400' },
  { color: 'orange', name: 'Orange', class: 'bg-orange-400' }
]

export default function AddTodoForm({ onSubmit, onCancel }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState<TodoAssignee>('person1')
  const [color, setColor] = useState<TodoColor>('yellow')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status: 'pending',
      assigned_to: assignedTo,
      color,
      due_date: dueDate || null
    })

    setTitle('')
    setDescription('')
    setAssignedTo('person1')
    setColor('yellow')
    setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Add New Task</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <X size={20} />
        </button>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1" style={{color: '#111827'}}>
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-600 text-gray-900"
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1" style={{color: '#111827'}}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-gray-600"
          placeholder="Additional details..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2" style={{color: '#111827'}}>
            <User size={16} className="inline mr-1" />
            Assign to
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="assignee"
                value="person1"
                checked={assignedTo === 'person1'}
                onChange={(e) => setAssignedTo(e.target.value as TodoAssignee)}
                className="mr-2"
              />
              <span className="text-sm text-gray-900" style={{color: '#111827'}}>Sid</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="assignee"
                value="person2"
                checked={assignedTo === 'person2'}
                onChange={(e) => setAssignedTo(e.target.value as TodoAssignee)}
                className="mr-2"
              />
              <span className="text-sm text-gray-900" style={{color: '#111827'}}>Pri</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="assignee"
                value="person3"
                checked={assignedTo === 'person3'}
                onChange={(e) => setAssignedTo(e.target.value as TodoAssignee)}
                className="mr-2"
              />
              <span className="text-sm text-gray-900" style={{color: '#111827'}}>Gui</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-900 mb-1" style={{color: '#111827'}}>
            <Calendar size={16} className="inline mr-1" />
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-600 text-gray-900"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2" style={{color: '#111827'}}>
          <Palette size={16} className="inline mr-1" />
          Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {colorOptions.map(option => (
            <button
              key={option.color}
              type="button"
              onClick={() => setColor(option.color)}
              className={`w-6 h-6 rounded-full ${option.class} ${
                color === option.color ? 'ring-2 ring-gray-400 ring-offset-1' : 'opacity-70 hover:opacity-100'
              } transition-all`}
              title={option.name}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Add Todo
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          style={{color: '#1f2937'}}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}