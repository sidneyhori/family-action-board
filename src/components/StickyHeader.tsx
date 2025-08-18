'use client'

import { TodoAssignee } from '@/types/todo'
import { Plus, Users, Mic } from 'lucide-react'

interface StickyHeaderProps {
  onNewTask: () => void
  onVoiceTask: () => void
  selectedFilter: TodoAssignee | 'all'
  onFilterChange: (filter: TodoAssignee | 'all') => void
}

const filterOptions = [
  { value: 'all' as const, label: 'All', icon: Users },
  { value: 'person1' as TodoAssignee, label: 'Sid', icon: null },
  { value: 'person2' as TodoAssignee, label: 'Pri', icon: null },
  { value: 'person3' as TodoAssignee, label: 'Gui', icon: null },
]

export default function StickyHeader({ 
  onNewTask,
  onVoiceTask,
  selectedFilter, 
  onFilterChange 
}: StickyHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-3 py-2 sm:px-6 sm:py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Filter buttons */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100 rounded-lg sm:rounded-xl p-1 sm:p-1.5">
            {filterOptions.map((option) => {
              const isSelected = selectedFilter === option.value
              const Icon = option.icon
              
              return (
                <button
                  key={option.value}
                  onClick={() => onFilterChange(option.value)}
                  className={`px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all ${
                    isSelected
                      ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                    {Icon && <Icon size={12} className="sm:w-[15px] sm:h-[15px]" />}
                    <span>{option.label}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onVoiceTask}
              className="flex items-center gap-1 sm:gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <Mic size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Voice</span>
            </button>
            
            <button
              onClick={onNewTask}
              className="flex items-center gap-1 sm:gap-2 bg-gray-900 hover:bg-gray-800 text-white px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}