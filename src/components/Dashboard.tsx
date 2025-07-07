
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Plus, Settings, Users, CheckSquare, Share2, LogOut } from 'lucide-react';
import { EventForm } from './EventForm';
import { EventCard } from './EventCard';
import { MainMenu } from './MainMenu';
import { NewUserQuickStartGuide } from './dashboard/NewUserQuickStartGuide';
import { InviteGuestsPage } from './dashboard/InviteGuestsPage';
import { TrackRSVPsPage } from './dashboard/TrackRSVPsPage';
import { TaskChecklistPage } from './dashboard/TaskChecklistPage';
import { TimelinePage } from './dashboard/TimelinePage';
import { SettingsPage } from './dashboard/SettingsPage';
import { SharedAccessPage } from './dashboard/SharedAccessPage';
import { WhatsAppIntegrationPage } from './dashboard/WhatsAppIntegrationPage';
import { VendorContactBookPage } from './dashboard/VendorContactBookPage';
import { InteractiveInviteGuestsPage } from './dashboard/InteractiveInviteGuestsPage';
import { EnhancedTrackRSVPsPage } from './dashboard/EnhancedTrackRSVPsPage';
import { MyEventsPage } from './dashboard/MyEventsPage';
import { CreateEventModal } from './dashboard/CreateEventModal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface DashboardProps {
  userId: string;
}

export const Dashboard = ({ userId }: DashboardProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [showQuickStartGuide, setShowQuickStartGuide] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is new and should see quick start guide
    if (user?.user_metadata?.is_new_user === true) {
      setShowQuickStartGuide(true);
    }
    
    if (user) {
      fetchEvents();
    }
  }, [user]);

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
    // Copy event details to clipboard
    const eventDetails = `🎉 You're invited to ${event.name}!\n\n📅 Date: ${new Date(event.event_date).toLocaleDateString()}\n📍 Venue: ${event.venue || 'TBA'}\n\nRSVP now!`;
    navigator.clipboard.writeText(eventDetails);
    toast.success('Event details copied to clipboard! 📋');
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('delete_user_event', {
        event_id_param: eventId,
        user_id_param: user.id
      });

      if (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
        return;
      }

      if (data) {
        setEvents(events.filter(event => event.id !== eventId));
        toast.success('Event deleted successfully');
      } else {
        toast.error('Event not found or you do not have permission to delete it');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Error signing out');
    }
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
      case 'invite-guests':
        return <InviteGuestsPage onBack={() => setActiveFeature(null)} />;
      case 'track-rsvps':
        return <TrackRSVPsPage onBack={() => setActiveFeature(null)} />;
      case 'task-checklist':
        return <TaskChecklistPage onBack={() => setActiveFeature(null)} />;
      case 'timeline':
        return <TimelinePage onBack={() => setActiveFeature(null)} />;
      case 'settings':
        return <SettingsPage onBack={() => setActiveFeature(null)} />;
      case 'enhanced-shared-access':
        return <SharedAccessPage onBack={() => setActiveFeature(null)} />;
      case 'enhanced-whatsapp-integration':
        return <WhatsAppIntegrationPage onBack={() => setActiveFeature(null)} />;
      case 'vendor-contact-book':
        return <VendorContactBookPage onBack={() => setActiveFeature(null)} onWhatsAppMessage={() => {}} />;
      case 'interactive-invite-guests':
        return <InteractiveInviteGuestsPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent} />;
      case 'enhanced-track-rsvps':
        return <EnhancedTrackRSVPsPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent} />;
      default:
        return (
          <div className="font-montserrat">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {getUserDisplayName()}! ✨
              </h1>
              <p className="text-gray-600">
                Ready to plan something amazing? Let's make your next celebration unforgettable.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-r from-coral-500 to-coral-600 text-white">
                <CardContent className="p-4 text-center">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{events.length}</h3>
                  <p className="text-sm opacity-90">Total Events</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{events.reduce((acc, event) => acc + (event.expected_guests || 0), 0)}</h3>
                  <p className="text-sm opacity-90">Guests Invited</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <CardContent className="p-4 text-center">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">0</h3>
                  <p className="text-sm opacity-90">Tasks Remaining</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold">95%</h3>
                  <p className="text-sm opacity-90">Completion Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Button
                onClick={handleCreateEvent}
                className="h-20 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white flex flex-col items-center justify-center space-y-2"
              >
                <Plus className="w-6 h-6" />
                <span>Create Event</span>
              </Button>
              <Button
                onClick={() => setActiveFeature('interactive-invite-guests')}
                className="h-20 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white flex flex-col items-center justify-center space-y-2"
              >
                <Users className="w-6 h-6" />
                <span>Invite Guests</span>
              </Button>
              <Button
                onClick={() => setActiveFeature('task-checklist')}
                className="h-20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white flex flex-col items-center justify-center space-y-2"
              >
                <CheckSquare className="w-6 h-6" />
                <span>View Tasks</span>
              </Button>
              <Button
                onClick={() => setActiveFeature('enhanced-track-rsvps')}
                className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white flex flex-col items-center justify-center space-y-2"
              >
                <Users className="w-6 h-6" />
                <span>Track RSVPs</span>
              </Button>
            </div>

            {/* Upcoming Events */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Upcoming Events</h2>
                <Button onClick={() => setActiveFeature('my-events')} variant="outline">
                  View All Events
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your events...</p>
                </div>
              ) : events.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No events yet</h3>
                    <p className="text-gray-500 mb-4">Create your first event to get started!</p>
                    <Button onClick={handleCreateEvent} className="bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Event
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.slice(0, 6).map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-bold text-gray-800 truncate">{event.name}</CardTitle>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShareEvent(event)}
                              className="hover:bg-green-100 text-green-600"
                              title="Share Event"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                              className="hover:bg-blue-100 text-blue-600"
                              title="Edit Event"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                          {event.event_time && <span className="ml-2">at {event.event_time}</span>}
                        </div>
                        
                        {event.venue && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="w-4 h-4 mr-2 text-green-500">📍</span>
                            <span className="truncate">{event.venue}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-purple-500" />
                          <span>{event.expected_guests || 0} expected guests</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm font-medium text-gray-700">
                            Budget: ${event.budget?.toLocaleString() || '0'}
                          </span>
                          <Button
                            onClick={() => handleEventSelect(event)}
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                          >
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      />

      {/* Create Event Modal */}
      {isEventFormOpen && (
        <CreateEventModal
          isOpen={isEventFormOpen}
          onClose={() => setIsEventFormOpen(false)}
          onEventCreated={handleEventCreated}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedEvent ? selectedEvent.name : 'My Events'}
            </h1>
            <p className="text-gray-600">
              {selectedEvent
                ? 'Manage your event details and planning'
                : 'Select an event to manage, or create a new one.'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {selectedEvent && (
              <>
                <Button onClick={() => handleEditEvent(selectedEvent)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Event
                </Button>
                <Button onClick={() => handleShareEvent(selectedEvent)} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </>
            )}
            <Button onClick={handleSignOut} variant="outline" className="text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {renderFeature()}
      </div>
    </div>
  );
};
