
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CheckCircle, 
  Users, 
  DollarSign, 
  Plus, 
  Clock, 
  Star,
  MessageSquare,
  TrendingUp,
  Heart,
  Zap,
  Target
} from 'lucide-react';

export const Dashboard = () => {
  const [activeEvent, setActiveEvent] = useState('birthday-party');

  const events = [
    {
      id: 'birthday-party',
      name: "Sarah's 25th Birthday Bash",
      date: '2024-07-15',
      daysLeft: 23,
      progress: 65,
      budget: { spent: 45000, total: 80000 },
      tasks: { completed: 13, total: 20 },
      guests: { confirmed: 28, total: 35 },
      type: 'birthday',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'wedding',
      name: "Kemi & David's Wedding",
      date: '2024-08-20',
      daysLeft: 58,
      progress: 40,
      budget: { spent: 250000, total: 500000 },
      tasks: { completed: 8, total: 25 },
      guests: { confirmed: 85, total: 120 },
      type: 'wedding',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const currentEvent = events.find(e => e.id === activeEvent) || events[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span>Hey there, party planner! 👋</span>
            </h1>
            <p className="text-gray-600 mt-1">You're doing amazing! Let's make some magic happen ✨</p>
          </div>
          
          <Button className="bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Plus className="w-5 h-5 mr-2" />
            New Event 🎉
          </Button>
        </div>

        {/* Event Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setActiveEvent(event.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeEvent === event.id
                  ? 'bg-white text-coral-600 shadow-md'
                  : 'text-gray-600 hover:text-coral-600 hover:bg-white/50'
              }`}
            >
              {event.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header Card */}
          <Card className="overflow-hidden">
            <div className={`h-24 bg-gradient-to-r ${currentEvent.color} relative`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-xl font-bold">{currentEvent.name}</h2>
                <p className="text-white/90 text-sm">
                  {currentEvent.daysLeft} days to go! Almost party time! 🎊
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{currentEvent.progress}%</div>
                  <div className="text-sm text-gray-600">Complete</div>
                  <Progress value={currentEvent.progress} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {currentEvent.tasks.completed}/{currentEvent.tasks.total}
                  </div>
                  <div className="text-sm text-gray-600">Tasks Done ✅</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    ₦{(currentEvent.budget.spent / 1000).toFixed(0)}k
                  </div>
                  <div className="text-sm text-gray-600">Budget Used</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Tasks"
              subtitle="3 pending"
              color="bg-emerald-100 text-emerald-700"
              onClick={() => {}}
            />
            <QuickActionCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Budget"
              subtitle="₦35k left"
              color="bg-yellow-100 text-yellow-700"
              onClick={() => {}}
            />
            <QuickActionCard
              icon={<Users className="w-6 h-6" />}
              title="Guests"
              subtitle="7 need RSVP"
              color="bg-blue-100 text-blue-700"
              onClick={() => {}}
            />
            <QuickActionCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="WhatsApp"
              subtitle="Share update"
              color="bg-green-100 text-green-700"
              onClick={() => {}}
            />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-coral-500" />
                <span>Recent Activity</span>
                <Badge className="bg-coral-100 text-coral-700">Live 🔴</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  icon="🎂"
                  title="Cake ordered from Sweet Dreams Bakery"
                  time="2 hours ago"
                  celebration
                />
                <ActivityItem
                  icon="✅"
                  title="Sarah confirmed the guest list"
                  time="5 hours ago"
                />
                <ActivityItem
                  icon="💰"
                  title="Added ₦15,000 for decorations"
                  time="1 day ago"
                />
                <ActivityItem
                  icon="📱"
                  title="Sent WhatsApp invites to family group"
                  time="2 days ago"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>Coming Up</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <DeadlineItem
                  task="Confirm venue booking"
                  daysLeft={3}
                  priority="high"
                />
                <DeadlineItem
                  task="Send final guest count"
                  daysLeft={7}
                  priority="medium"
                />
                <DeadlineItem
                  task="Order party favors"
                  daysLeft={12}
                  priority="low"
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-500" />
                <span>Budget Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className="font-semibold">₦{(currentEvent.budget.spent / 1000).toFixed(0)}k</span>
                </div>
                <Progress 
                  value={(currentEvent.budget.spent / currentEvent.budget.total) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-semibold text-green-600">
                    ₦{((currentEvent.budget.total - currentEvent.budget.spent) / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-700">
                    💚 You're staying within budget! Keep it up!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <span>Your Squad</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-medium text-sm">Sarah (You)</div>
                    <div className="text-xs text-gray-500">Event Host</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    K
                  </div>
                  <div>
                    <div className="font-medium text-sm">Kemi</div>
                    <div className="text-xs text-gray-500">Co-planner</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Friends
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Motivation Card */}
          <Card className="bg-gradient-to-br from-coral-50 to-pink-50 border-coral-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3 animate-bounce">🌟</div>
              <h3 className="font-bold text-coral-800 mb-2">You've got this!</h3>
              <p className="text-sm text-coral-700">
                You're {currentEvent.progress}% done! The party is going to be absolutely amazing! 🎉
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ icon, title, subtitle, color, onClick }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}) => (
  <Card 
    className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
    onClick={onClick}
  >
    <CardContent className="p-4 text-center">
      <div className={`w-12 h-12 mx-auto rounded-full ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
      <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
    </CardContent>
  </Card>
);

const ActivityItem = ({ icon, title, time, celebration = false }: {
  icon: string;
  title: string;
  time: string;
  celebration?: boolean;
}) => (
  <div className={`flex items-center space-x-3 p-3 rounded-lg ${celebration ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
    <span className="text-xl">{icon}</span>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
    {celebration && <span className="text-yellow-500 animate-bounce">🎉</span>}
  </div>
);

const DeadlineItem = ({ task, daysLeft, priority }: {
  task: string;
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
}) => {
  const colorMap = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-orange-600 bg-orange-50',
    low: 'text-green-600 bg-green-50'
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="text-sm font-medium text-gray-800">{task}</p>
        <p className="text-xs text-gray-500">{daysLeft} days left</p>
      </div>
      <Badge className={`text-xs ${colorMap[priority]}`}>
        {priority}
      </Badge>
    </div>
  );
};
