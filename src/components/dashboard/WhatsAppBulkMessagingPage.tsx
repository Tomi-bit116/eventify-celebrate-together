
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, Upload, Send, Users, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface WhatsAppBulkMessagingPageProps {
  onBack: () => void;
}

export const WhatsAppBulkMessagingPage = ({ onBack }: WhatsAppBulkMessagingPageProps) => {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [phoneList, setPhoneList] = useState<string[]>([]);

  const defaultMessage = `🎉 You're invited to an amazing event!

Join us for a celebration you won't want to miss.

📅 Date: [EVENT DATE]
📍 Venue: [EVENT VENUE]
⏰ Time: [EVENT TIME]

Please RSVP by clicking the link below:
[RSVP LINK]

Looking forward to celebrating with you! ✨`;

  const parsePhoneNumbers = (input: string) => {
    // Parse phone numbers from textarea (comma, semicolon, or newline separated)
    const numbers = input
      .split(/[,;\n]/)
      .map(num => num.trim())
      .filter(num => num.length > 0);
    
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
        .map(line => line.split(',')[0]?.trim()) // Assume phone numbers are in first column
        .filter(num => num && num.length > 0);
      
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

    try {
      // Simulate sending bulk messages via WhatsApp Web
      for (let i = 0; i < phoneList.length; i++) {
        const phoneNumber = phoneList[i];
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp Web in new tab for each number
        window.open(whatsappUrl, '_blank');
        
        // Add small delay between openings to avoid overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast.success(`Opened WhatsApp for ${phoneList.length} contacts!`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 font-montserrat">
      <div className="max-w-4xl mx-auto">
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
                  placeholder="Enter phone numbers separated by commas, semicolons, or new lines:&#10;+1234567890&#10;+0987654321&#10;+1122334455"
                  rows={8}
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Support formats: +1234567890, (123) 456-7890, 123-456-7890
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
                  CSV should have phone numbers in the first column
                </p>
              </div>

              {phoneList.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    ✅ {phoneList.length} phone numbers ready to send
                  </p>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {phoneList.slice(0, 5).map((number, index) => (
                      <div key={index} className="text-xs text-green-700 font-mono">
                        {number}
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
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Sending...
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
            <div className="space-y-2 text-sm text-gray-700">
              <p>1. <strong>Add phone numbers</strong> by typing them in or uploading a CSV file</p>
              <p>2. <strong>Compose your message</strong> or use our default template</p>
              <p>3. <strong>Click "Send to Contacts"</strong> to open WhatsApp Web for each number</p>
              <p>4. <strong>Send each message individually</strong> through WhatsApp Web</p>
              <p>5. <strong>WhatsApp will open in new tabs</strong> - send messages at your own pace</p>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This feature opens WhatsApp Web for each contact. You'll need to manually send each message to comply with WhatsApp's terms of service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
