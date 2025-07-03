
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, MessageSquare, Send, Users, Phone, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  phone: string;
  type: 'guest' | 'vendor';
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

interface WhatsAppIntegrationPageProps {
  onBack: () => void;
}

export const WhatsAppIntegrationPage = ({ onBack }: WhatsAppIntegrationPageProps) => {
  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'Adunni Okafor', phone: '+234 801 234 5678', type: 'guest', status: 'delivered' },
    { id: '2', name: 'Kemi Adeleke', phone: '+234 802 345 6789', type: 'guest', status: 'read' },
    { id: '3', name: 'DJ Mike', phone: '+234 803 456 7890', type: 'vendor', status: 'sent' },
    { id: '4', name: 'Caterer Sarah', phone: '+234 804 567 8901', type: 'vendor', status: 'failed' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', contactId: '1', content: 'Hi! You are invited to our celebration this Saturday!', timestamp: '2024-01-20 10:30', status: 'delivered' },
    { id: '2', contactId: '2', content: 'Looking forward to seeing you at the party!', timestamp: '2024-01-20 11:15', status: 'read' },
  ]);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const predefinedMessages = [
    "Hi! You're invited to our celebration this Saturday at 6 PM. Hope to see you there! 🎉",
    "Don't forget about our event tomorrow! We're excited to celebrate with you! 🥳",
    "Thank you for being part of our special day! Looking forward to seeing you! ❤️",
    "Quick reminder: Our event is in 2 days. Can't wait to party with you! 🎊",
    "Hello! We're finalizing arrangements for our event. Please confirm your attendance. Thanks!"
  ];

  const handleSendMessage = (contact: Contact, message: string) => {
    // Simulate sending WhatsApp message
    const whatsappUrl = `https://wa.me/${contact.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    if (navigator.userAgent.match(/Mobile/)) {
      // Mobile - open WhatsApp app
      window.open(whatsappUrl, '_blank');
    } else {
      // Desktop - open WhatsApp Web
      window.open(whatsappUrl, '_blank');
    }

    // Add message to history
    const newMessageObj: Message = {
      id: Date.now().toString(),
      contactId: contact.id,
      content: message,
      timestamp: new Date().toLocaleString(),
      status: 'sent'
    };

    setMessages([...messages, newMessageObj]);
    
    // Simulate status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessageObj.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 2000);

    toast.success(`Message sent to ${contact.name} via WhatsApp!`);
  };

  const handleQuickMessage = (contact: Contact) => {
    setSelectedContact(contact);
    setIsMessageModalOpen(true);
  };

  const handleSendQuickMessage = () => {
    if (!selectedContact || !newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    handleSendMessage(selectedContact, newMessage);
    setNewMessage('');
    setIsMessageModalOpen(false);
    setSelectedContact(null);
  };

  const handleBulkMessage = (contactType: 'all' | 'guests' | 'vendors') => {
    if (!bulkMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    let targetContacts = contacts;
    if (contactType === 'guests') {
      targetContacts = contacts.filter(c => c.type === 'guest');
    } else if (contactType === 'vendors') {
      targetContacts = contacts.filter(c => c.type === 'vendor');
    }

    targetContacts.forEach(contact => {
      handleSendMessage(contact, bulkMessage);
    });

    setBulkMessage('');
    setIsBulkModalOpen(false);
    toast.success(`Bulk message sent to ${targetContacts.length} contacts!`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'read':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'read':
        return 'bg-emerald-100 text-emerald-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-green-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              WhatsApp Integration
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Send className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setIsBulkModalOpen(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Send Bulk Message
              </Button>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Quick Templates</h4>
                {predefinedMessages.slice(0, 2).map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left h-auto p-2 text-xs"
                    onClick={() => setBulkMessage(template)}
                  >
                    {template.substring(0, 50)}...
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contacts */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Contacts ({contacts.length})
                </span>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-600">
                    Guests: {contacts.filter(c => c.type === 'guest').length} | 
                    Vendors: {contacts.filter(c => c.type === 'vendor').length}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {contact.phone}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          contact.type === 'guest' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {contact.status && (
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(contact.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          </span>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={() => handleQuickMessage(contact)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message History */}
        <Card className="mt-6 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.map((message) => {
                const contact = contacts.find(c => c.id === message.contactId);
                return (
                  <div key={message.id} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800">{contact?.name}</h4>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(message.status)}
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{message.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Message Modal */}
        <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to {selectedContact?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="messageContent">Message</Label>
                <textarea
                  id="messageContent"
                  rows={4}
                  className="w-full p-3 border rounded-lg"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Templates</h4>
                <div className="grid grid-cols-1 gap-2">
                  {predefinedMessages.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left h-auto p-2 text-xs"
                      onClick={() => setNewMessage(template)}
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSendQuickMessage}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send via WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsMessageModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Message Modal */}
        <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Bulk Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bulkMessageContent">Message</Label>
                <textarea
                  id="bulkMessageContent"
                  rows={4}
                  className="w-full p-3 border rounded-lg"
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder="Type your bulk message here..."
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={() => handleBulkMessage('all')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Send to All ({contacts.length})
                </Button>
                <Button 
                  onClick={() => handleBulkMessage('guests')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Guests Only ({contacts.filter(c => c.type === 'guest').length})
                </Button>
                <Button 
                  onClick={() => handleBulkMessage('vendors')}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Vendors Only ({contacts.filter(c => c.type === 'vendor').length})
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setIsBulkModalOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
