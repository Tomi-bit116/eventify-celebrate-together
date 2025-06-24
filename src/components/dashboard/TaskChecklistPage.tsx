
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckSquare, Plus, Calendar, Clock, AlertCircle, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface TaskChecklistPageProps {
  onBack: () => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'mid-deadline' | 'deadline-reached' | 'completed';
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

export const TaskChecklistPage = ({ onBack }: TaskChecklistPageProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Book venue',
      description: 'Research and book the perfect venue for the event',
      status: 'completed',
      deadline: '2024-01-15',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Send invitations',
      description: 'Create and send invitations to all guests',
      status: 'mid-deadline',
      deadline: '2024-01-20',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Order decorations',
      description: 'Choose and order decorations that match the theme',
      status: 'deadline-reached',
      deadline: '2024-01-18',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Confirm catering',
      description: 'Finalize menu and confirm catering arrangements',
      status: 'pending',
      deadline: '2024-01-25',
      priority: 'high'
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'mid-deadline': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deadline-reached': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <Check className="w-4 h-4" />;
      case 'mid-deadline': return <Clock className="w-4 h-4" />;
      case 'deadline-reached': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const calculateProgress = () => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.deadline) {
      toast.error('Please fill in title and deadline');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'pending',
      deadline: newTask.deadline,
      priority: newTask.priority
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', deadline: '', priority: 'medium' });
    setShowAddTask(false);
    toast.success('Task added successfully!');
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast.success('Task status updated!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-lime-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              Task Checklist
            </h1>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl text-gray-800">Progress Overview</span>
              <span className="text-2xl font-bold text-green-600">{calculateProgress()}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={calculateProgress()} className="h-3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => t.status === 'mid-deadline').length}
                </div>
                <div className="text-sm text-yellow-700">Mid-Deadline</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {tasks.filter(t => t.status === 'deadline-reached').length}
                </div>
                <div className="text-sm text-red-700">Deadline Reached</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {tasks.filter(t => t.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-700">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Task Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowAddTask(!showAddTask)}
            className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Task
          </Button>
        </div>

        {/* Add Task Form */}
        {showAddTask && (
          <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Task Title</label>
                  <Input
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="border-lime-200 focus:border-green-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Deadline</label>
                  <Input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="border-lime-200 focus:border-green-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="border-lime-200 focus:border-green-400"
                />
              </div>
              <div className="flex space-x-4">
                <Button 
                  onClick={handleAddTask}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Add Task
                </Button>
                <Button 
                  onClick={() => setShowAddTask(false)}
                  variant="outline"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="mid-deadline">Mid-Deadline</option>
                      <option value="deadline-reached">Deadline Reached</option>
                      <option value="completed">Completed</option>
                    </select>
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
