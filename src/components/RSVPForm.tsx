
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';

interface EventData {
  id: string;
  name: string;
  description: string;
  event_date: string;
  event_time: string;
  venue: string;
  expected_guests: number;
}

export const RSVPForm = () => {
  const { invitationCode } = useParams();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [invitationId, setInvitationId] = useState<string>('');
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    rsvpStatus: 'yes'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!invitationCode) return;

      try {
        // First, get the invitation details
        const { data: invitation, error: invitationError } = await supabase
          .from('invitations')
          .select('id, event_id, is_active, expires_at')
          .eq('invitation_code', invitationCode)
          .single();

        if (invitationError || !invitation) {
          toast.error('Invalid invitation link');
          return;
        }

        if (!invitation.is_active) {
          toast.error('This invitation is no longer active');
          return;
        }

        if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
          toast.error('This invitation has expired');
          return;
        }

        setInvitationId(invitation.id);

        // Then get the event details
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', invitation.event_id)
          .single();

        if (eventError || !event) {
          toast.error('Event not found');
          return;
        }

        setEventData(event);
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [invitationCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData || !invitationId) {
      toast.error('Missing event information');
      return;
    }

    if (!formData.guestName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('rsvps')
        .insert({
          invitation_id: invitationId,
          event_id: eventData.id,
          guest_name: formData.guestName.trim(),
          guest_email: formData.guestEmail.trim() || null,
          guest_phone: formData.guestPhone.trim() || null,
          rsvp_status: formData.rsvpStatus
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('RSVP submitted successfully!');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast.error('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading event details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">Event not found or invitation expired</p>
            <p className="text-gray-600 text-sm">Please check your invitation link and try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-4">
              Your RSVP for <strong>{eventData.name}</strong> has been received.
            </p>
            <p className="text-sm text-gray-500">
              We're excited to celebrate with you!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
            You're Invited! 🎉
          </CardTitle>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-coral-600">{eventData.name}</h3>
            {eventData.description && (
              <p className="text-gray-600 text-sm">{eventData.description}</p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Event Details */}
          <div className="bg-gradient-to-r from-coral-50 to-teal-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="w-4 h-4 text-coral-600" />
              <span className="font-medium text-gray-700">
                {new Date(eventData.event_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {eventData.event_time && (
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-4 h-4 text-teal-600" />
                <span className="text-gray-700">{eventData.event_time}</span>
              </div>
            )}
            
            {eventData.venue && (
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">{eventData.venue}</span>
              </div>
            )}
          </div>

          {/* RSVP Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="guestName" className="text-sm font-medium">
                Your Name *
              </Label>
              <Input
                id="guestName"
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="Enter your full name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="guestEmail" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="guestEmail"
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                placeholder="your.email@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="guestPhone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="guestPhone"
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">
                Will you be attending? *
              </Label>
              <RadioGroup
                value={formData.rsvpStatus}
                onValueChange={(value) => setFormData({ ...formData, rsvpStatus: value })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-green-50 transition-colors">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="flex-1 cursor-pointer">
                    <span className="font-medium text-green-700">✅ Yes, I'll be there!</span>
                    <p className="text-xs text-gray-600">Can't wait to celebrate with you</p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-yellow-50 transition-colors">
                  <RadioGroupItem value="maybe" id="maybe" />
                  <Label htmlFor="maybe" className="flex-1 cursor-pointer">
                    <span className="font-medium text-yellow-700">🤔 Maybe</span>
                    <p className="text-xs text-gray-600">I'll try my best to make it</p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-red-50 transition-colors">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="flex-1 cursor-pointer">
                    <span className="font-medium text-red-700">❌ Sorry, can't make it</span>
                    <p className="text-xs text-gray-600">Will be there in spirit</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white py-3"
            >
              {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
