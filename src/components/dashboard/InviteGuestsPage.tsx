
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Phone, Mail, MessageSquare, Instagram, Share2, Plus, Trash2, Download, Send, X, Facebook } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
}

interface InviteGuestsPageProps {
  onBack: () => void;
}

export const InviteGuestsPage = ({ onBack }: InviteGuestsPageProps) => {
  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', name: 'Adunni Okafor', phone: '+234 801 234 5678', email: 'adunni@email.com', status: 'confirmed' },
    { id: '2', name: 'Kemi Adeleke', phone: '+234 802 345 6789', email: 'kemi@email.com', status: 'pending' },
  ]);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '', email: '' });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "You're Invited to Our Event!",
    message: "Hi there! You're invited to our special celebration. We'd love to have you join us!"
  });

  const handleAddGuest = () => {
    if (!newGuest.name || !newGuest.phone) {
      toast.error("Please provide at least a name and phone number");
      return;
    }

    const guest: Guest = {
      id: Date.now().toString(),
      name: newGuest.name,
      phone: newGuest.phone,
      email: newGuest.email,
      status: 'pending'
    };

    setGuests([...guests, guest]);
    setNewGuest({ name: '', phone: '', email: '' });
    toast.success(`${newGuest.name} added to your guest list!`);
  };

  const handleInviteViaWhatsApp = (guest: Guest) => {
    const message = `Hi ${guest.name}! You're invited to our celebration! We'd love to have you join us for this special occasion. Please let us know if you can make it!`;
    const whatsappUrl = `https://wa.me/${guest.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(`WhatsApp invitation sent to ${guest.name}`);
  };

  const handleInviteViaEmail = (guest: Guest) => {
    const subject = "You're Invited to Our Celebration!";
    const body = `Dear ${guest.name},\n\nWe're excited to invite you to our upcoming celebration! Your presence would make this occasion even more special.\n\nPlease RSVP at your earliest convenience.\n\nLooking forward to celebrating with you!\n\nBest regards`;
    const emailUrl = `mailto:${guest.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
    toast.success(`Email invitation sent to ${guest.name}`);
  };

  const handleBulkEmailInvitations = () => {
    const guestsWithEmail = guests.filter(g => g.email);
    if (guestsWithEmail.length === 0) {
      toast.error("No guests with email addresses found");
      return;
    }
    
    const emailList = guestsWithEmail.map(g => g.email).join(',');
    const emailUrl = `mailto:${emailList}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
    window.open(emailUrl);
    toast.success(`Email invitations sent to ${guestsWithEmail.length} guests!`);
    setIsEmailModalOpen(false);
  };

  const handleSocialShare = (platform: string) => {
    const eventText = "Join us for an amazing celebration! You're invited to our special event.";
    const eventUrl = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(eventText + ' ' + eventUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't have direct sharing URLs, so we copy to clipboard
        navigator.clipboard.writeText(eventText + ' ' + eventUrl);
        toast.success("Event details copied! You can now paste it on Instagram.");
        return;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(eventText)}&url=${encodeURIComponent(eventUrl)}`;
        break;
      case 'tiktok':
        navigator.clipboard.writeText(eventText + ' ' + eventUrl);
        toast.success("Event details copied! You can now share it on TikTok.");
        return;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      toast.success(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
    }
  };

  const handleImportContacts = () => {
    // Simulate contact import
    const newContacts = [
      { name: 'John Doe', phone: '+234 901 234 5678', email: 'john@email.com' },
      { name: 'Jane Smith', phone: '+234 902 345 6789', email: 'jane@email.com' }
    ];
    
    const importedGuests = newContacts.map(contact => ({
      id: Date.now().toString() + Math.random(),
      ...contact,
      status: 'pending' as const
    }));
    
    setGuests([...guests, ...importedGuests]);
    toast.success(`Imported ${newContacts.length} contacts successfully!`);
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
    toast.success("Guest removed from list");
  };

  const handleCreateShareableLink = () => {
    const link = `https://eventify.app/invite/${Date.now()}`;
    navigator.clipboard.writeText(link);
    toast.success("Shareable invitation link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
              <Users className="w-8 h-8 mr-3 text-orange-600" />
              Invite Your Guests
            </h1>
            <p className="text-gray-600 mt-2">Build your guest list and send beautiful invitations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Guest */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <Plus className="w-5 h-5 mr-2" />
                Add New Guest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="guestName">Guest Name *</Label>
                <Input
                  id="guestName"
                  placeholder="Enter guest name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="guestPhone">Phone Number *</Label>
                <Input
                  id="guestPhone"
                  placeholder="+234 801 234 5678"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="guestEmail">Email (Optional)</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  placeholder="guest@email.com"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              <Button onClick={handleAddGuest} className="w-full bg-orange-600 hover:bg-orange-700">
                Add to Guest List
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Quick Invite Options */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Share2 className="w-5 h-5 mr-2" />
                Quick Invite Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleImportContacts}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Download className="w-5 h-5 mr-2" />
                Import from Contacts
              </Button>
              <Button 
                onClick={handleCreateShareableLink}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Create Shareable Link
              </Button>
              <Button 
                onClick={() => setIsEmailModalOpen(true)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email Invitations
              </Button>
              
              {/* Social Media Sharing */}
              <div className="border-t pt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Share on Social Media</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleSocialShare('whatsapp')}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button 
                    onClick={() => handleSocialShare('instagram')}
                    className="bg-pink-500 hover:bg-pink-600 text-white text-xs"
                  >
                    <Instagram className="w-4 h-4 mr-1" />
                    Instagram
                  </Button>
                  <Button 
                    onClick={() => handleSocialShare('x')}
                    className="bg-black hover:bg-gray-800 text-white text-xs"
                  >
                    <X className="w-4 h-4 mr-1" />
                    X (Twitter)
                  </Button>
                  <Button 
                    onClick={() => handleSocialShare('facebook')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    <Facebook className="w-4 h-4 mr-1" />
                    Facebook
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guest List */}
        <Card className="mt-6 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Guest List ({guests.length})
              </span>
              <div className="text-sm text-gray-600">
                Confirmed: {guests.filter(g => g.status === 'confirmed').length} | 
                Pending: {guests.filter(g => g.status === 'pending').length}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{guest.name}</h3>
                    <p className="text-sm text-gray-600">{guest.phone}</p>
                    {guest.email && <p className="text-sm text-gray-600">{guest.email}</p>}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                      guest.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      guest.status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleInviteViaWhatsApp(guest)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    {guest.email && (
                      <Button
                        size="sm"
                        onClick={() => handleInviteViaEmail(guest)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeGuest(guest.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Email Invitation Modal */}
        <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Email Invitations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="emailSubject">Subject</Label>
                <Input
                  id="emailSubject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="emailMessage">Message</Label>
                <textarea
                  id="emailMessage"
                  rows={4}
                  className="w-full p-2 border rounded-lg"
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleBulkEmailInvitations}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitations
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEmailModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
