
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckSquare, Plus, Trash2, Clock, AlertCircle, CheckCircle2, Calendar, Link } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  connectedToTimeline: boolean;
}

interface TaskChecklistPageProps {
  onBack: () => void;
  onViewTimeline?: () => void;
}

export const TaskChecklistPage = ({ onBack, onViewTimeline }: TaskChecklistPageProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Book venue',
      description: 'Research and book the perfect venue for the event',
      dueDate: '2024-02-15',
      priority: 'high',
      completed: false,
      connectedToTimeline: true
    },
    {
      id: '2',
      title: 'Send invitations',
      description: 'Create and send invitations to all guests',
      dueDate: '2024-02-20',
      priority: 'high',
      completed: true,
      connectedToTimeline: true
    },
    {
      id: '3',
      title: 'Order decorations',
      description: 'Purchase all necessary decorations and supplies',
      dueDate: '2024-02-25',
      priority: 'medium',
      completed: false,
      connectedToTimeline: false
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false,
      connectedToTimeline: false
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
    setShowAddTask(false);
    toast.success("Task added successfully!");
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    const task = tasks.find(t => t.id === taskId);
    toast.success(`Task "${task?.title}" ${task?.completed ? 'marked as incomplete' : 'completed'}!`);
  };

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
    toast.success(`Task "${task?.title}" deleted`);
  };

  const connectToTimeline = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, connectedToTimeline: !task.connectedToTimeline } : task
    ));
    const task = tasks.find(t => t.id === taskId);
    toast.success(`Task ${task?.connectedToTimeline ? 'disconnected from' : 'connected to'} timeline`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
          <div className="flex items-center">
            <Button onClick={onBack} variant="ghost" className="mr-2 md:mr-4 p-2">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center">
                <CheckSquare className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-blue-600" />
                Task Checklist
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">Manage your event planning tasks</p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {onViewTimeline && (
              <Button 
                onClick={onViewTimeline}
                variant="outline"
                className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Timeline
              </Button>
            )}
            <Button 
              onClick={() => setShowAddTask(true)}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-4 md:mb-6 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Tasks Completed</span>
              <span className="font-semibold">{completedTasks} of {totalTasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{Math.round(progressPercentage)}% Complete</p>
          </CardContent>
        </Card>

        {/* Add Task Form */}
        {showAddTask && (
          <Card className="mb-4 md:mb-6 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="taskTitle" className="text-sm">Task Title *</Label>
                <Input
                  id="taskTitle"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="taskDescription" className="text-sm">Description</Label>
                <Input
                  id="taskDescription"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taskDueDate" className="text-sm">Due Date</Label>
                  <Input
                    id="taskDueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="taskPriority" className="text-sm">Priority</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setNewTask({...newTask, priority: value})
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTask} className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm">
                  Add Task
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddTask(false)}
                  className="text-sm"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${
                    task.completed 
                      ? 'bg-green-50 border-green-200 opacity-75' 
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm md:text-base ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-xs md:text-sm mt-1 ${
                            task.completed ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
                            <span className="ml-1 capitalize">{task.priority}</span>
                          </span>
                          {task.dueDate && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {task.connectedToTimeline && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">
                              <Link className="w-3 h-3 mr-1" />
                              Timeline
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end lg:justify-start">
                      <Button
                        size="sm"
                        variant={task.connectedToTimeline ? "default" : "outline"}
                        onClick={() => connectToTimeline(task.id)}
                        className="p-2"
                        title={task.connectedToTimeline ? "Disconnect from timeline" : "Connect to timeline"}
                      >
                        <Link className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTask(task.id)}
                        className="p-2"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
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
