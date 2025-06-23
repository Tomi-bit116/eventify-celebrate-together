
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, UserPlus, Send } from 'lucide-react';

interface InviteGuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: any;
}

export const InviteGuestsModal = ({ isOpen, onClose, eventData }: InviteGuestsModalProps) => {
  const [guests, setGuests] = useState<string[]>(['']);
  const [inviteMessage, setInviteMessage] = useState(`You're invited to ${eventData?.name || 'our event'}! 🎉`);

  const addGuestField = () => {
    setGuests([...guests, '']);
  };

  const updateGuest = (index: number, email: string) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = email;
    setGuests(updatedGuests);
  };

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleSendInvites = () => {
    const validEmails = guests.filter(email => email.trim() && email.includes('@'));
    console.log('Sending invites to:', validEmails);
    console.log('Message:', inviteMessage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
            Invite Guests 📧
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Event Details</h3>
            <p className="text-blue-700 text-sm">
              {eventData?.name} • {eventData?.date} • {eventData?.venue}
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4 inline mr-1" />
              Guest Email Addresses
            </Label>
            
            {guests.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="guest@example.com"
                  value={email}
                  onChange={(e) => updateGuest(index, e.target.value)}
                  className="flex-1"
                />
                {guests.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeGuest(index)}
                    className="px-3"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addGuestField}
              className="w-full border-dashed"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Another Guest
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Invitation Message
            </Label>
            <textarea
              id="message"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Save for Later
            </Button>
            <Button
              onClick={handleSendInvites}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Invites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
