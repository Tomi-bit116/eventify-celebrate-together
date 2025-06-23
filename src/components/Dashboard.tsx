
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  CheckCircle, 
  Users, 
  DollarSign, 
  Plus, 
  MessageSquare,
  BookOpen,
  Settings,
  Heart,
  Sparkles
} from 'lucide-react';
import { FeatureCard } from './dashboard/FeatureCard';

export const Dashboard = () => {
  const handleFeatureClick = (feature: string) => {
    console.log(`Navigating to ${feature}`);
    // Navigation logic will be implemented later
  };

  const handleCreateEvent = () => {
    console.log('Creating new event');
    // Event creation logic will be implemented later
  };

  const features = [
    {
      icon: Calendar,
      title: "My Events",
      description: "View and manage all your upcoming celebrations",
      color: "bg-gradient-to-br from-coral-400 to-coral-500",
      id: "events"
    },
    {
      icon: CheckCircle,
      title: "Tasks",
      description: "Keep track of everything on your to-do list",
      color: "bg-gradient-to-br from-emerald-400 to-emerald-500",
      id: "tasks"
    },
    {
      icon: DollarSign,
      title: "Budget",
      description: "Track expenses and stay within your budget",
      color: "bg-gradient-to-br from-gold-400 to-yellow-500",
      id: "budget"
    },
    {
      icon: Users,
      title: "Guest List",
      description: "Manage invitations and track RSVPs",
      color: "bg-gradient-to-br from-blue-400 to-blue-500",
      id: "guests"
    },
    {
      icon: MessageSquare,
      title: "Vendors",
      description: "Connect with trusted event service providers",
      color: "bg-gradient-to-br from-purple-400 to-purple-500",
      id: "vendors"
    },
    {
      icon: BookOpen,
      title: "Templates",
      description: "Get started with pre-made event templates",
      color: "bg-gradient-to-br from-teal-400 to-teal-500",
      id: "templates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Eventify!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your friendly event planning companion is here to help! ✨
          </p>
          
          <Button 
            onClick={handleCreateEvent}
            className="bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white rounded-full px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-6 h-6 mr-2" />
            Create Your First Event 🚀
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Everything you need to plan amazing events 💫
          </h2>
          <p className="text-gray-600">
            Tap any feature below to explore what Eventify can do for you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              onClick={() => handleFeatureClick(feature.id)}
            />
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <Card className="bg-gradient-to-br from-violet-50 to-pink-50 border-violet-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-violet-800">
              <Sparkles className="w-6 h-6" />
              <span>Want to see Eventify in action?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-violet-700 mb-6">
              Check out our demo event to see all the amazing features working together! 
            </p>
            <Button 
              onClick={() => handleFeatureClick('demo')}
              variant="outline"
              className="border-violet-300 text-violet-700 hover:bg-violet-100 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Explore Demo Event ✨
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Tips */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-emerald-800">
              <Heart className="w-6 h-6" />
              <span>Getting Started Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-semibold text-emerald-800">Start with a template</h4>
                  <p className="text-sm text-emerald-700">
                    Save time by using our pre-made event templates for birthdays, weddings, and more!
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h4 className="font-semibold text-emerald-800">Invite your squad</h4>
                  <p className="text-sm text-emerald-700">
                    Planning is more fun together! Invite friends and family to help you organize.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="font-semibold text-emerald-800">Share via WhatsApp</h4>
                  <p className="text-sm text-emerald-700">
                    Easily share updates, guest lists, and event details with your WhatsApp groups.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
