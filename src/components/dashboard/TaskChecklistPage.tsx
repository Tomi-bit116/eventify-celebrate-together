
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckSquare, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Task, NewTask } from './task-checklist/types';
import { ProgressOverview } from './task-checklist/ProgressOverview';
import { AddTaskForm } from './task-checklist/AddTaskForm';
import { TaskList } from './task-checklist/TaskList';

interface TaskChecklistPageProps {
  onBack: () => void;
}

export const TaskChecklistPage = ({ onBack }: TaskChecklistPageProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Book Venue',
      description: 'Research and book the perfect venue for the event',
      dueDate: '2024-07-15',
      priority: 'high',
      completed: false,
      category: 'Venue'
    },
    {
      id: '2',
      title: 'Send Invitations',
      description: 'Create and send invitations to all guests',
      dueDate: '2024-07-10',
      priority: 'high',
      completed: true,
      category: 'Invitations'
    },
    {
      id: '3',
      title: 'Order Decorations',
      description: 'Purchase decorations based on theme',
      dueDate: '2024-07-20',
      priority: 'medium',
      completed: false,
      category: 'Decorations'
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = (newTaskData: NewTask) => {
    if (!newTaskData.title || !newTaskData.dueDate) {
      toast.error("Please fill in title and due date");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTaskData.title,
      description: newTaskData.description,
      dueDate: newTaskData.dueDate,
      priority: newTaskData.priority,
      completed: false,
      category: newTaskData.category || 'General'
    };

    setTasks([...tasks, task]);
    setShowAddTask(false);
    toast.success("Task added successfully!");
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    toast.success("Task updated!");
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted!");
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <CheckSquare className="w-8 h-8 mr-3 text-blue-600" />
              Task Checklist
            </h1>
            <p className="text-gray-600 mt-2">Manage your event planning tasks and deadlines</p>
          </div>
        </div>

        {/* Progress Overview */}
        <ProgressOverview completedTasks={completedTasks} totalTasks={totalTasks} />

        {/* Add Task Section */}
        <Card className="mb-6 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tasks</span>
              <Button onClick={() => setShowAddTask(!showAddTask)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showAddTask && (
              <AddTaskForm
                onAddTask={handleAddTask}
                onCancel={() => setShowAddTask(false)}
              />
            )}

            {/* Tasks List */}
            <TaskList
              tasks={tasks}
              onToggleCompletion={toggleTaskCompletion}
              onDelete={deleteTask}
            />
          </CardContent>
        </Card>

        {/* Connection to Timeline */}
        <Card className="shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Connected to Timeline</h3>
                <p className="text-sm text-gray-600">Your tasks are synchronized with your event timeline for better planning</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => window.location.hash = '#timeline'}
                className="ml-auto"
              >
                View Timeline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
