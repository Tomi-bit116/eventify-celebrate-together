import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Plus, Settings, Users, CheckSquare, Share2 } from 'lucide-react';
import { EventForm } from './EventForm';
import { EventCard } from './EventCard';
import { MainMenu } from './MainMenu';
import { CompactQuickStartGuide } from './dashboard/CompactQuickStartGuide';
import { InviteGuestsPage } from './dashboard/InviteGuestsPage';
import { TrackRSVPsPage } from './dashboard/TrackRSVPsPage';
import { BudgetTrackerPage } from './dashboard/BudgetTrackerPage';
import { TaskChecklistPage } from './dashboard/TaskChecklistPage';
import { TimelinePage } from './dashboard/TimelinePage';
import { SettingsPage } from './dashboard/SettingsPage';
import { SharedAccessPage } from './dashboard/SharedAccessPage';
import { WhatsAppIntegrationPage } from './dashboard/WhatsAppIntegrationPage';
import { EventTemplatesPage } from './dashboard/EventTemplatesPage';
import { VendorContactBookPage } from './dashboard/VendorContactBookPage';
import { InteractiveInviteGuestsPage } from './dashboard/InteractiveInviteGuestsPage';
import { EnhancedTrackRSVPsPage } from './dashboard/EnhancedTrackRSVPsPage';

interface DashboardProps {
  userId: string;
}

export const Dashboard = ({ userId }: DashboardProps) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [showQuickStartGuide, setShowQuickStartGuide] = useState(true);

  useEffect(() => {
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
  }, []);

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setActiveFeature(null); // Clear active feature when event is selected
  };

  const handleCreateEvent = (newEvent: any) => {
    setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
    setIsEventFormOpen(false);
  };

  const handleEditEvent = () => {
    setIsEventFormOpen(true);
  };

  const handleShareEvent = () => {
    alert('Share event clicked!');
  };

  const toggleMainMenu = () => {
    setIsMainMenuOpen(!isMainMenuOpen);
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case 'create-event':
        return <EventForm onCreate={handleCreateEvent} onCancel={() => setActiveFeature(null)} />;
      case 'invite-guests':
        return <InviteGuestsPage onBack={() => setActiveFeature(null)} />;
      case 'track-rsvps':
        return <TrackRSVPsPage onBack={() => setActiveFeature(null)} />;
      case 'manage-budget':
        return <BudgetTrackerPage onBack={() => setActiveFeature(null)} />;
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
      case 'event-templates':
        return <EventTemplatesPage onBack={() => setActiveFeature(null)} />;
      case 'vendor-contact-book':
        return <VendorContactBookPage onBack={() => setActiveFeature(null)} />;
      
      case 'interactive-invite-guests':
        return <InteractiveInviteGuestsPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent} />;
      
      case 'enhanced-track-rsvps':
        return <EnhancedTrackRSVPsPage onBack={() => setActiveFeature(null)} currentEvent={selectedEvent} />;
      
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={handleEventSelect}
              />
            ))}
            <Card
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              onClick={() => setIsEventFormOpen(true)}
            >
              <CardContent className="text-center">
                <Plus className="w-10 h-10 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Create New Event</h3>
                <p className="text-sm opacity-80">Start planning your celebration</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Start Guide */}
      {showQuickStartGuide && (
        <CompactQuickStartGuide onClose={() => setShowQuickStartGuide(false)} />
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
          {selectedEvent && (
            <div className="space-x-2">
              <Button onClick={handleEditEvent}>
                <Settings className="w-4 h-4 mr-2" />
                Edit Event
              </Button>
              <Button onClick={handleShareEvent} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          )}
        </header>

        {renderFeature()}
      </div>
    </div>
  );
};
