
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, CheckCircle, XCircle, Clock, TrendingUp, Calendar, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RSVP {
  id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  rsvp_status: 'yes' | 'no' | 'maybe';
  responded_at: string;
  created_at: string;
}

interface TrackRSVPsPageProps {
  onBack: () => void;
  currentEvent?: any;
}

export const TrackRSVPsPage = ({ onBack, currentEvent }: TrackRSVPsPageProps) => {
  const { user } = useAuth();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_rsvps: 0,
    yes_count: 0,
    no_count: 0,
    maybe_count: 0
  });

  useEffect(() => {
    if (currentEvent && user) {
      fetchRSVPs();
      fetchStats();
    }
  }, [currentEvent, user]);

  const fetchRSVPs = async () => {
    if (!currentEvent || !user) return;

    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', currentEvent.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching RSVPs:', error);
        toast.error('Failed to load RSVPs');
        return;
      }

      console.log('Fetched RSVPs:', data);
      setRsvps(data || []);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      toast.error('Failed to load RSVPs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!currentEvent || !user) return;

    try {
      const { data, error } = await supabase.rpc('get_rsvp_stats', {
        event_id_param: currentEvent.id,
        user_id_param: user.id
      });

      if (error) {
        console.error('Error fetching RSVP stats:', error);
        return;
      }

      console.log('RSVP stats:', data);
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error('Error fetching RSVP stats:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'yes': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'no': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'yes':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">ATTENDING</span>;
      case 'no':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">NOT ATTENDING</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">MAYBE</span>;
    }
  };

  const responseRate = stats.total_rsvps > 0 ? Math.round((stats.total_rsvps / (currentEvent?.expected_guests || stats.total_rsvps)) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RSVPs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="mr-4 hover:bg-white/50">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Users className="w-8 h-8 mr-3 text-green-600" />
              Track RSVPs
            </h1>
            <p className="text-gray-600 mt-2">Monitor responses for {currentEvent?.name || 'your event'}</p>
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
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">{new Date(currentEvent.event_date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Venue:</span>
                  <span className="text-gray-600 ml-2">{currentEvent.venue || 'To be announced'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Expected Guests:</span>
                  <span className="text-gray-600 ml-2">{currentEvent.expected_guests || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* RSVP Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-600">Total Responses</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.total_rsvps}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-600">Attending</h3>
              <p className="text-2xl font-bold text-green-600">{stats.yes_count}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🤔</div>
              <h3 className="font-semibold text-gray-600">Maybe</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.maybe_count}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">❌</div>
              <h3 className="font-semibold text-gray-600">Not Attending</h3>
              <p className="text-2xl font-bold text-red-600">{stats.no_count}</p>
            </CardContent>
          </Card>
        </div>

        {/* Response Rate */}
        <Card className="mb-6 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Response Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(responseRate, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Responses: {stats.total_rsvps}</span>
              <span>Expected: {currentEvent?.expected_guests || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        {/* RSVP List */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Guest Responses ({rsvps.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rsvps.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No RSVPs Yet</h3>
                <p className="text-gray-500">
                  Share your invitation link to start receiving responses from your guests!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {rsvps.map((rsvp) => (
                  <div key={rsvp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(rsvp.rsvp_status)}
                        <div>
                          <h4 className="font-semibold text-gray-800">{rsvp.guest_name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            {rsvp.guest_email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{rsvp.guest_email}</span>
                              </div>
                            )}
                            {rsvp.guest_phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{rsvp.guest_phone}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Responded on {new Date(rsvp.responded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(rsvp.rsvp_status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
