
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Users, 
  DollarSign, 
  CheckCircle, 
  BarChart3,
  ArrowRight,
  Sparkles,
  Calendar,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { WorkflowStep } from './dashboard/WorkflowStep';

export const Dashboard = () => {
  const handleStepClick = (step: string) => {
    console.log(`Starting step: ${step}`);
    // Navigation logic will be implemented later
  };

  const handleCreateEvent = () => {
    console.log('Creating new event');
    // Event creation logic will be implemented later
  };

  const workflowSteps = [
    {
      id: 'create',
      title: "Create Event",
      description: "Start by setting up your event details and theme",
      icon: Plus,
      color: "bg-gradient-to-br from-coral-500 to-pink-500",
      hoverColor: "hover:from-coral-600 hover:to-pink-600",
      status: "ready" as const,
      step: 1
    },
    {
      id: 'guests',
      title: "Invite Guests",
      description: "Build your guest list and send out invitations",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-indigo-500",
      hoverColor: "hover:from-blue-600 hover:to-indigo-600",
      status: "pending" as const,
      step: 2
    },
    {
      id: 'budget',
      title: "Manage Budget",
      description: "Track expenses and stay within your spending limits",
      icon: DollarSign,
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      hoverColor: "hover:from-emerald-600 hover:to-teal-600",
      status: "pending" as const,
      step: 3
    },
    {
      id: 'tasks',
      title: "Track Tasks",
      description: "Organize your to-do list and never miss a detail",
      icon: CheckCircle,
      color: "bg-gradient-to-br from-purple-500 to-violet-500",
      hoverColor: "hover:from-purple-600 hover:to-violet-600",
      status: "pending" as const,
      step: 4
    },
    {
      id: 'analytics',
      title: "View Analytics",
      description: "Monitor progress and see how your event is shaping up",
      icon: BarChart3,
      color: "bg-gradient-to-br from-orange-500 to-red-500",
      hoverColor: "hover:from-orange-600 hover:to-red-600",
      status: "locked" as const,
      step: 5
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "My Events",
      description: "View all your celebrations",
      color: "bg-gradient-to-br from-rose-400 to-pink-400"
    },
    {
      icon: MessageSquare,
      title: "Vendors",
      description: "Connect with service providers",
      color: "bg-gradient-to-br from-cyan-400 to-blue-400"
    },
    {
      icon: BookOpen,
      title: "Templates",
      description: "Pre-made event templates",
      color: "bg-gradient-to-br from-amber-400 to-orange-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome back, Event Planner! ✨
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Let's make your next celebration unforgettable. Follow the workflow below to get started! 🚀
          </p>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your Event Planning Journey 🛤️
          </h2>
          <p className="text-gray-600 text-lg">
            Follow these steps to create the perfect celebration, one stage at a time!
          </p>
        </div>

        {/* Workflow Grid */}
        <div className="relative">
          {/* Connection Lines for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                <WorkflowStep
                  {...step}
                  onClick={() => handleStepClick(step.id)}
                />
                
                {/* Arrow for mobile */}
                {index < workflowSteps.length - 1 && (
                  <div className="flex justify-center mt-4 mb-4 lg:hidden">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Quick Actions 🚀
          </h2>
          <p className="text-gray-600">
            Jump to any feature you need right now!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-0 shadow-lg group"
              onClick={() => handleStepClick(action.title.toLowerCase().replace(' ', ''))}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
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

      {/* Demo Section */}
      <div className="max-w-5xl mx-auto mb-8">
        <Card className="bg-gradient-to-br from-violet-50 to-pink-50 border-violet-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-violet-800">
              <Sparkles className="w-7 h-7" />
              <span className="text-2xl">Ready to see magic happen? ✨</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-violet-700 mb-8 text-lg">
              Explore our demo event to see all the amazing features working together! 
              Perfect for getting familiar with the workflow before creating your own celebration.
            </p>
            <Button 
              onClick={() => handleStepClick('demo')}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-6 h-6 mr-2" />
              Explore Demo Event 🎊
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
