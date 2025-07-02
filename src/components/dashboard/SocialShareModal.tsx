
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Share2, 
  MessageCircle, 
  Instagram, 
  Twitter, 
  Facebook,
  Copy,
  ExternalLink,
  Music
} from 'lucide-react';
import { toast } from 'sonner';

interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  event_time: string;
  venue: string;
  expected_guests: number;
}

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export const SocialShareModal = ({ isOpen, onClose, event }: SocialShareModalProps) => {
  const [customMessage, setCustomMessage] = useState('');

  if (!event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateShareText = (platform: string) => {
    const eventDate = formatDate(event.event_date);
    const time = event.event_time ? ` at ${event.event_time}` : '';
    const venue = event.venue ? ` at ${event.venue}` : '';
    
    const baseText = `🎉 You're invited to ${event.name}!\n📅 ${eventDate}${time}${venue}\n\n${event.description || 'Join us for an amazing celebration!'}`;
    
    const hashtags = {
      instagram: '\n\n#Eventify #Celebration #Party #Event',
      twitter: '\n\n#Eventify #Celebration #Party',
      facebook: '',
      tiktok: '\n\n#Eventify #Party #Celebration #Event',
      whatsapp: ''
    };

    return baseText + (hashtags[platform as keyof typeof hashtags] || '');
  };

  const eventUrl = `${window.location.origin}/event/${event.id}`;

  const handleShare = async (platform: string) => {
    const shareText = customMessage || generateShareText(platform);
    
    try {
      if (navigator.share && platform === 'native') {
        await navigator.share({
          title: event.name,
          text: shareText,
          url: eventUrl
        });
        toast.success('Shared successfully!');
        return;
      }

      const urls = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + eventUrl)}`,
        instagram: `https://www.instagram.com/`, // Instagram doesn't have direct URL sharing
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}&quote=${encodeURIComponent(shareText)}`,
        tiktok: `https://www.tiktok.com/` // TikTok doesn't have direct URL sharing
      };

      if (platform === 'instagram' || platform === 'tiktok') {
        // Copy to clipboard for Instagram and TikTok
        await navigator.clipboard.writeText(shareText + '\n' + eventUrl);
        toast.success(`Content copied to clipboard! Open ${platform === 'instagram' ? 'Instagram' : 'TikTok'} to share.`);
        window.open(urls[platform as keyof typeof urls], '_blank');
      } else {
        window.open(urls[platform as keyof typeof urls], '_blank');
        toast.success('Opening share dialog...');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    try {
      const shareText = customMessage || generateShareText('default');
      await navigator.clipboard.writeText(shareText + '\n' + eventUrl);
      toast.success('Event details copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const copyEventUrl = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast.success('Event link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      action: () => handleShare('whatsapp')
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      action: () => handleShare('instagram')
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'from-blue-400 to-blue-600',
      action: () => handleShare('twitter')
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-800',
      action: () => handleShare('facebook')
    },
    {
      name: 'TikTok',
      icon: Music,
      color: 'from-black to-gray-800',
      action: () => handleShare('tiktok')
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
            <Share2 className="w-6 h-6 text-blue-500" />
            <span>Share Event</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Preview */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{event.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                📅 {formatDate(event.event_date)}
                {event.event_time && ` at ${event.event_time}`}
              </p>
              {event.venue && (
                <p className="text-sm text-gray-600 mb-2">📍 {event.venue}</p>
              )}
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="custom_message" className="text-sm font-medium text-gray-700">
              Custom Message (Optional)
            </Label>
            <textarea
              id="custom_message"
              placeholder="Add your personal message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Social Platforms */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Share on social media:</h4>
            <div className="grid grid-cols-2 gap-3">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.name}
                  onClick={platform.action}
                  className={`flex items-center justify-center space-x-2 bg-gradient-to-r ${platform.color} hover:opacity-90 text-white`}
                >
                  <platform.icon className="w-4 h-4" />
                  <span className="text-sm">{platform.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {navigator.share && (
            <Button
              onClick={() => handleShare('native')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share via Device
            </Button>
          )}

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Details
            </Button>
            <Button
              onClick={copyEventUrl}
              variant="outline"
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
