
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageCircle, Send, Phone, User, Clock } from 'lucide-react';
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
}

export const WhatsAppIntegrationPage = ({ onBack }: WhatsAppIntegrationPageProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [messageData, setMessageData] = useState({
    recipient_phone: '',
    recipient_name: '',
    message_content: '',
    event_id: ''
  });

  const messageTemplates = [
    {
      name: 'Event Invitation',
      content: 'Hi {name}! You\'re invited to {event_name}. Looking forward to seeing you there!'
    },
    {
      name: 'Event Reminder',
      content: 'Hi {name}! Just a friendly reminder about {event_name} coming up. Don\'t forget to mark your calendar!'
    },
    {
      name: 'RSVP Request',
      content: 'Hi {name}! Please confirm your attendance for {event_name}. Reply with YES or NO.'
    },
    {
      name: 'Thank You',
      content: 'Hi {name}! Thank you for attending {event_name}. Hope you had a great time!'
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
        .select('id, name')
        .eq('user_id', user.id);

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Fetch WhatsApp messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load WhatsApp data');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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
      toast.success('Message sent successfully! (Note: This is a demo - no actual WhatsApp message was sent)');
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

  const useTemplate = (template: string) => {
    setMessageData({...messageData, message_content: template});
  };

  const getEventName = (eventId: string) => {
    if (!eventId) return 'General Message';
    const event = events.find(e => e.id === eventId);
    return event?.name || 'Unknown Event';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading WhatsApp integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                WhatsApp Integration
              </h1>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowSendModal(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white w-full sm:w-auto"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>

        {/* Messages History */}
        {messages.length === 0 ? (
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages sent yet</h3>
              <p className="text-gray-600 mb-6">Start sending WhatsApp messages to your event guests!</p>
              <Button 
                onClick={() => setShowSendModal(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send First Message
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <Card key={message.id} className="shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{message.recipient_name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-1" />
                          <span>{message.recipient_phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDateTime(message.sent_at)}</span>
                      </div>
                      <span className="text-xs text-gray-500">{getEventName(message.event_id)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{message.message_content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Send Message Modal */}
        <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
          <DialogContent className="max-w-lg mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                Send WhatsApp Message
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={sendMessage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event_select">Associated Event (Optional)</Label>
                <Select value={messageData.event_id} onValueChange={(value) => setMessageData({...messageData, event_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event or leave blank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">General Message</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient_name">Recipient Name</Label>
                <Input
                  id="recipient_name"
                  placeholder="John Doe"
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
                  placeholder="+1234567890"
                  value={messageData.recipient_phone}
                  onChange={(e) => setMessageData({...messageData, recipient_phone: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Message Templates</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {messageTemplates.map((template, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => useTemplate(template.content)}
                      className="text-left justify-start h-auto p-2"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message_content">Message</Label>
                <Textarea
                  id="message_content"
                  placeholder="Type your message here..."
                  value={messageData.message_content}
                  onChange={(e) => setMessageData({...messageData, message_content: e.target.value})}
                  rows={4}
                  required
                />
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
