
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Settings, Trash2 } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  event_time: string;
  venue: string;
  expected_guests: number;
  budget: number;
  created_at: string;
}

interface EventCardProps {
  event: Event;
  onEventSelect: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventCard = ({ event, onEventSelect, onDeleteEvent }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-800 truncate">{event.name}</span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEventSelect(event)}
              className="hover:bg-blue-100"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteEvent(event.id)}
              className="hover:bg-red-100 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
          <span>{formatDate(event.event_date)}</span>
          {event.event_time && <span className="ml-2">at {event.event_time}</span>}
        </div>
        
        {event.venue && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-green-500" />
            <span className="truncate">{event.venue}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-purple-500" />
          <span>{event.expected_guests} expected guests</span>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-medium text-gray-700">
            Budget: ${event.budget?.toLocaleString() || '0'}
          </span>
          <Button
            onClick={() => onEventSelect(event)}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
