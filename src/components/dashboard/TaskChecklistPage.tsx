
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckSquare, Plus, Trash2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TaskChecklistPageProps {
  onBack: () => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: string;
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

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: ''
  });

  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error("Please fill in title and due date");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false,
      category: newTask.category || 'General'
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: ''
    });
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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
        <Card className="mb-6 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Progress Overview</span>
              <span className="text-sm text-gray-600">{completedTasks}/{totalTasks} tasks completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">{Math.round(completionPercentage)}%</span>
              <span className="text-gray-600 ml-2">Complete</span>
            </div>
          </CardContent>
        </Card>

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
                  <Button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700">
                    Add Task
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddTask(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  task.completed 
                    ? 'bg-green-50 border-green-200 opacity-75' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1 w-5 h-5 text-blue-600"
                      />
                      <div className="flex-1">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {task.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Add your first task to get started!</p>
              </div>
            )}
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
