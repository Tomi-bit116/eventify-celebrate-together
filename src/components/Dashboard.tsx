
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Users, 
  DollarSign, 
  CheckCircle, 
  BarChart3,
  Calendar,
  MessageSquare,
  BookOpen,
  Upload,
  Settings,
  HelpCircle,
  Menu,
  X,
  Globe,
  MapPin,
  Clock,
  Camera,
  Sparkles,
  Heart
} from 'lucide-react';
import { CreateEventModal } from './dashboard/CreateEventModal';
import { ProgressTracker } from './dashboard/ProgressTracker';
import { LanguageToggle } from './dashboard/LanguageToggle';

export const Dashboard = () => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleEventCreated = (eventData: any) => {
    setCurrentEvent(eventData);
    setCompletedSteps(['create']);
    setCurrentStep(1);
  };

  const handleFeatureClick = (feature: string) => {
    console.log(`Opening ${feature} feature`);
    // Feature-specific logic will be implemented
  };

  const mainFeatures = [
    {
      id: 'create-event',
      title: "Create New Event",
      description: "Start planning your next celebration",
      icon: Plus,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      onClick: () => setShowCreateModal(true)
    },
    {
      id: 'invite-guests',
      title: "Invite Guests",
      description: "Build your guest list and send invitations",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      onClick: () => handleFeatureClick('invite-guests')
    },
    {
      id: 'manage-budget',
      title: "Manage Budget",
      description: "Track expenses and stay within limits",
      icon: DollarSign,
      color: "bg-gradient-to-br from-yellow-500 to-orange-600",
      onClick: () => handleFeatureClick('manage-budget')
    },
    {
      id: 'track-rsvps',
      title: "Track RSVPs",
      description: "Monitor guest responses and attendance",
      icon: CheckCircle,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      onClick: () => handleFeatureClick('track-rsvps')
    },
    {
      id: 'upload-media',
      title: "Upload Event Media",
      description: "Add photos, videos, and banners",
      icon: Upload,
      color: "bg-gradient-to-br from-pink-500 to-rose-600",
      onClick: () => handleFeatureClick('upload-media')
    },
    {
      id: 'task-checklist',
      title: "Task Checklist",
      description: "Organize and track your to-do items",
      icon: BookOpen,
      color: "bg-gradient-to-br from-teal-500 to-cyan-600",
      onClick: () => handleFeatureClick('task-checklist')
    },
    {
      id: 'vendor-booking',
      title: "Vendor Booking",
      description: "Connect with and book service providers",
      icon: MessageSquare,
      color: "bg-gradient-to-br from-indigo-500 to-blue-600",
      onClick: () => handleFeatureClick('vendor-booking')
    },
    {
      id: 'analytics',
      title: "Event Analytics",
      description: "View insights and event metrics",
      icon: BarChart3,
      color: "bg-gradient-to-br from-red-500 to-pink-600",
      onClick: () => handleFeatureClick('analytics')
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "My Events",
      description: "View all your celebrations",
      color: "bg-gradient-to-br from-rose-400 to-pink-400",
      onClick: () => handleFeatureClick('my-events')
    },
    {
      icon: Clock,
      title: "Timeline",
      description: "Event planning timeline",
      color: "bg-gradient-to-br from-cyan-400 to-blue-400",
      onClick: () => handleFeatureClick('timeline')
    },
    {
      icon: Camera,
      title: "Photo Gallery",
      description: "Event photos and memories",
      color: "bg-gradient-to-br from-amber-400 to-orange-400",
      onClick: () => handleFeatureClick('photo-gallery')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 relative overflow-hidden">
      {/* Floating celebration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce animation-delay-300">🎊</div>
        <div className="absolute top-32 right-20 text-3xl animate-pulse animation-delay-700">✨</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-spin-slow animation-delay-1000">🎉</div>
        <div className="absolute bottom-60 right-16 text-2xl animate-bounce animation-delay-500">🥳</div>
      </div>

      {/* Header with Menu Toggle */}
      <div className="relative z-20 bg-white/90 backdrop-blur-sm shadow-lg border-b-4 border-gradient-to-r from-green-400 via-yellow-400 to-red-400">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden bg-gradient-to-r from-green-500 to-red-500 text-white p-2"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
              Event Dashboard 🎉
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Button
              variant="outline"
              onClick={() => handleFeatureClick('help')}
              className="hidden md:flex items-center space-x-2 border-2 border-green-300 text-green-700 hover:bg-green-50"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Sliding Menu */}
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
                className="w-full justify-start bg-gradient-to-r from-green-100 to-yellow-100 text-gray-800 hover:from-green-200 hover:to-yellow-200"
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
          <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome back, Party Planner! ✨
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ready to make some magic happen? Let's turn your ideas into unforgettable celebrations! 🚀
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
            <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center">
              <Sparkles className="w-8 h-8 mr-3 text-yellow-500" />
              Your Event Planning Toolkit
              <Sparkles className="w-8 h-8 ml-3 text-yellow-500" />
            </h2>
            <p className="text-gray-600 text-lg">
              Click any feature to get started with your celebration planning!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainFeatures.map((feature) => (
              <Card 
                key={feature.id}
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 border-0 shadow-lg group bg-white/80 backdrop-blur-sm"
                onClick={feature.onClick}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <feature.icon className="w-8 h-8 text-white" />
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
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center">
              <Heart className="w-6 h-6 mr-2 text-red-500" />
              Quick Actions
              <Heart className="w-6 h-6 ml-2 text-red-500" />
            </h2>
            <p className="text-gray-600">
              Jump to any feature you need right now!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-0 shadow-lg group bg-white/80 backdrop-blur-sm"
                onClick={action.onClick}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <action.icon className="w-8 h-8 text-white" />
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

        {/* Nigerian Celebration Showcase */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 border-0 shadow-2xl text-white">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-white">
                <span className="text-3xl">🇳🇬</span>
                <span className="text-2xl">Celebrate Nigerian Style! ✨</span>
                <span className="text-3xl">🇳🇬</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-white/90 mb-8 text-lg">
                From owambe to traditional ceremonies - we got you covered for every Nigerian celebration! 
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">💒</div>
                  <p>Wedding</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">🎂</div>
                  <p>Birthday</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">👶</div>
                  <p>Naming</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">🥁</div>
                  <p>Traditional</p>
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
