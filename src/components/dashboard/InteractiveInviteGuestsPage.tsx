
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Users, Share2, Copy, Mail, MessageSquare, Link as LinkIcon, Send, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InteractiveInviteGuestsPageProps {
  onBack: () => void;
  currentEvent?: any;
}

export const InteractiveInviteGuestsPage = ({ onBack, currentEvent }: InteractiveInviteGuestsPageProps) => {
  const { user } = useAuth();
  const [invitationLink, setInvitationLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    if (currentEvent) {
      setCustomMessage(`You're invited to ${currentEvent.name}! 🎉\n\nJoin us for an amazing celebration. Please RSVP using the link below:`);
    }
  }, [currentEvent]);

  const generateInvitationLink = async () => {
    if (!currentEvent || !user) {
      toast.error('Please select an event first');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.rpc('generate_invitation_link', {
        event_id_param: currentEvent.id,
        user_id_param: user.id
      });

      if (error) throw error;

      const fullLink = `${window.location.origin}/rsvp/${data}`;
      setInvitationLink(fullLink);
      toast.success('Invitation link generated successfully!');
    } catch (error) {
      console.error('Error generating invitation link:', error);
      toast.error('Failed to generate invitation link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareViaWhatsApp = () => {
    const message = `${customMessage}\n\n${invitationLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Shared via WhatsApp!');
  };

  const shareViaEmail = () => {
    const subject = `Invitation to ${currentEvent?.name}`;
    const body = `${customMessage}\n\n${invitationLink}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
    toast.success('Email invitation opened!');
  };

  const shareViaSMS = () => {
    const message = `${customMessage}\n\n${invitationLink}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
    toast.success('SMS invitation opened!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Users className="w-8 h-8 mr-3 text-coral-600" />
              Interactive Guest Invitations
            </h1>
            <p className="text-gray-600 mt-2">Generate and share beautiful invitations for {currentEvent?.name}</p>
          </div>
        </div>

        {/* Event Info Card */}
        {currentEvent && (
          <Card className="mb-6 shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Event:</span>
                  <p className="text-gray-600">{currentEvent.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Date:</span>
                  <p className="text-gray-600">{new Date(currentEvent.event_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Venue:</span>
                  <p className="text-gray-600">{currentEvent.venue || 'To be announced'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generate Invitation Link */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-coral-700">
                <LinkIcon className="w-5 h-5 mr-2" />
                Generate Invitation Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Create a unique invitation link that guests can use to RSVP to your event.</p>
              
              <Button
                onClick={generateInvitationLink}
                disabled={isGenerating || !currentEvent}
                className="w-full bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white"
              >
                {isGenerating ? 'Generating...' : 'Generate Invitation Link'}
              </Button>

              {invitationLink && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <Label className="text-sm font-medium text-gray-700">Your Invitation Link:</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      value={invitationLink}
                      readOnly
                      className="bg-white text-sm"
                    />
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Share Options */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-700">
                <Share2 className="w-5 h-5 mr-2" />
                Share Invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Share your invitation link through various channels.</p>
              
              <div className="space-y-3">
                <Button
                  onClick={shareViaWhatsApp}
                  disabled={!invitationLink}
                  className="w-full bg-green-500 hover:bg-green-600 text-white justify-start"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Share via WhatsApp
                </Button>
                
                <Button
                  onClick={shareViaEmail}
                  disabled={!invitationLink}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white justify-start"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Share via Email
                </Button>
                
                <Button
                  onClick={shareViaSMS}
                  disabled={!invitationLink}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white justify-start"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Share via SMS
                </Button>
              </div>

              {invitationLink && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <Label className="text-sm font-medium text-gray-700">Customize Message:</Label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                    className="w-full mt-2 p-2 border rounded-lg text-sm"
                    placeholder="Add a personal message..."
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QR Code Section */}
        {invitationLink && (
          <Card className="mt-6 shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <QrCode className="w-5 h-5 mr-2" />
                QR Code for Easy Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">QR Code will be generated here</p>
                  <p className="text-xs text-gray-500 mt-1">Guests can scan to RSVP instantly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6 shadow-lg bg-gradient-to-r from-gold-50 to-yellow-50 border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">How it works:</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>1. Generate your unique invitation link above</p>
              <p>2. Share the link via WhatsApp, email, SMS, or social media</p>
              <p>3. Guests click the link and fill out a simple RSVP form</p>
              <p>4. View all responses in real-time under "Track RSVPs"</p>
              <p>5. Send reminders and manage your guest list easily</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
