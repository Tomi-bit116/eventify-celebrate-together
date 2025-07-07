
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Clock, MapPin, Users, DollarSign, Share2, Copy, MessageSquare, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: any) => void;
  eventToEdit?: any;
}

export const CreateEventModal = ({ isOpen, onClose, onEventCreated, eventToEdit }: CreateEventModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    event_date: '',
    event_time: '',
    venue: '',
    expected_guests: '',
    budget: ''
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name || '',
        description: eventToEdit.description || '',
        event_date: eventToEdit.event_date || '',
        event_time: eventToEdit.event_time || '',
        venue: eventToEdit.venue || '',
        expected_guests: eventToEdit.expected_guests?.toString() || '',
        budget: eventToEdit.budget?.toString() || ''
      });
      setShowShareOptions(true); // Show share options when editing
    } else {
      setFormData({
        name: '',
        description: '',
        event_date: '',
        event_time: '',
        venue: '',
        expected_guests: '',
        budget: ''
      });
      setShowShareOptions(false);
    }
  }, [eventToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const eventData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        event_date: formData.event_date,
        event_time: formData.event_time || null,
        venue: formData.venue || null,
        expected_guests: parseInt(formData.expected_guests) || 0,
        budget: parseFloat(formData.budget) || 0
      };

      let result;
      if (eventToEdit) {
        // Update existing event
        const { data, error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', eventToEdit.id)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        toast.success('Event updated successfully! 🎉');
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        toast.success('Event created successfully! 🎉');
      }

      onEventCreated(result);
      setShowShareOptions(true);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleShareViaWhatsApp = () => {
    const eventDetails = `🎉 You're invited to ${formData.name}!\n\n📅 Date: ${new Date(formData.event_date).toLocaleDateString()}\n⏰ Time: ${formData.event_time || 'TBA'}\n📍 Venue: ${formData.venue || 'TBA'}\n\nRSVP now!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(eventDetails)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Shared via WhatsApp!');
  };

  const handleShareViaEmail = () => {
    const subject = `Invitation to ${formData.name}`;
    const body = `🎉 You're invited to ${formData.name}!\n\nDate: ${new Date(formData.event_date).toLocaleDateString()}\nTime: ${formData.event_time || 'TBA'}\nVenue: ${formData.venue || 'TBA'}\n\nDescription: ${formData.description}\n\nRSVP now!`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
    toast.success('Email invitation opened!');
  };

  const handleCopyEventDetails = () => {
    const eventDetails = `🎉 ${formData.name}\n\n📅 Date: ${new Date(formData.event_date).toLocaleDateString()}\n⏰ Time: ${formData.event_time || 'TBA'}\n📍 Venue: ${formData.venue || 'TBA'}\n\nDescription: ${formData.description}`;
    navigator.clipboard.writeText(eventDetails);
    toast.success('Event details copied to clipboard!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-2xl mr-2">🎉</span>
            {eventToEdit ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Event Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter event name"
              required
              className="mt-1"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_date" className="text-sm font-medium text-gray-700 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Event Date *
              </Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="event_time" className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Event Time
              </Label>
              <Input
                id="event_time"
                type="time"
                value={formData.event_time}
                onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                className="mt-1"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <Label htmlFor="venue" className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Venue
            </Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
              placeholder="Enter event venue"
              className="mt-1"
            />
          </div>

          {/* Expected Guests and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expected_guests" className="text-sm font-medium text-gray-700 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Number of Guests
              </Label>
              <Input
                id="expected_guests"
                type="number"
                value={formData.expected_guests}
                onChange={(e) => setFormData({...formData, expected_guests: e.target.value})}
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="budget" className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Budget
              </Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter event description"
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white"
            >
              {loading ? 'Saving...' : (eventToEdit ? 'Update Event' : 'Create Event')}
            </Button>

            {/* Share Options - Show after event is created/edited */}
            {showShareOptions && formData.name && formData.event_date && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Event
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    onClick={handleShareViaWhatsApp}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    type="button"
                    onClick={handleShareViaEmail}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCopyEventDetails}
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mt-4"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
