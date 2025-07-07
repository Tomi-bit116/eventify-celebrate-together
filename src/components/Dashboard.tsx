
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Plus, Settings, Users, CheckSquare, Share2, LogOut, DollarSign, FileText } from 'lucide-react';
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
import { BudgetTrackerPage } from './dashboard/BudgetTrackerPage';
import { EventTemplatesPage } from './dashboard/EventTemplatesPage';
import { WhatsAppBulkMessagingPage } from './dashboard/WhatsAppBulkMessagingPage';
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
      case 'manage-budget':
        return <BudgetTrackerPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent} />;
      case 'event-templates':
        return <EventTemplatesPage onBack={() => setActiveFeature(null)} onCreateEvent={handleCreateEvent} />;
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

              {/* Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Create Event */}
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-coral-500 to-coral-600 text-white border-0"
                  onClick={handleCreateEvent}
                >
                  <CardContent className="p-6 text-center">
                    <Plus className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 font-montserrat">Create Event</h3>
                    <p className="text-coral-100">Start planning your celebration</p>
                  </CardContent>
                </Card>

                {/* Interactive Guest Invitations */}
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0"
                  onClick={() => setActiveFeature('interactive-invite-guests')}
                >
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 font-montserrat">Invite Guests</h3>
                    <p className="text-teal-100">Send beautiful invitations</p>
                  </CardContent>
                </Card>

                {/* Budget Tracker */}
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0"
                  onClick={() => setActiveFeature('manage-budget')}
                >
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 font-montserrat">Budget Tracker</h3>
                    <p className="text-emerald-100">Manage your expenses</p>
                  </CardContent>
                </Card>

                {/* Track RSVPs */}
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-gold-500 to-gold-600 text-white border-0"
                  onClick={() => setActiveFeature('enhanced-track-rsvps')}
                >
                  <CardContent className="p-6 text-center">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 font-montserrat">Track RSVPs</h3>
                    <p className="text-gold-100">Monitor guest responses</p>
                  </CardContent>
                </Card>

                {/* Event Templates */}
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0"
                  onClick={() => setActiveFeature('event-templates')}
                >
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 font-montserrat">Event Templates</h3>
                    <p className="text-purple-100">Quick setup templates</p>
                  </CardContent>
                </Card>

                {/* WhatsApp Integration */}
                <Card 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-500 to-green-600 text-white border-0"
                  onClick={() => setActiveFeature('whatsapp-bulk-messaging')}
                >
                  <CardContent className="p-6 text-center">
                    <Share2 className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 font-montserrat">WhatsApp Bulk</h3>
                    <p className="text-green-100">Send bulk messages</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Events Summary */}
              {events.length > 0 && (
                <div className="mt-12 max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-montserrat">Your Recent Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.slice(0, 4).map((event) => (
                      <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200 bg-white/90 backdrop-blur-sm border-0">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-bold text-gray-800 flex items-center justify-between">
                            <span className="truncate">{event.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEventSelect(event)}
                              className="text-coral-600 hover:text-coral-700"
                            >
                              Manage
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="w-4 h-4 mr-2 text-coral-500" />
                            <span>{new Date(event.event_date).toLocaleDateString()}</span>
                          </div>
                          {event.venue && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="w-4 h-4 mr-2 text-teal-500">📍</span>
                              <span className="truncate">{event.venue}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-emerald-500" />
                            <span>{event.expected_guests || 0} guests</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
      />

      {/* Create Event Modal */}
      {isEventFormOpen && (
        <CreateEventModal
          isOpen={isEventFormOpen}
          onClose={() => setIsEventFormOpen(false)}
          onEventCreated={handleEventCreated}
        />
      )}

      {renderFeature()}
    </div>
  );
};
