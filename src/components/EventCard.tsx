
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    name: string;
    date: string;
    venue?: string;
    description?: string;
    budget?: number;
    guests?: number;
    image?: string;
  };
  onSelect: (event: any) => void;
}

export const EventCard = ({ event, onSelect }: EventCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => onSelect(event)}>
      {event.image && (
        <div className="h-48 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${event.image})` }} />
      )}
      <CardHeader>
        <CardTitle className="text-lg">{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(event.date).toLocaleDateString()}
        </div>
        {event.venue && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {event.venue}
          </div>
        )}
        {event.guests && (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {event.guests} guests
          </div>
        )}
        {event.budget && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            ${event.budget}
          </div>
        )}
        <p className="text-sm text-gray-500 mt-2">{event.description}</p>
        <Button className="w-full mt-4" onClick={() => onSelect(event)}>
          Manage Event
        </Button>
      </CardContent>
    </Card>
  );
};
