export type TodoStatus = 'pending' | 'in_progress' | 'completed'
export type TodoAssignee = 'person1' | 'person2' | 'person3'
export type TodoColor = 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'orange'

export interface Todo {
  id: string
  title: string
  description: string | null
  status: TodoStatus
  assigned_to: TodoAssignee
  color: TodoColor
  due_date: string | null
  created_at: string
  updated_at: string
}