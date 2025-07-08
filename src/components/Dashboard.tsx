
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
import { Calendar, Users, DollarSign, CheckSquare } from 'lucide-react';

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
          <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-emerald-50">
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4 font-montserrat">
                  Welcome to Eventify! ✨
                </h1>
                <p className="text-xl text-gray-600 font-montserrat">
                  Hello {getUserDisplayName()}! Ready to plan something amazing?
                </p>
              </div>

              {/* Current Event Progress */}
              {currentEvent && (
                <div className="max-w-4xl mx-auto mb-8">
                  <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-800 flex items-center">
                          <Calendar className="w-6 h-6 mr-2 text-coral-600" />
                          {currentEvent.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {new Date(currentEvent.event_date).toLocaleDateString()}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Task Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-sm font-medium text-gray-700">
                              <CheckSquare className="w-4 h-4 mr-1 text-blue-600" />
                              Tasks
                            </span>
                            <span className="text-sm text-gray-600">
                              {eventProgress.completedTasks}/{eventProgress.totalTasks}
                            </span>
                          </div>
                          <Progress 
                            value={eventProgress.totalTasks > 0 ? (eventProgress.completedTasks / eventProgress.totalTasks) * 100 : 0} 
                            className="h-2"
                          />
                        </div>

                        {/* Guest Confirmations */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-sm font-medium text-gray-700">
                              <Users className="w-4 h-4 mr-1 text-teal-600" />
                              Confirmed Guests
                            </span>
                            <span className="text-sm text-gray-600">
                              {eventProgress.confirmedGuests}/{currentEvent.expected_guests || 0}
                            </span>
                          </div>
                          <Progress 
                            value={currentEvent.expected_guests > 0 ? (eventProgress.confirmedGuests / currentEvent.expected_guests) * 100 : 0} 
                            className="h-2"
                          />
                        </div>

                        {/* Budget Usage */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-sm font-medium text-gray-700">
                              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                              Budget
                            </span>
                            <span className="text-sm text-gray-600">
                              ${eventProgress.budgetUsed}/${currentEvent.budget || 0}
                            </span>
                          </div>
                          <Progress 
                            value={currentEvent.budget > 0 ? (eventProgress.budgetUsed / currentEvent.budget) * 100 : 0} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Simple Welcome Card for users without events */}
              {!currentEvent && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-0 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">
                      Let's Create Something Special
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Use the menu to access all your planning tools and manage your events.
                    </p>
                    <div className="text-sm text-gray-500">
                      Click the menu button to get started!
                    </div>
                  </div>
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
