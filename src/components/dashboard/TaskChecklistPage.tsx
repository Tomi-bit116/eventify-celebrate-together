import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CheckSquare, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TaskChecklistPageProps {
  onBack: () => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export const TaskChecklistPage = ({ onBack }: TaskChecklistPageProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Book venue', description: 'Reserve the event venue', completed: true, dueDate: '2024-07-01', priority: 'high', category: 'Venue' },
    { id: '2', title: 'Send invitations', description: 'Send out invitations to all guests', completed: false, dueDate: '2024-07-05', priority: 'high', category: 'Guests' },
    { id: '3', title: 'Order decorations', description: 'Purchase and arrange decorations', completed: false, dueDate: '2024-07-10', priority: 'medium', category: 'Decorations' },
    { id: '4', title: 'Hire photographer', description: 'Book professional photographer', completed: false, dueDate: '2024-07-08', priority: 'medium', category: 'Photography' },
    { id: '5', title: 'Plan menu', description: 'Finalize food and drink menu', completed: false, dueDate: '2024-07-12', priority: 'high', category: 'Catering' },
  ]);

  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>({ title: '', description: '', dueDate: '', priority: 'medium', category: '' });
  
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(tasks.map(task => task.category)))];
  const filteredTasks = filterCategory === 'all' ? tasks : tasks.filter(task => task.category === filterCategory);

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate || !newTask.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', category: '' });
    toast.success("Task added successfully!");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.dueDate === dueDate)?.completed;
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-green-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Task Checklist
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Task */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Plus className="w-5 h-5 mr-2" />
                Add New Task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Task title *"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
              <Input
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
              <Input
                placeholder="Category *"
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'high' | 'medium' | 'low'})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <Button onClick={handleAddTask} className="w-full bg-green-600 hover:bg-green-700">
                Add Task
              </Button>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(completionPercentage)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed Tasks</span>
                  <span className="font-medium text-green-600">{completedTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining Tasks</span>
                  <span className="font-medium text-yellow-600">{totalTasks - completedTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Overdue Tasks</span>
                  <span className="font-medium text-red-600">
                    {tasks.filter(task => isOverdue(task.dueDate) && !task.completed).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Filter by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <Card className="mt-8 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`p-4 border rounded-lg ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                      />
                      <div className={task.completed ? 'opacity-60' : ''}>
                        <h3 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {task.dueDate}
                          </div>
                          <span className="text-xs text-gray-500">{task.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isOverdue(task.dueDate) && !task.completed && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
