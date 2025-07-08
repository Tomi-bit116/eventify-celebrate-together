
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

  useEffect(() => {
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
        return <InteractiveInviteGuestsPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent} />;
      case 'enhanced-track-rsvps':
        return <EnhancedTrackRSVPsPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent} />;
      case 'task-checklist':
        return <TaskChecklistPage onBack={() => setActiveFeature(null)} />;
      case 'manage-budget':
        return <BudgetTrackerPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent} />;
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

              {/* Simple Welcome Card */}
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
