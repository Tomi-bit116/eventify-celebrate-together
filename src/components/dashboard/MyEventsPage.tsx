
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Users, DollarSign, MapPin, Plus } from 'lucide-react';

interface MyEventsPageProps {
  onBack: () => void;
}

interface Event {
  id: string;
  name: string;
  date: string;
  type: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  guests: number;
  budget: number;
  venue: string;
  emoji: string;
  color: string;
}

export const MyEventsPage = ({ onBack }: MyEventsPageProps) => {
  const [events] = useState<Event[]>([
    {
      id: '1',
      name: 'Sarah\'s Wedding',
      date: '2024-12-25',
      type: 'Wedding',
      status: 'Planning',
      guests: 150,
      budget: 500000,
      venue: 'Golden Hall, Victoria Island',
      emoji: '💒',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: '2',
      name: 'John\'s 30th Birthday',
      date: '2024-11-15',
      type: 'Birthday',
      status: 'In Progress',
      guests: 50,
      budget: 100000,
      venue: 'Rooftop Lounge',
      emoji: '🎂',
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: '3',
      name: 'Baby Emma\'s Naming',
      date: '2024-10-20',
      type: 'Naming Ceremony',
      status: 'Completed',
      guests: 80,
      budget: 75000,
      venue: 'Family Home',
      emoji: '👶',
      color: 'from-green-400 to-teal-500'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-lime-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              My Events
            </h1>
          </div>
        </div>

        {/* Create New Event Button */}
        <div className="mb-8">
          <Button className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card 
              key={event.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white/90 backdrop-blur-sm group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl">{event.emoji}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <CardTitle className="text-xl text-gray-800 group-hover:text-gray-900 transition-colors">
                  {event.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{event.type}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  {event.venue}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1 text-green-600" />
                    {event.guests} guests
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    {formatCurrency(event.budget)}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white"
                  size="sm"
                >
                  Open Event
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <Card className="text-center p-12 bg-white/90 backdrop-blur-sm">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
            <p className="text-gray-500 mb-6">Start planning your first celebration!</p>
            <Button className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Event
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
