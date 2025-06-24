
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, Clock, Users, TrendingUp } from 'lucide-react';

interface RSVPGuest {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'confirmed' | 'declined' | 'pending';
  respondedAt?: Date;
  plusOne: boolean;
  guestCount: number;
}

interface RSVPPage {
  onBack: () => void;
}

export const RSVPPage = ({ onBack }: RSVPPage) => {
  const [guests, setGuests] = useState<RSVPGuest[]>([
    { id: '1', name: 'John Doe', phone: '+234 801 234 5678', email: 'john@example.com', status: 'confirmed', respondedAt: new Date(), plusOne: true, guestCount: 2 },
    { id: '2', name: 'Jane Smith', phone: '+234 802 345 6789', email: 'jane@example.com', status: 'confirmed', respondedAt: new Date(), plusOne: false, guestCount: 1 },
    { id: '3', name: 'Bob Johnson', phone: '+234 803 456 7890', email: 'bob@example.com', status: 'declined', respondedAt: new Date(), plusOne: false, guestCount: 0 },
    { id: '4', name: 'Alice Brown', phone: '+234 804 567 8901', email: 'alice@example.com', status: 'pending', plusOne: false, guestCount: 1 },
    { id: '5', name: 'Mike Wilson', phone: '+234 805 678 9012', email: 'mike@example.com', status: 'pending', plusOne: true, guestCount: 1 },
  ]);

  const confirmedGuests = guests.filter(g => g.status === 'confirmed');
  const declinedGuests = guests.filter(g => g.status === 'declined');
  const pendingGuests = guests.filter(g => g.status === 'pending');
  const totalAttendees = confirmedGuests.reduce((sum, guest) => sum + guest.guestCount, 0);
  const responseRate = guests.length > 0 ? Math.round(((confirmedGuests.length + declinedGuests.length) / guests.length) * 100) : 0;

  const updateGuestStatus = (id: string, status: 'confirmed' | 'declined' | 'pending') => {
    setGuests(guests.map(guest => 
      guest.id === id 
        ? { ...guest, status, respondedAt: status !== 'pending' ? new Date() : undefined }
        : guest
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'declined': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">CONFIRMED</span>;
      case 'declined':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">DECLINED</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">PENDING</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              RSVP Tracker 📋
            </h1>
            <p className="text-gray-600 mt-2">Track who's coming to your celebration!</p>
          </div>
        </div>

        {/* RSVP Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold text-gray-600">Total Invited</h3>
              <p className="text-2xl font-bold text-blue-600">{guests.length}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-600">Confirmed</h3>
              <p className="text-2xl font-bold text-green-600">{confirmedGuests.length}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">❌</div>
              <h3 className="font-semibold text-gray-600">Declined</h3>
              <p className="text-2xl font-bold text-red-600">{declinedGuests.length}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⏳</div>
              <h3 className="font-semibold text-gray-600">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">{pendingGuests.length}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-semibold text-gray-600">Total Attendees</h3>
              <p className="text-2xl font-bold text-purple-600">{totalAttendees}</p>
            </CardContent>
          </Card>
        </div>

        {/* Response Rate */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Response Rate: {responseRate}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${responseRate}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Responses: {confirmedGuests.length + declinedGuests.length}</span>
              <span>Pending: {pendingGuests.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Guest List by Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Confirmed Guests */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirmed ({confirmedGuests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {confirmedGuests.map((guest) => (
                  <div key={guest.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{guest.name}</h4>
                        <p className="text-sm text-gray-600">{guest.phone}</p>
                        <p className="text-sm text-gray-600">{guest.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(guest.status)}
                          <span className="text-xs text-gray-500">
                            Attending: {guest.guestCount}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestStatus(guest.id, 'pending')}
                          className="text-xs"
                        >
                          Mark Pending
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateGuestStatus(guest.id, 'declined')}
                          className="text-xs"
                        >
                          Mark Declined
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Guests */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-700">
                <Clock className="w-5 h-5 mr-2" />
                Pending ({pendingGuests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingGuests.map((guest) => (
                  <div key={guest.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{guest.name}</h4>
                        <p className="text-sm text-gray-600">{guest.phone}</p>
                        <p className="text-sm text-gray-600">{guest.email}</p>
                        <div className="mt-1">
                          {getStatusBadge(guest.status)}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-xs"
                          onClick={() => updateGuestStatus(guest.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateGuestStatus(guest.id, 'declined')}
                          className="text-xs"
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Declined Guests */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <XCircle className="w-5 h-5 mr-2" />
                Declined ({declinedGuests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {declinedGuests.map((guest) => (
                  <div key={guest.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{guest.name}</h4>
                        <p className="text-sm text-gray-600">{guest.phone}</p>
                        <p className="text-sm text-gray-600">{guest.email}</p>
                        <div className="mt-1">
                          {getStatusBadge(guest.status)}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-xs"
                          onClick={() => updateGuestStatus(guest.id, 'confirmed')}
                        >
                          Mark Confirmed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestStatus(guest.id, 'pending')}
                          className="text-xs"
                        >
                          Mark Pending
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
