import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageCircle, Send, Phone, User, Clock, Users } from 'lucide-react';
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
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
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
      name: 'Vendor Inquiry',
      content: 'Hi {name}! I hope you\'re doing well. I\'m planning an event and would like to discuss your {service} services. Are you available for a quick chat?'
    },
    {
      name: 'Vendor Follow-up',
      content: 'Hi {name}! Thank you for discussing your services with me. Could you please send me a detailed quote for {service}?'
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

      // Fetch vendors
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id);

      if (vendorsError) throw vendorsError;
      setVendors(vendorsData || []);

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
      
      // Open WhatsApp with the message
      const phoneNumber = messageData.recipient_phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageData.message_content)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('Message logged and WhatsApp opened!');
      setShowSendModal(false);
      setShowVendorModal(false);
      setSelectedVendor(null);
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

  const handleVendorMessage = (vendor: any) => {
    setSelectedVendor(vendor);
    setMessageData({
      recipient_phone: vendor.contact_phone,
      recipient_name: vendor.name,
      message_content: `Hi ${vendor.name}! I hope you're doing well. I'm planning an event and would like to discuss your ${vendor.service_type} services. Are you available for a quick chat?`,
      event_id: ''
    });
    setShowVendorModal(true);
  };

  const useTemplate = (template: string) => {
    let content = template;
    if (selectedVendor) {
      content = content.replace('{name}', selectedVendor.name);
      content = content.replace('{service}', selectedVendor.service_type);
    }
    setMessageData({...messageData, message_content: content});
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
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => setShowSendModal(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white flex-1 sm:flex-none"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button 
              onClick={() => setShowVendorModal(true)}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 flex-1 sm:flex-none"
            >
              <Users className="w-4 h-4 mr-2" />
              Message Vendor
            </Button>
          </div>
        </div>

        {/* Quick Vendor Access */}
        {vendors.length > 0 && (
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Message Vendors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {vendors.slice(0, 8).map((vendor) => (
                  <Button
                    key={vendor.id}
                    variant="outline"
                    onClick={() => handleVendorMessage(vendor)}
                    className="justify-start h-auto p-3 hover:bg-green-50 border-green-200"
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm truncate">{vendor.name}</div>
                      <div className="text-xs text-gray-500">{vendor.service_type}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages History */}
        {messages.length === 0 ? (
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages sent yet</h3>
              <p className="text-gray-600 mb-6">Start sending WhatsApp messages to your event guests and vendors!</p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => setShowSendModal(true)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send First Message
                </Button>
                {vendors.length > 0 && (
                  <Button 
                    onClick={() => setShowVendorModal(true)}
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Message Vendor
                  </Button>
                )}
              </div>
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

        {/* Vendor Selection Modal */}
        <Dialog open={showVendorModal} onOpenChange={setShowVendorModal}>
          <DialogContent className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                Select Vendor to Message
              </DialogTitle>
            </DialogHeader>
            
            {vendors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No vendors found. Add vendors first to message them.</p>
                <Button 
                  onClick={() => setShowVendorModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {vendors.map((vendor) => (
                  <Card
                    key={vendor.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-green-300"
                    onClick={() => handleVendorMessage(vendor)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{vendor.name}</h4>
                          <p className="text-sm text-gray-600">{vendor.service_type}</p>
                          <p className="text-xs text-gray-500">{vendor.contact_phone}</p>
                        </div>
                        <MessageCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Send Message Modal */}
        <Dialog open={showSendModal || (showVendorModal && selectedVendor)} onOpenChange={(open) => {
          if (!open) {
            setShowSendModal(false);
            setShowVendorModal(false);
            setSelectedVendor(null);
            setMessageData({
              recipient_phone: '',
              recipient_name: '',
              message_content: '',
              event_id: ''
            });
          }
        }}>
          <DialogContent className="max-w-lg mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                {selectedVendor ? `Message ${selectedVendor.name}` : 'Send WhatsApp Message'}
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
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {messageTemplates.map((template, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => useTemplate(template.content)}
                      className="text-left justify-start h-auto p-2 text-xs"
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
                  onClick={() => {
                    setShowSendModal(false);
                    setShowVendorModal(false);
                    setSelectedVendor(null);
                  }}
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
