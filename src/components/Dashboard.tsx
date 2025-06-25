
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Calendar,
  MessageSquare,
  CheckSquare,
  Settings,
  HelpCircle,
  Menu,
  X,
  Clock,
  Sparkles,
  Heart,
  UserCheck,
  UserPlus,
  MessageCircle,
  FileText,
  BookOpen
} from 'lucide-react';
import { CreateEventModal } from './dashboard/CreateEventModal';
import { ProgressTracker } from './dashboard/ProgressTracker';
import { LanguageToggle } from './dashboard/LanguageToggle';
import { InviteGuestsPage } from './dashboard/InviteGuestsPage';
import { BudgetPage } from './dashboard/BudgetPage';
import { RSVPPage } from './dashboard/RSVPPage';
import { SharedAccessPage } from './dashboard/SharedAccessPage';
import { WhatsAppIntegrationPage } from './dashboard/WhatsAppIntegrationPage';
import { EventTemplatesPage } from './dashboard/EventTemplatesPage';
import { TaskChecklistPage } from './dashboard/TaskChecklistPage';
import { VendorContactBookPage } from './dashboard/VendorContactBookPage';

export const Dashboard = () => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'invite' | 'budget' | 'rsvp' | 'shared-access' | 'whatsapp' | 'templates' | 'tasks' | 'vendors'>('dashboard');

  const handleEventCreated = (eventData: any) => {
    setCurrentEvent(eventData);
    setCompletedSteps(['create']);
    setCurrentStep(1);
  };

  const handleFeatureClick = (feature: string) => {
    console.log(`Opening ${feature} feature`);
    
    switch (feature) {
      case 'invite-guests':
        setCurrentPage('invite');
        break;
      case 'manage-budget':
        setCurrentPage('budget');
        break;
      case 'track-rsvps':
        setCurrentPage('rsvp');
        break;
      case 'shared-access':
        setCurrentPage('shared-access');
        break;
      case 'whatsapp-integration':
        setCurrentPage('whatsapp');
        break;
      case 'event-templates':
        setCurrentPage('templates');
        break;
      case 'task-checklist':
        setCurrentPage('tasks');
        break;
      case 'vendor-contact-book':
        setCurrentPage('vendors');
        break;
      default:
        console.log(`Feature ${feature} not implemented yet`);
    }
  };

  // Page routing
  if (currentPage === 'invite') {
    return <InviteGuestsPage onBack={() => setCurrentPage('dashboard')} />;
  }
  
  if (currentPage === 'budget') {
    return <BudgetPage onBack={() => setCurrentPage('dashboard')} />;
  }
  
  if (currentPage === 'rsvp') {
    return <RSVPPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'shared-access') {
    return <SharedAccessPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'whatsapp') {
    return <WhatsAppIntegrationPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'templates') {
    return <EventTemplatesPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'tasks') {
    return <TaskChecklistPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'vendors') {
    return <VendorContactBookPage onBack={() => setCurrentPage('dashboard')} />;
  }

  const mainFeatures = [
    {
      id: 'create-event',
      title: "Create New Event",
      description: "Start planning your celebration",
      icon: Plus,
      color: "bg-gradient-to-br from-lime-500 to-green-600",
      onClick: () => setShowCreateModal(true)
    },
    {
      id: 'invite-guests',
      title: "Invite Guests",
      description: "Build your guest list and send invitations",
      icon: Users,
      color: "bg-gradient-to-br from-yellow-500 to-lime-600",
      onClick: () => handleFeatureClick('invite-guests')
    },
    {
      id: 'manage-budget',
      title: "Budget Tracker",
      description: "Monitor expenses and stay on track",
      icon: DollarSign,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      onClick: () => handleFeatureClick('manage-budget')
    },
    {
      id: 'track-rsvps',
      title: "Track RSVPs",
      description: "Monitor guest responses",
      icon: UserCheck,
      color: "bg-gradient-to-br from-lime-500 to-yellow-600",
      onClick: () => handleFeatureClick('track-rsvps')
    },
    {
      id: 'shared-access',
      title: "Shared Access",
      description: "Add co-hosts and collaborators",
      icon: UserPlus,
      color: "bg-gradient-to-br from-yellow-500 to-green-600",
      onClick: () => handleFeatureClick('shared-access')
    },
    {
      id: 'whatsapp-integration',
      title: "WhatsApp Integration",
      description: "Share updates via WhatsApp",
      icon: MessageCircle,
      color: "bg-gradient-to-br from-green-500 to-lime-600",
      onClick: () => handleFeatureClick('whatsapp-integration')
    },
    {
      id: 'event-templates',
      title: "Event Templates",
      description: "Pre-built templates for quick setup",
      icon: FileText,
      color: "bg-gradient-to-br from-lime-500 to-emerald-600",
      onClick: () => handleFeatureClick('event-templates')
    },
    {
      id: 'task-checklist',
      title: "Task Checklist",
      description: "Track progress with deadlines",
      icon: CheckSquare,
      color: "bg-gradient-to-br from-yellow-500 to-lime-600",
      onClick: () => handleFeatureClick('task-checklist')
    },
    {
      id: 'vendor-contact-book',
      title: "Vendor's Contact Book",
      description: "Manage vendor details and payments",
      icon: BookOpen,
      color: "bg-gradient-to-br from-green-500 to-yellow-600",
      onClick: () => handleFeatureClick('vendor-contact-book')
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "My Events",
      description: "View all celebrations",
      color: "bg-gradient-to-br from-lime-400 to-green-400",
      onClick: () => handleFeatureClick('my-events')
    },
    {
      icon: Clock,
      title: "Timeline",
      description: "Event planning timeline",
      color: "bg-gradient-to-br from-yellow-400 to-lime-400",
      onClick: () => handleFeatureClick('timeline')
    },
    {
      icon: Settings,
      title: "Settings",
      description: "App preferences",
      color: "bg-gradient-to-br from-green-400 to-emerald-400",
      onClick: () => handleFeatureClick('settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-50 relative overflow-hidden">
      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-2xl opacity-20 animate-pulse animation-delay-300">✨</div>
        <div className="absolute top-32 right-20 text-2xl opacity-15 animate-pulse animation-delay-700">🌟</div>
        <div className="absolute bottom-40 left-20 text-2xl opacity-25 animate-pulse animation-delay-1000">💫</div>
        <div className="absolute bottom-60 right-16 text-xl opacity-20 animate-pulse animation-delay-500">⭐</div>
      </div>

      {/* Header with Menu Toggle */}
      <div className="relative z-20 bg-white/95 backdrop-blur-sm shadow-lg border-b border-lime-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden bg-gradient-to-r from-yellow-500 to-lime-500 text-white p-2"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-lime-500 rounded-full flex items-center justify-center">
                <span className="text-sm text-white">☀️</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Button
              variant="outline"
              onClick={() => handleFeatureClick('help')}
              className="hidden md:flex items-center space-x-2 border border-lime-200 text-green-700 hover:bg-lime-50"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-30 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:relative lg:w-auto lg:shadow-none lg:bg-transparent`}>
        <div className="p-6 lg:hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <Button onClick={() => setMenuOpen(false)} variant="ghost" size="sm">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {mainFeatures.slice(0, 4).map((feature) => (
              <Button
                key={feature.id}
                onClick={() => {
                  feature.onClick();
                  setMenuOpen(false);
                }}
                className="w-full justify-start bg-gradient-to-r from-yellow-50 to-lime-50 text-gray-800 hover:from-yellow-100 hover:to-lime-100"
              >
                <feature.icon className="w-5 h-5 mr-3" />
                {feature.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome back! Ready to celebrate?
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Your event planning dashboard is ready. Choose any feature below to continue creating your perfect celebration.
          </p>
        </div>

        {/* Progress Tracker */}
        {currentEvent && (
          <div className="mb-12">
            <ProgressTracker 
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>
        )}

        {/* Main Features Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-3 text-lime-500" />
              Event Planning Tools
              <Sparkles className="w-6 h-6 ml-3 text-lime-500" />
            </h2>
            <p className="text-gray-600">
              Click any feature to get started with your celebration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature) => (
              <Card 
                key={feature.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-0 shadow-lg group bg-white/90 backdrop-blur-sm"
                onClick={feature.onClick}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 mx-auto rounded-full ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-center">
              <Heart className="w-5 h-5 mr-2 text-green-500" />
              Quick Access
              <Heart className="w-5 h-5 ml-2 text-green-500" />
            </h2>
            <p className="text-gray-600">
              Jump to your most-used features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border-0 shadow-md group bg-white/90 backdrop-blur-sm"
                onClick={action.onClick}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full ${action.color} flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Celebration Showcase */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-yellow-500 via-lime-500 to-green-500 border-0 shadow-xl text-white">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-white">
                <span className="text-2xl">🎭</span>
                <span className="text-xl">Perfect for Every Celebration</span>
                <span className="text-2xl">🎭</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-white/90 mb-8">
                From intimate gatherings to grand celebrations—we help you plan it all with confidence and joy.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">💒</div>
                  <p className="font-medium">Weddings</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">🎂</div>
                  <p className="font-medium">Birthdays</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">🎓</div>
                  <p className="font-medium">Graduations</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">🎪</div>
                  <p className="font-medium">Parties</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};
