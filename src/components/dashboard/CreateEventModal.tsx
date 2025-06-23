
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (eventData: any) => void;
}

export const CreateEventModal = ({ isOpen, onClose, onEventCreated }: CreateEventModalProps) => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    expectedGuests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEventCreated(eventData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
            Create Your Event 🎉
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Event Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Sarah's Birthday Party"
              value={eventData.name}
              onChange={(e) => setEventData({...eventData, name: e.target.value})}
              required
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({...eventData, date: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4 inline mr-1" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={eventData.time}
                onChange={(e) => setEventData({...eventData, time: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue" className="text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 inline mr-1" />
              Venue
            </Label>
            <Input
              id="venue"
              placeholder="e.g., Central Park, New York"
              value={eventData.venue}
              onChange={(e) => setEventData({...eventData, venue: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests" className="text-sm font-medium text-gray-700">
              <Users className="w-4 h-4 inline mr-1" />
              Expected Guests
            </Label>
            <Input
              id="guests"
              type="number"
              placeholder="e.g., 50"
              value={eventData.expectedGuests}
              onChange={(e) => setEventData({...eventData, expectedGuests: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white"
            >
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
