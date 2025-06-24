
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageCircle, Send, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WhatsAppIntegrationPageProps {
  onBack: () => void;
}

export const WhatsAppIntegrationPage = ({ onBack }: WhatsAppIntegrationPageProps) => {
  const [message, setMessage] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  const contacts = [
    { id: '1', name: 'Sarah Johnson', phone: '+234 901 234 5678' },
    { id: '2', name: 'Michael Chen', phone: '+234 902 345 6789' },
    { id: '3', name: 'Emma Wilson', phone: '+234 903 456 7890' },
    { id: '4', name: 'David Brown', phone: '+234 904 567 8901' }
  ];

  const eventUpdates = [
    'Event Date: December 25, 2024 at 6:00 PM',
    'Venue: Golden Hall, Victoria Island',
    'Dress Code: Smart Casual',
    'RSVP: Please confirm by December 20th'
  ];

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact');
      return;
    }

    // Simulate sending WhatsApp message
    toast.success(`Message sent to ${selectedContacts.length} contact(s) via WhatsApp!`);
    setMessage('');
    setSelectedContacts([]);
  };

  const generateEventUpdate = () => {
    const update = `🎉 *Event Update*

${eventUpdates.join('\n')}

We're excited to celebrate with you! 🥳

*Eventify - Making celebrations memorable*`;
    
    setMessage(update);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-lime-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              WhatsApp Integration
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Message Composer */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800">
                <Send className="w-6 h-6 mr-3 text-green-600" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Message Content
                </label>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="border-lime-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
              
              <Button 
                onClick={generateEventUpdate}
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
              >
                Generate Event Update Template
              </Button>

              {/* Message Preview */}
              {message && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Preview:</h4>
                  <div className="bg-white rounded-lg p-3 border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {message}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Selection */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800">
                <Users className="w-6 h-6 mr-3 text-green-600" />
                Select Contacts ({selectedContacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedContacts.includes(contact.id)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-lime-50'
                    }`}
                    onClick={() => handleContactToggle(contact.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {contact.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                    </div>
                    {selectedContacts.includes(contact.id) && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || selectedContacts.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send to WhatsApp ({selectedContacts.length})
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-100 to-lime-100 border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-gray-800 mb-2">Share Event Details</h3>
              <p className="text-sm text-gray-600">Send complete event information</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-100 to-green-100 border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-gray-800 mb-2">Group Updates</h3>
              <p className="text-sm text-gray-600">Send to WhatsApp groups</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-lime-100 to-green-100 border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-gray-800 mb-2">RSVP Reminders</h3>
              <p className="text-sm text-gray-600">Follow up on responses</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
