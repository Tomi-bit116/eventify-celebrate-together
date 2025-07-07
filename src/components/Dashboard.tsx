
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
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    // Check if user is new and should see quick start guide
    if (user?.user_metadata?.is_new_user === true) {
      setShowQuickStartGuide(true);
    }

    // Mock events for now
    const mockEvents = [
      {
        id: '1',
        name: 'Adunni & Chidi Wedding',
        date: '2024-08-10',
        venue: 'The Balmoral Hall',
        description: 'A celebration of love',
        budget: 10000,
        tasks: 25,
        guests: 200,
        image: 'https://images.unsplash.com/photo-1556912172-8396ca5c8418?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdlZGRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60'
      },
      {
        id: '2',
        name: 'Emeka 40th Birthday Bash',
        date: '2024-09-15',
        venue: 'Eko Hotel & Suites',
        description: 'Celebrating 40 years of greatness',
        budget: 5000,
        tasks: 15,
        guests: 100,
        image: 'https://images.unsplash.com/photo-1508768787810-6adc1743f03d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBhcnR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60'
      },
    ];
    setEvents(mockEvents);
  }, [user]);

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setActiveFeature(null);
  };

  const handleCreateEvent = (newEvent: any) => {
    setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
    setIsEventFormOpen(false);
    toast.success('Event created successfully! 🎉');
  };

  const handleEditEvent = () => {
    setIsEventFormOpen(true);
  };

  const handleShareEvent = () => {
    toast.success('Event shared successfully! 📤');
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
    return user?.user_metadata?.display_name || user?.user_metadata?.full_name || 'there';
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case 'create-event':
        return <EventForm onCreate={handleCreateEvent} onCancel={() => setActiveFeature(null)} />;
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
                  <h3 className="text-2xl font-bold">{events.reduce((acc, event) => acc + event.guests, 0)}</h3>
                  <p className="text-sm opacity-90">Guests Invited</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <CardContent className="p-4 text-center">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{events.reduce((acc, event) => acc + event.tasks, 0)}</h3>
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
                onClick={() => setIsEventFormOpen(true)}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelect={handleEventSelect}
                  />
                ))}
                <Card
                  className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-200 flex items-center justify-center min-h-[200px]"
                  onClick={() => setIsEventFormOpen(true)}
                >
                  <CardContent className="text-center">
                    <Plus className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Create New Event</h3>
                    <p className="text-sm opacity-80">Start planning your celebration</p>
                  </CardContent>
                </Card>
              </div>
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
        onEditEvent={handleEditEvent}
        onShareEvent={handleShareEvent}
      />

      {/* Event Form Modal */}
      {isEventFormOpen && (
        <EventForm
          isOpen={isEventFormOpen}
          onClose={() => setIsEventFormOpen(false)}
          onCreate={handleCreateEvent}
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
                <Button onClick={handleEditEvent}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Event
                </Button>
                <Button onClick={handleShareEvent} variant="outline">
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
