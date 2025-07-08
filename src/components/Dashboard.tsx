import { useState, useEffect } from 'react';
import { MainMenu } from './MainMenu';
import { NewUserQuickStartGuide } from './dashboard/NewUserQuickStartGuide';
import { InteractiveInviteGuestsPage } from './dashboard/InteractiveInviteGuestsPage';
import { EnhancedTrackRSVPsPage } from './dashboard/EnhancedTrackRSVPsPage';
import { TaskChecklistPage } from './dashboard/TaskChecklistPage';
import { BudgetTrackerPage } from './dashboard/BudgetTrackerPage';
import { EventTemplatesPage } from './dashboard/EventTemplatesPage';
import { VendorContactBookPage } from './dashboard/VendorContactBookPage';
import { SharedAccessPage } from './dashboard/SharedAccessPage';
import { WhatsAppBulkMessagingPage } from './dashboard/WhatsAppBulkMessagingPage';
import { MyEventsPage } from './dashboard/MyEventsPage';
import { CreateEventModal } from './dashboard/CreateEventModal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, CheckSquare, Menu, Calendar as CalendarIcon, TrendingUp, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  userId: string;
}

export const Dashboard = ({ userId }: DashboardProps) => {
  const { user } = useAuth();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [showQuickStartGuide, setShowQuickStartGuide] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<any | null>(null);
  const [eventProgress, setEventProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    confirmedGuests: 0,
    budgetUsed: 0
  });
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  useEffect(() => {
    if (user?.user_metadata?.is_new_user === true) {
      setShowQuickStartGuide(true);
    }
    
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    if (events.length > 0) {
      // Get the most recent event as current event
      const mostRecentEvent = events[0];
      setCurrentEvent(mostRecentEvent);
      fetchEventProgress(mostRecentEvent.id);
    }
  }, [events]);

  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('get_user_events', {
        user_id_param: user.id
      });

      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventProgress = async (eventId: string) => {
    if (!user) return;

    try {
      // Fetch tasks
      const { data: tasks } = await supabase.rpc('get_event_tasks', {
        event_id_param: eventId,
        user_id_param: user.id
      });

      // Fetch RSVP stats
      const { data: rsvpStats } = await supabase.rpc('get_rsvp_stats', {
        event_id_param: eventId,
        user_id_param: user.id
      });

      const completedTasks = tasks?.filter(task => task.completed).length || 0;
      const totalTasks = tasks?.length || 0;
      const confirmedGuests = rsvpStats?.[0]?.yes_count || 0;

      setEventProgress({
        totalTasks,
        completedTasks,
        confirmedGuests,
        budgetUsed: 0 // This would need a budget tracking query
      });
    } catch (error) {
      console.error('Error fetching event progress:', error);
    }
  };

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setActiveFeature(null);
  };

  const handleCreateEvent = () => {
    setIsEventFormOpen(true);
  };

  const handleEventCreated = (newEvent: any) => {
    setEvents([newEvent, ...events]);
    setIsEventFormOpen(false);
    toast.success('Event created successfully! 🎉');
  };

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setIsEventFormOpen(true);
  };

  const handleShareEvent = (event: any) => {
    const eventDetails = `🎉 You're invited to ${event.name}!\n\n📅 Date: ${new Date(event.event_date).toLocaleDateString()}\n📍 Venue: ${event.venue || 'TBA'}\n\nRSVP now!`;
    navigator.clipboard.writeText(eventDetails);
    toast.success('Event details copied to clipboard! 📋');
  };

  const toggleMainMenu = () => {
    setIsMainMenuOpen(!isMainMenuOpen);
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
  };

  const calculateDaysLeft = (eventDate: string) => {
    const today = new Date();
    const eventDay = new Date(eventDate);
    const timeDiff = eventDay.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft;
  };

  const formatEventDate = (eventDate: string) => {
    return new Date(eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    const taskProgress = eventProgress.totalTasks > 0 ? (eventProgress.completedTasks / eventProgress.totalTasks) * 100 : 0;
    const guestProgress = currentEvent?.expected_guests > 0 ? (eventProgress.confirmedGuests / currentEvent.expected_guests) * 100 : 0;
    return Math.round((taskProgress + guestProgress) / 2);
  };

  const fetchUpcomingTasks = async (eventId: string) => {
    if (!user) return;

    try {
      const { data: tasks } = await supabase.rpc('get_event_tasks', {
        event_id_param: eventId,
        user_id_param: user.id
      });

      const upcomingTasks = tasks?.filter(task => !task.completed && task.due_date).slice(0, 3) || [];
      setUpcomingTasks(upcomingTasks);
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
    }
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case 'my-events':
        return <MyEventsPage onBack={() => setActiveFeature(null)} onEventSelect={handleEventSelect} onCreateEvent={handleCreateEvent} />;
      case 'create-event':
        setIsEventFormOpen(true);
        setActiveFeature(null);
        return null;
      case 'interactive-invite-guests':
        return <InteractiveInviteGuestsPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent || currentEvent} />;
      case 'enhanced-track-rsvps':
        return <EnhancedTrackRSVPsPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent || currentEvent} />;
      case 'task-checklist':
        return <TaskChecklistPage onBack={() => setActiveFeature(null)} />;
      case 'manage-budget':
        return <BudgetTrackerPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent || currentEvent} />;
      case 'event-templates':
        return <EventTemplatesPage onBack={() => setActiveFeature(null)} onCreateEvent={handleCreateEvent} />;
      case 'vendor-contact-book':
        return <VendorContactBookPage onBack={() => setActiveFeature(null)} onWhatsAppMessage={() => {}} />;
      case 'enhanced-shared-access':
        return <SharedAccessPage onBack={() => setActiveFeature(null)} />;
      case 'whatsapp-bulk-messaging':
        return <WhatsAppBulkMessagingPage onBack={() => setActiveFeature(null)} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-orange-100">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">Eventify</h1>
                    <p className="text-sm text-gray-600">Plan with Confidence</p>
                  </div>
                </div>
                <Button
                  onClick={toggleMainMenu}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-orange-100"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </Button>
              </div>
            </div>

            <div className="container mx-auto px-4 py-6">
              {currentEvent ? (
                <div className="space-y-6">
                  {/* Event Countdown Card */}
                  <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-600 mb-2">
                          {calculateDaysLeft(currentEvent.event_date)} Days
                        </div>
                        <p className="text-gray-700 text-lg font-medium mb-1">Until {currentEvent.name}</p>
                        <div className="flex items-center justify-center text-gray-600 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatEventDate(currentEvent.event_date)}
                        </div>
                        {currentEvent.event_time && (
                          <div className="flex items-center justify-center text-gray-600 text-sm mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {currentEvent.event_time}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Planning Progress Card */}
                  <Card className="bg-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                          Planning Progress
                        </h3>
                        <span className="text-2xl font-bold text-green-600">{calculateProgress()}%</span>
                      </div>
                      
                      <Progress 
                        value={calculateProgress()} 
                        className="h-3 mb-4 bg-gray-200"
                      />

                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                          <div className="text-lg font-bold text-green-700">
                            {eventProgress.completedTasks}/{eventProgress.totalTasks}
                          </div>
                          <p className="text-xs text-green-600">Tasks</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                          <div className="text-lg font-bold text-yellow-700">
                            {eventProgress.confirmedGuests}
                          </div>
                          <p className="text-xs text-yellow-600">Guests</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                          <div className="text-lg font-bold text-orange-700">
                            ${eventProgress.budgetUsed}
                          </div>
                          <p className="text-xs text-orange-600">Budget</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Tasks */}
                  {upcomingTasks.length > 0 && (
                    <Card className="bg-white border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                          <ListTodo className="w-5 h-5 mr-2 text-blue-600" />
                          Upcoming Tasks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {upcomingTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-800 text-sm">{task.title}</h4>
                                <p className="text-xs text-gray-600 flex items-center mt-1">
                                  <CalendarIcon className="w-3 h-3 mr-1" />
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {task.priority}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Event Timeline */}
                  <Card className="bg-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-800">
                        <Clock className="w-5 h-5 mr-2 text-purple-600" />
                        Event Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-800">Event Created</p>
                            <p className="text-xs text-gray-600">{new Date(currentEvent.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-800">Planning In Progress</p>
                            <p className="text-xs text-gray-600">Current phase</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-800">Event Day</p>
                            <p className="text-xs text-gray-600">{formatEventDate(currentEvent.event_date)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                /* Welcome State */
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-4xl">🎊</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Eventify!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Ready to plan something amazing? Create your first event to get started.
                  </p>
                  <Button
                    onClick={handleCreateEvent}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-full shadow-lg text-lg"
                  >
                    Create Your First Event
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat">
      {/* Quick Start Guide for New Users */}
      {showQuickStartGuide && (
        <NewUserQuickStartGuide onClose={() => setShowQuickStartGuide(false)} />
      )}

      {/* Main Menu */}
      <MainMenu
        onFeatureClick={setActiveFeature}
        isOpen={isMainMenuOpen}
        onToggle={toggleMainMenu}
        currentEvent={selectedEvent}
        onEditEvent={() => handleEditEvent(selectedEvent)}
        onShareEvent={() => handleShareEvent(selectedEvent)}
        onCreateEvent={handleCreateEvent}
        events={events}
      />

      {/* Create Event Modal */}
      {isEventFormOpen && (
        <CreateEventModal
          isOpen={isEventFormOpen}
          onClose={() => setIsEventFormOpen(false)}
          onEventCreated={handleEventCreated}
          eventToEdit={selectedEvent}
        />
      )}

      {renderFeature()}
    </div>
  );
};
