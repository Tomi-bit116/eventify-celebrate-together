
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, UserCheck, Users, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';

interface TrackRSVPsPageProps {
  onBack: () => void;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'confirmed' | 'declined' | 'pending';
  respondedAt?: string;
}

export const TrackRSVPsPage = ({ onBack }: TrackRSVPsPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [guests] = useState<Guest[]>([
    { id: '1', name: 'Adunni Okafor', email: 'adunni@email.com', phone: '+234 801 234 5678', status: 'confirmed', respondedAt: '2024-06-28' },
    { id: '2', name: 'Kemi Adeleke', email: 'kemi@email.com', phone: '+234 802 345 6789', status: 'pending' },
    { id: '3', name: 'Tunde Williams', email: 'tunde@email.com', phone: '+234 803 456 7890', status: 'declined', respondedAt: '2024-06-27' },
    { id: '4', name: 'Folake Johnson', email: 'folake@email.com', phone: '+234 804 567 8901', status: 'confirmed', respondedAt: '2024-06-26' },
    { id: '5', name: 'Chidi Okoro', email: 'chidi@email.com', phone: '+234 805 678 9012', status: 'pending' },
  ]);

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    declined: guests.filter(g => g.status === 'declined').length,
    pending: guests.filter(g => g.status === 'pending').length
  };

  const handleSendReminder = (guest: Guest) => {
    toast.success(`Reminder sent to ${guest.name}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'declined':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-blue-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Track RSVPs
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
              <p className="text-sm text-gray-600">Total Invited</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.confirmed}</h3>
              <p className="text-sm text-gray-600">Confirmed</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.declined}</h3>
              <p className="text-sm text-gray-600">Declined</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.pending}</h3>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Guest Responses</span>
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredGuests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(guest.status)}
                    <div>
                      <h3 className="font-semibold text-gray-800">{guest.name}</h3>
                      <p className="text-sm text-gray-600">{guest.email}</p>
                      <p className="text-sm text-gray-600">{guest.phone}</p>
                      {guest.respondedAt && (
                        <p className="text-xs text-gray-500">Responded: {guest.respondedAt}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(guest.status)}`}>
                      {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                    </span>
                    {guest.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleSendReminder(guest)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Send Reminder
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Rate Chart */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Response Rate Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confirmed</span>
                <span className="text-sm text-gray-600">{((stats.confirmed / stats.total) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.confirmed / stats.total) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Declined</span>
                <span className="text-sm text-gray-600">{((stats.declined / stats.total) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(stats.declined / stats.total) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-sm text-gray-600">{((stats.pending / stats.total) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
