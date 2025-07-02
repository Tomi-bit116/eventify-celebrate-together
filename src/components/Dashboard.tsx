import { useState } from 'react';
import { MainMenu } from '@/components/MainMenu';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, CheckSquare, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CreateEventModal } from '@/components/dashboard/CreateEventModal';
import { InviteGuestsModal } from '@/components/dashboard/InviteGuestsModal';
import { BudgetTracker } from '@/components/dashboard/BudgetTracker';
import { InviteGuestsPage } from '@/components/dashboard/InviteGuestsPage';
import { EventTemplatesPage } from '@/components/dashboard/EventTemplatesPage';
import { TrackRSVPsPage } from '@/components/dashboard/TrackRSVPsPage';
import { TaskChecklistPage } from '@/components/dashboard/TaskChecklistPage';
import { MyEventsPage } from '@/components/dashboard/MyEventsPage';
import { TimelinePage } from '@/components/dashboard/TimelinePage';
import { SettingsPage } from '@/components/dashboard/SettingsPage';
import { SharedAccessPage } from '@/components/dashboard/SharedAccessPage';
import { VendorContactBookPage } from '@/components/dashboard/VendorContactBookPage';
import { WhatsAppIntegrationPage } from '@/components/dashboard/WhatsAppIntegrationPage';
import { QuickStartGuide } from '@/components/dashboard/QuickStartGuide';
import { EditEventModal } from '@/components/dashboard/EditEventModal';
import { SocialShareModal } from '@/components/dashboard/SocialShareModal';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  // Modal states
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isInviteGuestsModalOpen, setIsInviteGuestsModalOpen] = useState(false);
  const [isBudgetTrackerOpen, setIsBudgetTrackerOpen] = useState(false);
  const [isQuickStartOpen, setIsQuickStartOpen] = useState(!currentEvent); // Show for new users
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
    console.log(`Feature ${featureId} clicked`);
    
    // Handle specific features
    switch (featureId) {
      case 'create-event':
        setIsCreateEventModalOpen(true);
        break;
      case 'invite-guests':
        if (currentEvent) {
          setActiveFeature('invite-guests');
        } else {
          toast.error("Please create an event first");
        }
        break;
      case 'manage-budget':
        if (currentEvent) {
          setIsBudgetTrackerOpen(true);
        } else {
          toast.error("Please create an event first");
        }
        break;
      case 'track-rsvps':
        setActiveFeature('track-rsvps');
        break;
      case 'task-checklist':
        setActiveFeature('task-checklist');
        break;
      case 'event-templates':
        setActiveFeature('event-templates');
        break;
      case 'my-events':
        setActiveFeature('my-events');
        break;
      case 'timeline':
        setActiveFeature('timeline');
        break;
      case 'settings':
        setActiveFeature('settings');
        break;
      case 'shared-access':
        setActiveFeature('shared-access');
        break;
      case 'vendor-contact-book':
        setActiveFeature('vendor-contact-book');
        break;
      case 'whatsapp-integration':
        setActiveFeature('whatsapp-integration');
        break;
      default:
        // For other features, just update the active feature
        break;
    }
  };

  const handleEventCreated = (eventData: any) => {
    setCurrentEvent(eventData);
    toast.success(`Event "${eventData.name}" created successfully!`);
    setIsCreateEventModalOpen(false);
    setIsQuickStartOpen(false); // Close quick start after creating first event
  };

  const handleEventUpdated = (eventData: any) => {
    setCurrentEvent(eventData);
    toast.success(`Event "${eventData.name}" updated successfully!`);
  };

  const handleBackToDashboard = () => {
    setActiveFeature(null);
  };

  const handleEventSelect = (event: any) => {
    setCurrentEvent(event);
    setActiveFeature(null);
    toast.success(`Now managing: ${event.name}`);
  };

  const handleQuickStartAction = (action: string) => {
    switch (action) {
      case 'create-event':
        setIsCreateEventModalOpen(true);
        break;
      case 'invite-guests':
        if (currentEvent) {
          setActiveFeature('invite-guests');
        } else {
          setIsCreateEventModalOpen(true);
        }
        break;
      case 'manage-budget':
        if (currentEvent) {
          setIsBudgetTrackerOpen(true);
        } else {
          setIsCreateEventModalOpen(true);
        }
        break;
      case 'share-event':
        if (currentEvent) {
          setIsSocialShareModalOpen(true);
        } else {
          setIsCreateEventModalOpen(true);
        }
        break;
    }
  };

  const progressData = [
    { label: 'Planning', value: currentEvent ? 75 : 0, color: 'bg-yellow-500' },
    { label: 'Budget', value: currentEvent ? 50 : 0, color: 'bg-green-500' },
    { label: 'Guests', value: currentEvent ? 90 : 0, color: 'bg-lime-500' },
  ];

  const quickStats = [
    { label: 'Days Left', value: currentEvent ? 28 : 0, icon: Calendar },
    { label: 'Tasks Due', value: currentEvent ? 5 : 0, icon: ListChecks },
    { label: 'In Budget', value: currentEvent ? 'Yes' : 'N/A', icon: CheckSquare },
    { label: 'Time to Party', value: currentEvent?.time || 'Not Set', icon: Clock },
  ];

  // Render different pages based on active feature
  if (activeFeature === 'invite-guests') {
    return <InviteGuestsPage onBack={handleBackToDashboard} />;
  }

  if (activeFeature === 'event-templates') {
    return <EventTemplatesPage onBack={handleBackToDashboard} />;
  }

  if (activeFeature === 'track-rsvps') {
    return <TrackRSVPsPage onBack={handleBackToDashboard} />;
  }

  if (activeFeature === 'task-checklist') {
    return <TaskChecklistPage onBack={handleBackToDashboard} />;
  }

  if (activeFeature === 'my-events') {
    return (
      <MyEventsPage 
        onBack={handleBackToDashboard} 
        onEventSelect={handleEventSelect}
        onCreateEvent={() => setIsCreateEventModalOpen(true)}
      />
    );
  }

  if (activeFeature === 'timeline') {
    return <TimelinePage onBack={handleBackToDashboard} />;
  }

  if (activeFeature === 'settings') {
    return <SettingsPage onBack={handleBackToDashboard} />;
  }

  if (activeFeature === 'shared-access') {
    return <SharedAccessPage onBack={handleBackToDashboard} />;
  }

  if (activeFeature === 'vendor-contact-book') {
    return (
      <VendorContactBookPage 
        onBack={handleBackToDashboard}
        onWhatsAppMessage={(vendor) => {
          // Switch to WhatsApp integration with pre-filled vendor data
          setActiveFeature('whatsapp-integration');
          // Could pass vendor data here if needed
        }}
      />
    );
  }

  if (activeFeature === 'whatsapp-integration') {
    return <WhatsAppIntegrationPage onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50">
      {/* Header Section - Simplified without duplicate sign out */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-lg text-white">☀️</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Eventify
            </span>
            <span className="text-xs text-gray-500 -mt-1">Plan with confidence</span>
          </div>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          {currentEvent && (
            <>
              <Button
                onClick={() => setIsEditEventModalOpen(true)}
                variant="ghost"
                size="sm"
                className="hidden sm:flex hover:bg-orange-100"
              >
                Edit Event
              </Button>
              <Button
                onClick={() => setIsSocialShareModalOpen(true)}
                variant="ghost"
                size="sm"
                className="hidden sm:flex hover:bg-orange-100"
              >
                Share Event
              </Button>
            </>
          )}
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-80px)] pt-20">
        <MainMenu 
          onFeatureClick={handleFeatureClick} 
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto lg:ml-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Welcome back{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ''}! 🎉
                </h1>
                <p className="text-gray-600">
                  {currentEvent ? `Currently planning: ${currentEvent.name}` : 'Ready to plan your next amazing celebration?'}
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2">
                {!currentEvent && (
                  <Button
                    onClick={() => setIsQuickStartOpen(true)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-orange-100"
                  >
                    Quick Start Guide
                  </Button>
                )}
                {currentEvent && (
                  <>
                    <Button
                      onClick={() => setIsEditEventModalOpen(true)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-100 sm:hidden"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => setIsSocialShareModalOpen(true)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-green-100 sm:hidden"
                    >
                      Share
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Current Event Info */}
            {currentEvent && (
              <Card className="mb-6 border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Event</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium">{currentEvent.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <p className="font-medium">{currentEvent.event_date}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Venue:</span>
                      <p className="font-medium">{currentEvent.venue || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Guests:</span>
                      <p className="font-medium">{currentEvent.expected_guests || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Progress Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {progressData.map((item, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{item.label}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.value}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.value}% Complete</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-lime-400 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">{stat.label}</h4>
                      <p className="text-xs text-gray-600">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              {activeFeature ? `Feature: ${activeFeature}` : currentEvent ? `${currentEvent.name} Dashboard` : 'Dashboard Overview'}
            </h2>
            <p className="text-gray-600 mb-6">
              {activeFeature 
                ? `You are currently viewing the ${activeFeature} feature.` 
                : currentEvent 
                  ? 'Manage your event using the menu on the left. Track progress, invite guests, and stay organized!'
                  : 'Create your first event to get started with planning your celebration!'
              }
            </p>
            
            {!currentEvent && !activeFeature && (
              <div className="text-center py-8">
                <Button 
                  onClick={() => setIsCreateEventModalOpen(true)}
                  className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white px-6 sm:px-8 py-3 text-base sm:text-lg"
                >
                  Create Your First Event
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateEventModal 
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
      
      <InviteGuestsModal 
        isOpen={isInviteGuestsModalOpen}
        onClose={() => setIsInviteGuestsModalOpen(false)}
        eventData={currentEvent}
      />
      
      <BudgetTracker 
        isOpen={isBudgetTrackerOpen}
        onClose={() => setIsBudgetTrackerOpen(false)}
        eventData={currentEvent}
      />

      <QuickStartGuide
        isOpen={isQuickStartOpen}
        onClose={() => setIsQuickStartOpen(false)}
        onCreateEvent={() => handleQuickStartAction('create-event')}
        onInviteGuests={() => handleQuickStartAction('invite-guests')}
        onManageBudget={() => handleQuickStartAction('manage-budget')}
        onShareEvent={() => handleQuickStartAction('share-event')}
      />

      <EditEventModal
        isOpen={isEditEventModalOpen}
        onClose={() => setIsEditEventModalOpen(false)}
        event={currentEvent}
        onEventUpdated={handleEventUpdated}
      />

      <SocialShareModal
        isOpen={isSocialShareModalOpen}
        onClose={() => setIsSocialShareModalOpen(false)}
        event={currentEvent}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={() => {}} />
    </div>
  );
};
