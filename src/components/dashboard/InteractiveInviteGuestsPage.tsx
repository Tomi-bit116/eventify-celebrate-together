
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Share2, Copy, Mail, MessageSquare, Link as LinkIcon, Send, RefreshCw } from 'lucide-react';
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
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    if (currentEvent) {
      setCustomMessage(`🎉 You're invited to ${currentEvent.name}!\n\nJoin us for an amazing celebration on ${new Date(currentEvent.event_date).toLocaleDateString()}.\n\nPlease RSVP using the link below:`);
    }
  }, [currentEvent]);

  const generateInvitationLink = async () => {
    if (!currentEvent || !user) {
      toast.error('Please select an event first');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating invitation link for event:', currentEvent.id, 'user:', user.id);
      
      const { data, error } = await supabase.rpc('generate_invitation_link', {
        event_id_param: currentEvent.id,
        user_id_param: user.id
      });

      if (error) {
        console.error('Error generating invitation link:', error);
        throw error;
      }

      console.log('Generated invitation code:', data);

      if (data) {
        const fullLink = `${window.location.origin}/rsvp/${data}`;
        setInvitationLink(fullLink);
        toast.success('Invitation link generated successfully! 🎉');
      } else {
        throw new Error('No invitation code returned');
      }
    } catch (error) {
      console.error('Error generating invitation link:', error);
      toast.error('Failed to generate invitation link. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateLink = async () => {
    setInvitationLink('');
    await generateInvitationLink();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      toast.success('Link copied to clipboard! 📋');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareViaWhatsApp = () => {
    const message = `${customMessage}\n\n${invitationLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Shared via WhatsApp! 📱');
  };

  const shareViaEmail = () => {
    const subject = `Invitation to ${currentEvent?.name}`;
    const body = `${customMessage}\n\n${invitationLink}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
    toast.success('Email invitation opened! 📧');
  };

  const shareViaSMS = () => {
    const message = `${customMessage}\n\n${invitationLink}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
    toast.success('SMS invitation opened! 📲');
  };

  const bulkShare = () => {
    const bulkMessage = `${customMessage}\n\n${invitationLink}`;
    navigator.clipboard.writeText(bulkMessage);
    toast.success('Bulk invitation message copied! You can now paste this in your group chats or messaging apps. 📋');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-teal-50 to-emerald-50 p-4 font-montserrat">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="mr-4 hover:bg-white/50">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Users className="w-8 h-8 mr-3 text-coral-600" />
              Invite Guests
            </h1>
            <p className="text-gray-600 mt-2">Generate and share invitation links for {currentEvent?.name || 'your event'}</p>
          </div>
        </div>

        {/* Event Info Card */}
        {currentEvent && (
          <Card className="mb-6 shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 flex items-center">
                <span className="text-2xl mr-2">🎉</span>
                {currentEvent.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Date:</span>
                  <p className="text-gray-600">{new Date(currentEvent.event_date).toLocaleDateString()}</p>
                  {currentEvent.event_time && <p className="text-gray-600">at {currentEvent.event_time}</p>}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Venue:</span>
                  <p className="text-gray-600">{currentEvent.venue || 'To be announced'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Expected Guests:</span>
                  <p className="text-gray-600">{currentEvent.expected_guests || 0}</p>
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
              
              <div className="flex gap-2">
                <Button
                  onClick={generateInvitationLink}
                  disabled={isGenerating || !currentEvent}
                  className="flex-1 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    'Generate Invitation Link'
                  )}
                </Button>
                
                {invitationLink && (
                  <Button
                    onClick={regenerateLink}
                    disabled={isGenerating}
                    variant="outline"
                    className="hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {invitationLink && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <Label className="text-sm font-medium text-gray-700">Your Invitation Link:</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      value={invitationLink}
                      readOnly
                      className="bg-white text-sm font-mono"
                    />
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-green-700 mt-2">✅ This link is ready to share! Guests will be taken to an RSVP form when they click it.</p>
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

                <Button
                  onClick={bulkShare}
                  disabled={!invitationLink}
                  className="w-full bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white justify-start"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy for Bulk Sharing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customize Message */}
        {invitationLink && (
          <Card className="mt-6 shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                ✏️ Customize Your Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium text-gray-700">Personal Message:</Label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="w-full mt-2 p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                placeholder="Add a personal message..."
              />
              <p className="text-xs text-gray-500 mt-2">This message will be included when you share the invitation.</p>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6 shadow-lg bg-gradient-to-r from-gold-50 to-yellow-50 border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-xl mr-2">💡</span>
              How it works:
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>1. <strong>Generate</strong> your unique invitation link above</p>
              <p>2. <strong>Customize</strong> your personal message</p>
              <p>3. <strong>Share</strong> the link via WhatsApp, email, SMS, or bulk copy</p>
              <p>4. <strong>Guests click</strong> the link and fill out a simple RSVP form</p>
              <p>5. <strong>Track responses</strong> in real-time under "Track RSVPs"</p>
              <p>6. <strong>Registered guests</strong> will automatically appear in your event guest list</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
