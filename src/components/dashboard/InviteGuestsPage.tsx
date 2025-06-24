
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Phone, Mail, MessageSquare, Instagram, Share2, Plus, Trash2 } from 'lucide-react';
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
    { id: '1', name: 'John Doe', phone: '+234 801 234 5678', email: 'john@example.com', status: 'confirmed' },
    { id: '2', name: 'Jane Smith', phone: '+234 802 345 6789', email: 'jane@example.com', status: 'pending' },
  ]);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '', email: '' });

  const handleAddGuest = () => {
    if (!newGuest.name || !newGuest.phone) {
      toast.error("Please fill in at least name and phone number!");
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
    toast.success(`${newGuest.name} added to guest list! 🎉`);
  };

  const handleInviteViaWhatsApp = (guest: Guest) => {
    const message = `Hi ${guest.name}! You're invited to our amazing celebration! 🎉 Can't wait to party with you!`;
    const whatsappUrl = `https://wa.me/${guest.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(`WhatsApp invitation sent to ${guest.name}! 📱`);
  };

  const handleInviteViaEmail = (guest: Guest) => {
    const subject = "You're Invited to Our Celebration! 🎉";
    const body = `Hi ${guest.name}!\n\nYou're invited to our amazing celebration! We can't wait to party with you!\n\nPlease RSVP as soon as possible.\n\nSee you there! 🥳`;
    const emailUrl = `mailto:${guest.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
    toast.success(`Email invitation sent to ${guest.name}! 📧`);
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
    toast.success("Guest removed from list!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
              <Users className="w-8 h-8 mr-3 text-green-600" />
              Invite Your Squad! 🎉
            </h1>
            <p className="text-gray-600 mt-2">Get everyone together for an amazing celebration!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Guest */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Plus className="w-5 h-5 mr-2" />
                Add New Guest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="guestName">Guest Name *</Label>
                <Input
                  id="guestName"
                  placeholder="John Doe"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="guestPhone">Phone Number *</Label>
                <Input
                  id="guestPhone"
                  placeholder="+234 801 234 5678"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="guestEmail">Email (Optional)</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                />
              </div>
              <Button onClick={handleAddGuest} className="w-full bg-green-600 hover:bg-green-700">
                Add to Guest List 🎊
              </Button>
            </CardContent>
          </Card>

          {/* Quick Invite Options */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Share2 className="w-5 h-5 mr-2" />
                Quick Invite Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                <MessageSquare className="w-5 h-5 mr-2" />
                Import from Phone Contacts
              </Button>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <Mail className="w-5 h-5 mr-2" />
                Send Email Invitations
              </Button>
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                <Instagram className="w-5 h-5 mr-2" />
                Share on Social Media
              </Button>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                <Share2 className="w-5 h-5 mr-2" />
                Create Shareable Link
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Guest List */}
        <Card className="mt-6 shadow-lg">
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
                <div key={guest.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{guest.name}</h3>
                    <p className="text-sm text-gray-600">{guest.phone}</p>
                    {guest.email && <p className="text-sm text-gray-600">{guest.email}</p>}
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      guest.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      guest.status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {guest.status.toUpperCase()}
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
      </div>
    </div>
  );
};
