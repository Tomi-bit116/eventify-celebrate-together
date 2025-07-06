
import { CheckSquare } from 'lucide-react';
import { Task } from './types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleCompletion: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskList = ({ tasks, onToggleCompletion, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No tasks yet. Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
