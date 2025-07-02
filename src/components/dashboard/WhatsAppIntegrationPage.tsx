
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageCircle, Send, Phone, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WhatsAppIntegrationPageProps {
  onBack: () => void;
}

interface WhatsAppMessage {
  id: string;
  recipient_phone: string;
  recipient_name: string;
  message_content: string;
  sent_at: string;
  event_id: string;
}

interface Event {
  id: string;
  name: string;
  event_date: string;
  event_time: string;
  venue: string;
}

interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export const WhatsAppIntegrationPage = ({ onBack }: WhatsAppIntegrationPageProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [messageData, setMessageData] = useState({
    recipient_phone: '',
    recipient_name: '',
    message_content: '',
    event_id: ''
  });

  const messageTemplates = [
    {
      name: 'Event Invitation',
      content: "Hi {name}! You're invited to {event_name} on {date} at {venue}. Hope to see you there! 🎉"
    },
    {
      name: 'Event Reminder',
      content: "Hey {name}! Just a friendly reminder about {event_name} happening on {date} at {venue}. See you there! ⏰"
    },
    {
      name: 'Thank You',
      content: "Thank you {name} for attending {event_name}! It was great having you there. Hope you had a wonderful time! 🙏"
    },
    {
      name: 'RSVP Request',
      content: "Hi {name}! Please confirm your attendance for {event_name} on {date}. Reply with YES or NO. Thanks! 📝"
    }
  ];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, name, event_date, event_time, venue')
        .eq('user_id', user.id);

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

      // Fetch guests for selected event
      if (selectedEvent) {
        const { data: guestsData, error: guestsError } = await supabase
          .from('guests')
          .select('id, name, phone, email')
          .eq('event_id', selectedEvent)
          .eq('user_id', user.id);

        if (guestsError) throw guestsError;
        setGuests(guestsData?.filter(g => g.phone) || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load WhatsApp data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEvent && user) {
      fetchGuests();
    }
  }, [selectedEvent, user]);

  const fetchGuests = async () => {
    if (!user || !selectedEvent) return;

    try {
      const { data: guestsData, error } = await supabase
        .from('guests')
        .select('id, name, phone, email')
        .eq('event_id', selectedEvent)
        .eq('user_id', user.id);

      if (error) throw error;
      setGuests(guestsData?.filter(g => g.phone) || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Simulate sending WhatsApp message (in real implementation, this would use WhatsApp Business API)
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .insert({
          user_id: user.id,
          event_id: messageData.event_id || null,
          recipient_phone: messageData.recipient_phone,
          recipient_name: messageData.recipient_name,
          message_content: messageData.message_content
        })
        .select()
        .single();

      if (error) throw error;

      setMessages([data, ...messages]);
      toast.success('Message sent successfully! (Demo mode)');
      setShowSendModal(false);
      setMessageData({
        recipient_phone: '',
        recipient_name: '',
        message_content: '',
        event_id: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const sendBulkMessage = async (guestIds: string[]) => {
    if (!user || !selectedEvent) return;

    const selectedGuests = guests.filter(g => guestIds.includes(g.id));
    const event = events.find(e => e.id === selectedEvent);
    
    if (!event) return;

    try {
      const messagePromises = selectedGuests.map(guest => {
        const personalizedMessage = messageData.message_content
          .replace('{name}', guest.name)
          .replace('{event_name}', event.name)
          .replace('{date}', new Date(event.event_date).toLocaleDateString())
          .replace('{venue}', event.venue || '');

        return supabase
          .from('whatsapp_messages')
          .insert({
            user_id: user.id,
            event_id: selectedEvent,
            recipient_phone: guest.phone,
            recipient_name: guest.name,
            message_content: personalizedMessage
          });
      });

      await Promise.all(messagePromises);
      
      toast.success(`Messages sent to ${selectedGuests.length} guests! (Demo mode)`);
      fetchData(); // Refresh messages
      setShowSendModal(false);
    } catch (error) {
      console.error('Error sending bulk messages:', error);
      toast.error('Failed to send bulk messages');
    }
  };

  const applyTemplate = (template: string) => {
    setMessageData({...messageData, message_content: template});
  };

  const getEventName = (eventId: string) => {
    if (!eventId) return 'Direct Message';
    const event = events.find(e => e.id === eventId);
    return event?.name || 'Unknown Event';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading WhatsApp integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="mr-4 hover:bg-green-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                WhatsApp Integration
              </h1>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowSendModal(true)}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>

        {/* Info Card */}
        <Card className="mb-6 shadow-lg bg-white/90 backdrop-blur-sm border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <MessageCircle className="w-8 h-8 text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">WhatsApp Business Integration</h3>
                <p className="text-gray-600 text-sm">
                  This is a demo implementation. In production, this would integrate with WhatsApp Business API 
                  to send real messages to your guests. Currently, messages are logged for demonstration purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Message History</h2>
          
          {messages.length === 0 ? (
            <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages sent yet</h3>
                <p className="text-gray-600 mb-6">Start communicating with your guests via WhatsApp!</p>
                <Button 
                  onClick={() => setShowSendModal(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send First Message
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{message.recipient_name}</h3>
                          <p className="text-sm text-gray-600">{message.recipient_phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{getEventName(message.event_id)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(message.sent_at).toLocaleDateString()} {new Date(message.sent_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-700">{message.message_content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Send Message Modal */}
        <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
          <DialogContent className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                Send WhatsApp Message
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Message Templates */}
              <div className="space-y-3">
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-2 gap-2">
                  {messageTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template.content)}
                      className="text-left justify-start h-auto p-2"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <form onSubmit={sendMessage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event_select">Event (Optional)</Label>
                  <Select value={messageData.event_id} onValueChange={(value) => {
                    setMessageData({...messageData, event_id: value});
                    setSelectedEvent(value);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event or send direct message" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Direct Message</SelectItem>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEvent && guests.length > 0 && (
                  <div className="space-y-2">
                    <Label>Send to Event Guests</Label>
                    <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-2">
                      {guests.map((guest) => (
                        <div key={guest.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`guest-${guest.id}`}
                            className="rounded"
                          />
                          <label htmlFor={`guest-${guest.id}`} className="text-sm flex-1">
                            {guest.name} - {guest.phone}
                          </label>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>;
                        const selectedIds = Array.from(checkedBoxes).map(cb => cb.id.replace('guest-', ''));
                        if (selectedIds.length > 0) {
                          sendBulkMessage(selectedIds);
                        }
                      }}
                      className="w-full"
                    >
                      Send to Selected Guests
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient_name">Recipient Name</Label>
                    <Input
                      id="recipient_name"
                      placeholder="Guest name"
                      value={messageData.recipient_name}
                      onChange={(e) => setMessageData({...messageData, recipient_name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient_phone">Phone Number</Label>
                    <Input
                      id="recipient_phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={messageData.recipient_phone}
                      onChange={(e) => setMessageData({...messageData, recipient_phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message_content">Message</Label>
                  <Textarea
                    id="message_content"
                    placeholder="Type your message here..."
                    value={messageData.message_content}
                    onChange={(e) => setMessageData({...messageData, message_content: e.target.value})}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Use {'{name}'}, {'{event_name}'}, {'{date}'}, {'{venue}'} for personalization
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSendModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
