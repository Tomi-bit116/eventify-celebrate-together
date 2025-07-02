
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Clock, Users, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEventUpdated: (event: Event) => void;
}

export const EditEventModal = ({ isOpen, onClose, event, onEventUpdated }: EditEventModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    event_date: '',
    event_time: '',
    venue: '',
    description: '',
    expected_guests: '',
    budget: ''
  });

  useEffect(() => {
    if (event) {
      setEventData({
        name: event.name || '',
        event_date: event.event_date || '',
        event_time: event.event_time || '',
        venue: event.venue || '',
        description: event.description || '',
        expected_guests: event.expected_guests?.toString() || '',
        budget: event.budget?.toString() || ''
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !event) {
      toast.error('You must be logged in to edit events');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          name: eventData.name,
          description: eventData.description,
          event_date: eventData.event_date,
          event_time: eventData.event_time || null,
          venue: eventData.venue || null,
          expected_guests: eventData.expected_guests ? parseInt(eventData.expected_guests) : 0,
          budget: eventData.budget ? parseFloat(eventData.budget) : 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', event.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        toast.error('Failed to update event');
        return;
      }

      toast.success('Event updated successfully!');
      onEventUpdated(data);
      onClose();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
            <Edit className="w-6 h-6 text-blue-500" />
            <span>Edit Event</span>
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
              <Label htmlFor="event_date" className="text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </Label>
              <Input
                id="event_date"
                type="date"
                value={eventData.event_date}
                onChange={(e) => setEventData({...eventData, event_date: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event_time" className="text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4 inline mr-1" />
                Time
              </Label>
              <Input
                id="event_time"
                type="time"
                value={eventData.event_time}
                onChange={(e) => setEventData({...eventData, event_time: e.target.value})}
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us about your event..."
              value={eventData.description}
              onChange={(e) => setEventData({...eventData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expected_guests" className="text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 inline mr-1" />
                Expected Guests
              </Label>
              <Input
                id="expected_guests"
                type="number"
                placeholder="e.g., 50"
                value={eventData.expected_guests}
                onChange={(e) => setEventData({...eventData, expected_guests: e.target.value})}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                Budget ($)
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 1500"
                value={eventData.budget}
                onChange={(e) => setEventData({...eventData, budget: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
