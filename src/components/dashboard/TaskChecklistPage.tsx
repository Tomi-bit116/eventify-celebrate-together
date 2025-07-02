
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckSquare, Plus, Calendar, Clock, AlertCircle, Check, Circle } from 'lucide-react';
import { toast } from 'sonner';

interface TaskChecklistPageProps {
  onBack: () => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  category: string;
}

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'task' | 'milestone' | 'deadline';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const TaskChecklistPage = ({ onBack }: TaskChecklistPageProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Send out invitations',
      description: 'Create and send digital invitations to all guests',
      priority: 'high',
      dueDate: '2024-02-01',
      completed: true,
      category: 'Invitations'
    },
    {
      id: '2',
      title: 'Book venue',
      description: 'Confirm booking for Party Hall Downtown',
      priority: 'high',
      dueDate: '2024-02-05',
      completed: true,
      category: 'Venue'
    },
    {
      id: '3',
      title: 'Order cake',
      description: 'Order custom birthday cake from local bakery',
      priority: 'medium',
      dueDate: '2024-02-10',
      completed: false,
      category: 'Catering'
    }
  ]);

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    category: ''
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

  useEffect(() => {
    // Convert tasks to timeline items
    const timeline = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      date: task.dueDate,
      type: 'task' as const,
      completed: task.completed,
      priority: task.priority
    }));
    setTimelineItems(timeline);
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      completed: false,
      category: newTask.category
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: ''
    });
    setIsAddTaskOpen(false);
    toast.success('Task added successfully!');
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.success(`Task "${task.title}" ${task.completed ? 'reopened' : 'completed'}!`);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'overdue':
        return !task.completed && taskDate < today;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (item: TimelineItem) => {
    if (item.completed) {
      return <Check className="w-5 h-5 text-green-500" />;
    }
    
    const today = new Date();
    const itemDate = new Date(item.date);
    
    if (itemDate < today) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const isOverdue = (dateString: string, completed: boolean) => {
    return new Date(dateString) < new Date() && !completed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-blue-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task Checklist & Timeline
            </h1>
          </div>
        </div>

        {/* Tabs for Task List and Timeline View */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4" />
              <span>Task Checklist</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Timeline View</span>
            </TabsTrigger>
          </TabsList>

          {/* Task Checklist Tab */}
          <TabsContent value="tasks">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Tasks' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'completed', label: 'Completed' },
                  { key: 'overdue', label: 'Overdue' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={filter === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(key as typeof filter)}
                    className={filter === key ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-blue-50'}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Task Title</Label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        placeholder="Enter task description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Priority</Label>
                        <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({...newTask, priority: value})}>
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
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={newTask.category}
                        onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                        placeholder="e.g., Catering, Venue, Decorations"
                      />
                    </div>
                    <Button onClick={handleAddTask} className="w-full">
                      Add Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={`shadow-lg transition-all duration-300 ${
                    task.completed 
                      ? 'bg-green-50 border-green-200' 
                      : isOverdue(task.dueDate, task.completed)
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-1 p-1 rounded-full ${
                          task.completed 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {task.completed ? <Check className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </Button>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold text-lg ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                          }`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            {isOverdue(task.dueDate, task.completed) && (
                              <Badge className="bg-red-100 text-red-800">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          {task.category && (
                            <Badge variant="outline">{task.category}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Timeline</h3>
              {timelineItems.length === 0 ? (
                <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No timeline items</h3>
                    <p className="text-gray-600">Add some tasks to see your timeline!</p>
                  </CardContent>
                </Card>
              ) : (
                timelineItems
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((item) => (
                    <Card key={item.id} className="shadow-lg bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(item)}
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`font-semibold text-lg ${
                                item.completed ? 'line-through text-gray-500' : 'text-gray-800'
                              }`}>
                                {item.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={getPriorityColor(item.priority)}>
                                  {item.priority}
                                </Badge>
                                {isOverdue(item.date, item.completed) && (
                                  <Badge className="bg-red-100 text-red-800">
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{new Date(item.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
