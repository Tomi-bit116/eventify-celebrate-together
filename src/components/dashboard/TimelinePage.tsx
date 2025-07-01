
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, CheckCircle, Circle, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TimelinePageProps {
  onBack: () => void;
}

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'task' | 'milestone' | 'deadline';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  event_name: string;
}

export const TimelinePage = ({ onBack }: TimelinePageProps) => {
  const { user } = useAuth();
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');

  useEffect(() => {
    fetchTimelineData();
  }, [user]);

  const fetchTimelineData = async () => {
    if (!user) return;
    
    try {
      // Fetch tasks with event information
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          due_date,
          completed,
          priority,
          events!inner(name)
        `)
        .order('due_date', { ascending: true });

      if (tasksError) throw tasksError;

      // Transform tasks into timeline items
      const items: TimelineItem[] = (tasks || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        date: task.due_date,
        type: 'task' as const,
        completed: task.completed || false,
        priority: (task.priority || 'medium') as 'low' | 'medium' | 'high',
        event_name: task.events?.name || 'Unknown Event'
      }));

      setTimelineItems(items);
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      toast.error('Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = timelineItems.filter(item => {
    const today = new Date();
    const itemDate = new Date(item.date);
    
    switch (filter) {
      case 'upcoming':
        return itemDate >= today && !item.completed;
      case 'overdue':
        return itemDate < today && !item.completed;
      case 'completed':
        return item.completed;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-green-300 bg-green-50';
    }
  };

  const getStatusIcon = (item: TimelineItem) => {
    if (item.completed) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    
    const today = new Date();
    const itemDate = new Date(item.date);
    
    if (itemDate < today) {
      return <AlertCircle className="w-6 h-6 text-red-500" />;
    }
    
    return <Circle className="w-6 h-6 text-gray-400" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString: string, completed: boolean) => {
    return new Date(dateString) < new Date() && !completed;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-orange-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Event Timeline
            </h1>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Items' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'overdue', label: 'Overdue' },
                { key: 'completed', label: 'Completed' }
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={filter === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(key as typeof filter)}
                  className={filter === key ? 'bg-orange-500 hover:bg-orange-600' : 'hover:bg-orange-50'}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        {filteredItems.length === 0 ? (
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No timeline items</h3>
              <p className="text-gray-600">Create some tasks to see your event timeline!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <Card key={item.id} className={`shadow-lg bg-white/90 backdrop-blur-sm ${getPriorityColor(item.priority)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(item)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold text-lg ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.priority === 'high' ? 'bg-red-100 text-red-800' :
                            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.priority}
                          </span>
                          {isOverdue(item.date, item.completed) && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        <span className="text-gray-600 font-medium">{item.event_name}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
