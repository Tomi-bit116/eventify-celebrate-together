
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, MessageSquare, Send, Users, Phone, CheckCircle, Clock, AlertCircle, Plus, Zap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  phone: string;
  type: 'guest' | 'vendor';
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'replied';
  lastMessageAt?: string;
}

interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  isIncoming?: boolean;
}

interface EnhancedWhatsAppPageProps {
  onBack: () => void;
}

export const EnhancedWhatsAppPage = ({ onBack }: EnhancedWhatsAppPageProps) => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Adunni Okafor', phone: '+234 801 234 5678', type: 'guest', status: 'delivered', lastMessageAt: '2024-01-20 10:30' },
    { id: '2', name: 'Kemi Adeleke', phone: '+234 802 345 6789', type: 'guest', status: 'read', lastMessageAt: '2024-01-20 11:15' },
    { id: '3', name: 'DJ Mike', phone: '+234 803 456 7890', type: 'vendor', status: 'replied', lastMessageAt: '2024-01-20 12:00' },
    { id: '4', name: 'Caterer Sarah', phone: '+234 804 567 8901', type: 'vendor', status: 'failed', lastMessageAt: '2024-01-20 09:45' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', contactId: '1', content: 'Hi! You are invited to our celebration this Saturday!', timestamp: '2024-01-20 10:30', status: 'delivered' },
    { id: '2', contactId: '2', content: 'Looking forward to seeing you at the party!', timestamp: '2024-01-20 11:15', status: 'read' },
    { id: '3', contactId: '3', content: 'DJ Services confirmed. What time should I arrive?', timestamp: '2024-01-20 12:00', status: 'delivered', isIncoming: true },
  ]);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [messageStats, setMessageStats] = useState({
    totalSent: 0,
    delivered: 0,
    read: 0,
    replied: 0
  });

  useEffect(() => {
    // Calculate message statistics
    const stats = {
      totalSent: messages.length,
      delivered: messages.filter(m => m.status === 'delivered' || m.status === 'read').length,
      read: messages.filter(m => m.status === 'read').length,
      replied: contacts.filter(c => c.status === 'replied').length
    };
    setMessageStats(stats);
  }, [messages, contacts]);

  const predefinedMessages = [
    "Hi! You're invited to our celebration this Saturday at 6 PM. Hope to see you there! 🎉",
    "Don't forget about our event tomorrow! We're excited to celebrate with you! 🥳",
    "Thank you for being part of our special day! Looking forward to seeing you! ❤️",
    "Quick reminder: Our event is in 2 days. Can't wait to party with you! 🎊",
    "Hello! We're finalizing arrangements for our event. Please confirm your attendance. Thanks!",
    "Vendor Update: Please confirm your arrival time and setup requirements. Thanks!",
    "Payment reminder: Please confirm receipt of advance payment. Event details attached.",
  ];

  const handleSendMessage = (contact: Contact, message: string) => {
    const whatsappUrl = `https://wa.me/${contact.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
    
    if (navigator.userAgent.match(/Mobile/)) {
      window.open(whatsappUrl, '_blank');
    } else {
      window.open(whatsappUrl, '_blank');
    }

    const newMessageObj: Message = {
      id: Date.now().toString(),
      contactId: contact.id,
      content: message,
      timestamp: new Date().toLocaleString(),
      status: 'sent'
    };

    setMessages([...messages, newMessageObj]);
    
    // Update contact status and last message time
    setContacts(contacts.map(c => 
      c.id === contact.id 
        ? { ...c, status: 'sent', lastMessageAt: new Date().toLocaleString() }
        : c
    ));

    // Simulate status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessageObj.id ? { ...msg, status: 'delivered' } : msg
      ));
      setContacts(prev => prev.map(c => 
        c.id === contact.id ? { ...c, status: 'delivered' } : c
      ));
    }, 2000);

    // Simulate read status
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.3) { // 70% chance of being read
        setMessages(prev => prev.map(msg => 
          msg.id === newMessageObj.id ? { ...msg, status: 'read' } : msg
        ));
        setContacts(prev => prev.map(c => 
          c.id === contact.id ? { ...c, status: 'read' } : c
        ));
      }
    }, 5000);

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
      setTimeout(() => {
        handleSendMessage(contact, bulkMessage);
      }, Math.random() * 1000); // Stagger messages
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
      case 'replied':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
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
      case 'replied':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-4 md:mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-2 md:mr-4 hover:bg-green-100 p-2"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              WhatsApp Integration
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3 md:p-4 text-center">
              <Send className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="text-lg md:text-2xl font-bold text-gray-800">{messageStats.totalSent}</h3>
              <p className="text-xs md:text-sm text-gray-600">Messages Sent</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3 md:p-4 text-center">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-green-600" />
              <h3 className="text-lg md:text-2xl font-bold text-gray-800">{messageStats.delivered}</h3>
              <p className="text-xs md:text-sm text-gray-600">Delivered</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3 md:p-4 text-center">
              <Zap className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-emerald-600" />
              <h3 className="text-lg md:text-2xl font-bold text-gray-800">{messageStats.read}</h3>
              <p className="text-xs md:text-sm text-gray-600">Read</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3 md:p-4 text-center">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="text-lg md:text-2xl font-bold text-gray-800">{messageStats.replied}</h3>
              <p className="text-xs md:text-sm text-gray-600">Replied</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Quick Actions */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex items-center text-green-700 text-base md:text-lg">
                <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3">
              <Button 
                onClick={() => setIsBulkModalOpen(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm md:text-base py-2"
              >
                <Users className="w-4 h-4 mr-2" />
                Send Bulk Message
              </Button>
              
              <div className="space-y-2">
                <h4 className="text-xs md:text-sm font-medium text-gray-700">Quick Templates</h4>
                {predefinedMessages.slice(0, 3).map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left h-auto p-2 text-xs justify-start"
                    onClick={() => setBulkMessage(template)}
                  >
                    {template.substring(0, 40)}...
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contacts */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm lg:col-span-3">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="flex items-center text-base md:text-lg">
                  <Users className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Contacts ({contacts.length})
                </span>
                <div className="flex gap-2 text-xs md:text-sm text-gray-600">
                  <span>Guests: {contacts.filter(c => c.type === 'guest').length}</span>
                  <span>Vendors: {contacts.filter(c => c.type === 'vendor').length}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border gap-3 sm:gap-0">
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm md:text-base">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">{contact.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{contact.phone}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            contact.type === 'guest' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                          </span>
                          {contact.lastMessageAt && (
                            <span className="text-xs text-gray-500">
                              Last: {new Date(contact.lastMessageAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 justify-end sm:justify-start">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(contact.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </span>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleQuickMessage(contact)}
                        className="bg-green-500 hover:bg-green-600 text-xs p-2"
                      >
                        <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        <span className="hidden sm:inline">Message</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message History */}
        <Card className="mt-4 md:mt-6 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center text-base md:text-lg">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.slice(-5).map((message) => {
                const contact = contacts.find(c => c.id === message.contactId);
                return (
                  <div key={message.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    message.isIncoming ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                      message.isIncoming ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                        <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                          {message.isIncoming ? `${contact?.name} (Incoming)` : contact?.name}
                        </h4>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {!message.isIncoming && getStatusIcon(message.status)}
                          <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</span>
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
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Send Message to {selectedContact?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="messageContent" className="text-sm">Message</Label>
                <textarea
                  id="messageContent"
                  rows={4}
                  className="w-full p-3 border rounded-lg text-sm"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Templates</h4>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {predefinedMessages.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left h-auto p-2 text-xs justify-start"
                      onClick={() => setNewMessage(template)}
                    >
                      {template.substring(0, 60)}...
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSendQuickMessage}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send via WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsMessageModalOpen(false)}
                  className="text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Message Modal */}
        <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Send Bulk Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bulkMessageContent" className="text-sm">Message</Label>
                <textarea
                  id="bulkMessageContent"
                  rows={4}
                  className="w-full p-3 border rounded-lg text-sm"
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder="Type your bulk message here..."
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={() => handleBulkMessage('all')}
                  className="bg-green-500 hover:bg-green-600 text-sm"
                >
                  Send to All ({contacts.length})
                </Button>
                <Button 
                  onClick={() => handleBulkMessage('guests')}
                  className="bg-blue-500 hover:bg-blue-600 text-sm"
                >
                  Guests Only ({contacts.filter(c => c.type === 'guest').length})
                </Button>
                <Button 
                  onClick={() => handleBulkMessage('vendors')}
                  className="bg-purple-500 hover:bg-purple-600 text-sm"
                >
                  Vendors Only ({contacts.filter(c => c.type === 'vendor').length})
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setIsBulkModalOpen(false)}
                className="w-full text-sm"
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
