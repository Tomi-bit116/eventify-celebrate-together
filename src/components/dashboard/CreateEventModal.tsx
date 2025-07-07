
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Clock, Users, DollarSign, Share2, MessageSquare, Mail, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (eventData: any) => void;
}

export const CreateEventModal = ({ isOpen, onClose, onEventCreated }: CreateEventModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [eventData, setEventData] = useState({
    name: '',
    event_date: '',
    event_time: '',
    venue: '',
    description: '',
    expected_guests: '',
    budget: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create events');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          name: eventData.name,
          description: eventData.description,
          event_date: eventData.event_date,
          event_time: eventData.event_time || null,
          venue: eventData.venue || null,
          expected_guests: eventData.expected_guests ? parseInt(eventData.expected_guests) : 0,
          budget: eventData.budget ? parseFloat(eventData.budget) : 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        toast.error('Failed to create event');
        return;
      }

      toast.success('Event created successfully!');
      setCreatedEvent(data);
      onEventCreated(data);
      setShowShareOptions(true);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEventData({
      name: '',
      event_date: '',
      event_time: '',
      venue: '',
      description: '',
      expected_guests: '',
      budget: ''
    });
    setCreatedEvent(null);
    setShowShareOptions(false);
    onClose();
  };

  const shareViaWhatsApp = () => {
    if (!createdEvent) return;
    const message = `🎉 You're invited to ${createdEvent.name}!\n\n📅 Date: ${new Date(createdEvent.event_date).toLocaleDateString()}\n📍 Venue: ${createdEvent.venue || 'TBA'}\n\nRSVP now!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Shared via WhatsApp!');
  };

  const shareViaEmail = () => {
    if (!createdEvent) return;
    const subject = `Invitation to ${createdEvent.name}`;
    const body = `🎉 You're invited to ${createdEvent.name}!\n\n📅 Date: ${new Date(createdEvent.event_date).toLocaleDateString()}\n📍 Venue: ${createdEvent.venue || 'TBA'}\n\nRSVP now!`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
    toast.success('Email invitation opened!');
  };

  const copyToClipboard = () => {
    if (!createdEvent) return;
    const eventDetails = `🎉 You're invited to ${createdEvent.name}!\n\n📅 Date: ${new Date(createdEvent.event_date).toLocaleDateString()}\n📍 Venue: ${createdEvent.venue || 'TBA'}\n\nRSVP now!`;
    navigator.clipboard.writeText(eventDetails);
    toast.success('Event details copied to clipboard!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
            {showShareOptions ? '🎉 Event Created Successfully!' : 'Create Your Event 🎉'}
          </DialogTitle>
        </DialogHeader>
        
        {showShareOptions && createdEvent ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-coral-50 to-teal-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{createdEvent.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-coral-600" />
                  <span>{new Date(createdEvent.event_date).toLocaleDateString()}</span>
                  {createdEvent.event_time && <span className="ml-2">at {createdEvent.event_time}</span>}
                </div>
                {createdEvent.venue && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                    <span>{createdEvent.venue}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>{createdEvent.expected_guests} expected guests</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-gold-600" />
                  <span>Budget: ${createdEvent.budget?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Share Your Event</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={shareViaWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center space-x-2 py-3"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>WhatsApp</span>
                </Button>
                
                <Button
                  onClick={shareViaEmail}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-3"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </Button>
                
                <Button
                  onClick={copyToClipboard}
                  className="bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center space-x-2 py-3"
                >
                  <Copy className="w-5 h-5" />
                  <span>Copy Details</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white px-8"
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Event Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Sarah's Birthday Party"
                  value={eventData.name}
                  onChange={(e) => setEventData({...eventData, name: e.target.value})}
                  required
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label htmlFor="event_date" className="text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date *
                </Label>
                <Input
                  id="event_date"
                  type="date"
                  value={eventData.event_date}
                  onChange={(e) => setEventData({...eventData, event_date: e.target.value})}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="event_time" className="text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time
                </Label>
                <Input
                  id="event_time"
                  type="time"
                  value={eventData.event_time}
                  onChange={(e) => setEventData({...eventData, event_time: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="venue" className="text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Venue
                </Label>
                <Input
                  id="venue"
                  placeholder="e.g., Central Park, New York"
                  value={eventData.venue}
                  onChange={(e) => setEventData({...eventData, venue: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
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
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4 inline mr-1" />
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
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your event..."
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
