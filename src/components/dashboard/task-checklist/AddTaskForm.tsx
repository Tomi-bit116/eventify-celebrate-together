
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewTask } from './types';

interface AddTaskFormProps {
  onAddTask: (task: NewTask) => void;
  onCancel: () => void;
}

export const AddTaskForm = ({ onAddTask, onCancel }: AddTaskFormProps) => {
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: ''
  });

  const handleSubmit = () => {
    if (!newTask.title || !newTask.dueDate) return;
    onAddTask(newTask);
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4 space-y-4">
      <div>
        <Label htmlFor="taskTitle">Task Title *</Label>
        <Input
          id="taskTitle"
          placeholder="Enter task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="taskDescription">Description</Label>
        <Input
          id="taskDescription"
          placeholder="Task description (optional)"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="taskDueDate">Due Date *</Label>
          <Input
            id="taskDueDate"
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="taskPriority">Priority</Label>
          <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="taskCategory">Category</Label>
          <Input
            id="taskCategory"
            placeholder="e.g., Venue, Catering"
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          Add Task
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
