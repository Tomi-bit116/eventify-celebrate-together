import { useState } from 'react';
import { MainMenu } from '@/components/MainMenu';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, CheckSquare, ListChecks, Edit, Share2, MapPin, Users } from 'lucide-react';
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
import { CompactQuickStartGuide } from '@/components/dashboard/CompactQuickStartGuide';
import { EditEventModal } from '@/components/dashboard/EditEventModal';
import { SocialShareModal } from '@/components/dashboard/SocialShareModal';
import { InteractiveSettingsPage } from '@/components/dashboard/InteractiveSettingsPage';

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
  
  // Check if user is new (no events created and quick start not completed)
  const isNewUser = !currentEvent && !localStorage.getItem('quickStartCompleted');
  const [isQuickStartOpen, setIsQuickStartOpen] = useState(false);
  const [isCompactGuideVisible, setIsCompactGuideVisible] = useState(isNewUser);
  
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
        break;
    }
  };

  const handleEventCreated = (eventData: any) => {
    setCurrentEvent(eventData);
    toast.success(`Event "${eventData.name}" created successfully!`);
    setIsCreateEventModalOpen(false);
    setIsCompactGuideVisible(false);
    localStorage.setItem('quickStartCompleted', 'true');
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

  const handleCloseCompactGuide = () => {
    setIsCompactGuideVisible(false);
    localStorage.setItem('quickStartCompleted', 'true');
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
    return <InteractiveSettingsPage onBack={handleBackToDashboard} />;
  }

  if (activeFeature === 'shared-access') {
    return <SharedAccessPage onBack={handleBackToDashboard} />;
  }

  if (activeFeature === 'vendor-contact-book') {
    return (
      <VendorContactBookPage 
        onBack={handleBackToDashboard}
        onWhatsAppMessage={(vendor) => {
          setActiveFeature('whatsapp-integration');
        }}
      />
    );
  }

  if (activeFeature === 'whatsapp-integration') {
    return <WhatsAppIntegrationPage onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50">
      {/* Header Section */}
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
      </header>
      
      <div className="flex h-[calc(100vh-80px)] pt-20">
        <MainMenu 
          onFeatureClick={handleFeatureClick} 
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          currentEvent={currentEvent}
          onEditEvent={() => setIsEditEventModalOpen(true)}
          onShareEvent={() => setIsSocialShareModalOpen(true)}
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
            </div>
            
            {/* Enhanced Current Event Info */}
            {currentEvent && (
              <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Current Event</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsEditEventModalOpen(true)}
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-100"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => setIsSocialShareModalOpen(true)}
                        size="sm"
                        variant="outline"
                        className="hover:bg-green-100"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="text-gray-600 text-sm">Event</span>
                        <p className="font-semibold text-gray-800">{currentEvent.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="text-gray-600 text-sm">Date</span>
                        <p className="font-semibold text-gray-800">{currentEvent.event_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-purple-500" />
                      <div>
                        <span className="text-gray-600 text-sm">Venue</span>
                        <p className="font-semibold text-gray-800">{currentEvent.venue || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-orange-500" />
                      <div>
                        <span className="text-gray-600 text-sm">Guests</span>
                        <p className="font-semibold text-gray-800">{currentEvent.expected_guests || 0}</p>
                      </div>
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
                      <div className={`${item.color} h-2.5 rounded-full transition-all duration-300`} style={{ width: `${item.value}%` }}></div>
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

      {/* Compact Quick Start Guide for new users */}
      <CompactQuickStartGuide
        isVisible={isCompactGuideVisible}
        onClose={handleCloseCompactGuide}
        onCreateEvent={() => handleQuickStartAction('create-event')}
        onInviteGuests={() => handleQuickStartAction('invite-guests')}
        onManageBudget={() => handleQuickStartAction('manage-budget')}
        onShareEvent={() => handleQuickStartAction('share-event')}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={() => {}} />
    </div>
  );
};
