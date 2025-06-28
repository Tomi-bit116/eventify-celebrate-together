import { useState } from 'react';
import { MainMenu } from '@/components/MainMenu';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, CheckSquare, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardProps {
  // Add any props you want to pass to the dashboard
}

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

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
  };

  const progressData = [
    { label: 'Planning', value: 75, color: 'bg-yellow-500' },
    { label: 'Budget', value: 50, color: 'bg-green-500' },
    { label: 'Guests', value: 90, color: 'bg-lime-500' },
  ];

  const quickStats = [
    { label: 'Days Left', value: 28, icon: Calendar },
    { label: 'Tasks Due', value: 5, icon: ListChecks },
    { label: 'In Budget', value: 'Yes', icon: CheckSquare },
    { label: 'Time to Party', value: '7:00 PM', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50">
      {/* Header Section */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
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

        <Button
          onClick={handleSignOut}
          variant="outline"
          className="hidden md:flex items-center gap-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
        >
          Sign Out
        </Button>
      </header>
      
      <div className="flex h-[calc(100vh-80px)]">
        <MainMenu 
          onFeatureClick={handleFeatureClick} 
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="flex-1 p-6 overflow-y-auto lg:ml-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome back{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ''}! 🎉
                </h1>
                <p className="text-gray-600">
                  Ready to plan your next amazing celebration?
                </p>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="hidden md:flex items-center gap-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              >
                Sign Out
              </Button>
            </div>
            
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-lime-400 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{stat.label}</h4>
                      <p className="text-sm text-gray-600">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {activeFeature ? `Feature: ${activeFeature}` : 'Dashboard Overview'}
            </h2>
            <p className="text-gray-600">
              {activeFeature ? `You are currently viewing the ${activeFeature} feature.` : 'Select a feature from the menu to start planning your event.'}
            </p>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={() => {}} />
    </div>
  );
};
