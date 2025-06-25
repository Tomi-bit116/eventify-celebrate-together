
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Calendar, Users, CheckCircle, AlertTriangle } from 'lucide-react';

interface TimelinePageProps {
  onBack: () => void;
}

interface TimelineEvent {
  id: string;
  name: string;
  date: string;
  type: string;
  status: 'upcoming' | 'this-week' | 'overdue';
  daysUntil: number;
  completionRate: number;
  emoji: string;
  color: string;
}

export const TimelinePage = ({ onBack }: TimelinePageProps) => {
  const [timelineEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      name: 'John\'s 30th Birthday',
      date: '2024-11-15',
      type: 'Birthday Party',
      status: 'this-week',
      daysUntil: 3,
      completionRate: 75,
      emoji: '🎂',
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: '2',
      name: 'Sarah\'s Wedding',
      date: '2024-12-25',
      type: 'Wedding',
      status: 'upcoming',
      daysUntil: 40,
      completionRate: 45,
      emoji: '💒',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: '3',
      name: 'Office Holiday Party',
      date: '2024-12-20',
      type: 'Corporate Event',
      status: 'upcoming',
      daysUntil: 35,
      completionRate: 20,
      emoji: '🎉',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: '4',
      name: 'Baby Shower Follow-up',
      date: '2024-11-10',
      type: 'Follow-up Tasks',
      status: 'overdue',
      daysUntil: -2,
      completionRate: 85,
      emoji: '🍼',
      color: 'from-yellow-400 to-orange-500'
    }
  ]);

  const getStatusInfo = (status: string, daysUntil: number) => {
    switch (status) {
      case 'this-week':
        return {
          badge: 'This Week',
          badgeColor: 'bg-blue-100 text-blue-800',
          icon: AlertTriangle,
          iconColor: 'text-blue-600'
        };
      case 'overdue':
        return {
          badge: 'Overdue',
          badgeColor: 'bg-red-100 text-red-800',
          icon: AlertTriangle,
          iconColor: 'text-red-600'
        };
      default:
        return {
          badge: `${daysUntil} days`,
          badgeColor: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupedEvents = {
    overdue: timelineEvents.filter(e => e.status === 'overdue'),
    thisWeek: timelineEvents.filter(e => e.status === 'this-week'),
    upcoming: timelineEvents.filter(e => e.status === 'upcoming')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
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
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              Event Timeline
            </h1>
          </div>
        </div>

        {/* Overdue Events */}
        {groupedEvents.overdue.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Overdue ({groupedEvents.overdue.length})
            </h2>
            <div className="space-y-4">
              {groupedEvents.overdue.map((event) => {
                const statusInfo = getStatusInfo(event.status, event.daysUntil);
                return (
                  <Card key={event.id} className="border-l-4 border-l-red-400 shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}>
                            <span className="text-2xl">{event.emoji}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{event.name}</h3>
                            <p className="text-sm text-gray-600">{event.type}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.badgeColor}`}>
                          {statusInfo.badge}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-green-600" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${event.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{event.completionRate}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* This Week Events */}
        {groupedEvents.thisWeek.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              This Week ({groupedEvents.thisWeek.length})
            </h2>
            <div className="space-y-4">
              {groupedEvents.thisWeek.map((event) => {
                const statusInfo = getStatusInfo(event.status, event.daysUntil);
                return (
                  <Card key={event.id} className="border-l-4 border-l-blue-400 shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}>
                            <span className="text-2xl">{event.emoji}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{event.name}</h3>
                            <p className="text-sm text-gray-600">{event.type}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.badgeColor}`}>
                          {statusInfo.badge}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-green-600" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${event.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{event.completionRate}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {groupedEvents.upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Upcoming ({groupedEvents.upcoming.length})
            </h2>
            <div className="space-y-4">
              {groupedEvents.upcoming.map((event) => {
                const statusInfo = getStatusInfo(event.status, event.daysUntil);
                return (
                  <Card key={event.id} className="border-l-4 border-l-green-400 shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}>
                            <span className="text-2xl">{event.emoji}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{event.name}</h3>
                            <p className="text-sm text-gray-600">{event.type}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.badgeColor}`}>
                          {statusInfo.badge}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-green-600" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${event.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{event.completionRate}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
