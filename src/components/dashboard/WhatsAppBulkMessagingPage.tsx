
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, Upload, Send, Users, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WhatsAppBulkMessagingPageProps {
  onBack: () => void;
}

export const WhatsAppBulkMessagingPage = ({ onBack }: WhatsAppBulkMessagingPageProps) => {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [phoneList, setPhoneList] = useState<string[]>([]);
  const [sentCount, setSentCount] = useState(0);

  const defaultMessage = `🎉 You're invited to an amazing event!

Join us for a celebration you won't want to miss.

📅 Date: [EVENT DATE]
📍 Venue: [EVENT VENUE]
⏰ Time: [EVENT TIME]

Please RSVP by clicking the link below:
[RSVP LINK]

Looking forward to celebrating with you! ✨`;

  const messageTemplates = [
    {
      name: "Birthday Party",
      message: "🎂 You're invited to my Birthday Party!\n\nDate: [DATE]\nTime: [TIME]\nVenue: [VENUE]\n\nCome celebrate with me! 🎉"
    },
    {
      name: "Wedding",
      message: "💍 You're invited to our Wedding!\n\nDate: [DATE]\nTime: [TIME]\nVenue: [VENUE]\n\nWe'd love to have you celebrate our special day! 💕"
    },
    {
      name: "General Event",
      message: "🎉 You're invited to our special event!\n\nDate: [DATE]\nTime: [TIME]\nVenue: [VENUE]\n\nHope to see you there!"
    }
  ];

  const parsePhoneNumbers = (input: string) => {
    // Parse phone numbers from textarea (comma, semicolon, or newline separated)
    const numbers = input
      .split(/[,;\n]/)
      .map(num => num.trim().replace(/\D/g, '')) // Remove non-digits
      .filter(num => num.length >= 10) // Valid phone numbers should be at least 10 digits
      .map(num => num.startsWith('0') ? `234${num.slice(1)}` : num); // Convert Nigerian numbers
    
    setPhoneList(numbers);
    return numbers;
  };

  const handlePhoneNumbersChange = (value: string) => {
    setPhoneNumbers(value);
    parsePhoneNumbers(value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const numbers = lines
        .map(line => {
          // Try to extract phone number from different CSV formats
          const columns = line.split(',');
          // Look for the first column that looks like a phone number
          for (const col of columns) {
            const cleaned = col.trim().replace(/\D/g, '');
            if (cleaned.length >= 10) {
              return cleaned;
            }
          }
          return null;
        })
        .filter((num): num is string => num !== null);
      
      setPhoneNumbers(numbers.join('\n'));
      setPhoneList(numbers);
      toast.success(`Loaded ${numbers.length} phone numbers from CSV`);
    };
    reader.readAsText(file);
  };

  const sendBulkMessages = async () => {
    if (phoneList.length === 0) {
      toast.error('Please add phone numbers');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    setSentCount(0);

    try {
      // Send to WhatsApp Web with a controlled delay
      for (let i = 0; i < phoneList.length; i++) {
        const phoneNumber = phoneList[i];
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp Web in new tab
        window.open(whatsappUrl, '_blank');
        setSentCount(i + 1);
        
        // Add delay between openings to prevent overwhelming
        if (i < phoneList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }
      }

      toast.success(`🎉 Opened WhatsApp for all ${phoneList.length} contacts!`, {
        description: "Messages are ready to send in WhatsApp Web tabs"
      });
    } catch (error) {
      console.error('Error sending bulk messages:', error);
      toast.error('Failed to send bulk messages');
    } finally {
      setIsSending(false);
    }
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard!');
  };

  const useTemplate = (template: string) => {
    setMessage(template);
    toast.success('Template applied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 font-montserrat">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="ghost" className="mr-4 hover:bg-white/50">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <MessageSquare className="w-8 h-8 mr-3 text-green-600" />
              WhatsApp Bulk Messaging
            </h1>
            <p className="text-gray-600 mt-2">Send invitations to multiple contacts at once</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Phone Numbers Input */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Users className="w-5 h-5 mr-2" />
                Phone Numbers ({phoneList.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phoneNumbers">Enter Phone Numbers</Label>
                <Textarea
                  id="phoneNumbers"
                  value={phoneNumbers}
                  onChange={(e) => handlePhoneNumbersChange(e.target.value)}
                  placeholder="Enter phone numbers (one per line or comma-separated):&#10;+2348012345678&#10;08087654321&#10;+2349012345678"
                  rows={8}
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supports: +234801234567, 08012345678, 2348012345678
                </p>
              </div>

              <div className="border-t pt-4">
                <Label htmlFor="csvFile">Or Upload CSV File</Label>
                <div className="mt-2">
                  <input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById('csvFile')?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV File
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  CSV should have phone numbers in any column
                </p>
              </div>

              {phoneList.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {phoneList.length} phone numbers ready to send
                  </p>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {phoneList.slice(0, 5).map((number, index) => (
                      <div key={index} className="text-xs text-green-700 font-mono">
                        +{number}
                      </div>
                    ))}
                    {phoneList.length > 5 && (
                      <div className="text-xs text-green-600">
                        ... and {phoneList.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message Composer */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-emerald-700">
                <span className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Compose Message
                </span>
                <Button
                  onClick={copyMessage}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Message Templates */}
              <div>
                <Label className="text-sm font-medium">Quick Templates</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {messageTemplates.map((template, index) => (
                    <Button
                      key={index}
                      onClick={() => useTemplate(template.message)}
                      variant="outline"
                      className="text-left text-xs h-auto p-2"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your invitation message..."
                  rows={12}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {message.length} characters
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => setMessage(defaultMessage)}
                  variant="outline"
                  className="w-full text-sm"
                >
                  Use Default Template
                </Button>
                
                <Button
                  onClick={sendBulkMessages}
                  disabled={isSending || phoneList.length === 0 || !message.trim()}
                  className="w-full bg-green-500 hover:bg-green-600 text-white relative"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Opening WhatsApp... ({sentCount}/{phoneList.length})
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send to {phoneList.length} Contacts
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-xl mr-2">💡</span>
              How it works:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <p><strong>1. Add phone numbers</strong> by typing them in or uploading a CSV file</p>
                <p><strong>2. Compose your message</strong> or use our quick templates</p>
                <p><strong>3. Click "Send to Contacts"</strong> to open WhatsApp Web for each number</p>
              </div>
              <div className="space-y-2">
                <p><strong>4. Each contact opens in WhatsApp Web</strong> with your message ready</p>
                <p><strong>5. Review and send each message</strong> manually in WhatsApp</p>
                <p><strong>6. Messages open with 2-second delays</strong> to prevent overwhelming your browser</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>✅ Best Practice:</strong> This method complies with WhatsApp's terms of service by opening individual chats rather than sending automated messages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
