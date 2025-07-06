
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, UserCheck, Users, CheckCircle, XCircle, Clock, Search, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedTrackRSVPsPageProps {
  onBack: () => void;
  currentEvent?: any;
}

interface RSVP {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  rsvp_status: 'yes' | 'no' | 'maybe';
  responded_at: string;
  created_at: string;
}

interface RSVPStats {
  total_rsvps: number;
  yes_count: number;
  no_count: number;
  maybe_count: number;
}

export const EnhancedTrackRSVPsPage = ({ onBack, currentEvent }: EnhancedTrackRSVPsPageProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [stats, setStats] = useState<RSVPStats>({ total_rsvps: 0, yes_count: 0, no_count: 0, maybe_count: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'yes' | 'no' | 'maybe'>('all');

  const fetchRSVPs = async () => {
    if (!currentEvent || !user) return;

    try {
      // Fetch RSVPs
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', currentEvent.id)
        .order('created_at', { ascending: false });

      if (rsvpError) throw rsvpError;
      setRsvps(rsvpData || []);

      // Fetch stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_rsvp_stats', {
          event_id_param: currentEvent.id,
          user_id_param: user.id
        });

      if (statsError) throw statsError;
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      toast.error('Failed to load RSVPs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSVPs();
  }, [currentEvent, user]);

  // Set up real-time updates for RSVPs
  useEffect(() => {
    if (!currentEvent) return;

    const channel = supabase
      .channel('rsvp-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rsvps',
          filter: `event_id=eq.${currentEvent.id}`
        },
        () => {
          fetchRSVPs();
          toast.success('New RSVP received!');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rsvps',
          filter: `event_id=eq.${currentEvent.id}`
        },
        () => {
          fetchRSVPs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentEvent]);

  const filteredRSVPs = rsvps.filter(rsvp => {
    const matchesSearch = rsvp.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (rsvp.guest_email && rsvp.guest_email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || rsvp.rsvp_status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSendWhatsAppReminder = (rsvp: RSVP) => {
    if (!rsvp.guest_phone) {
      toast.error('No phone number available for this guest');
      return;
    }

    const message = `Hi ${rsvp.guest_name}! Just a friendly reminder about ${currentEvent?.name}. We're excited to celebrate with you! 🎉`;
    const whatsappUrl = `https://wa.me/${rsvp.guest_phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(`WhatsApp reminder sent to ${rsvp.guest_name}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'yes':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'no':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'maybe':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'yes':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'no':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'yes': return 'Attending';
      case 'no': return 'Not Attending';
      case 'maybe': return 'Maybe';
      default: return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center space-x-4">
            <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-600">Loading RSVPs...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="ghost" className="mr-4 hover:bg-blue-100">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Track RSVPs
              </h1>
              <p className="text-gray-600">{currentEvent?.name}</p>
            </div>
          </div>
          <Button onClick={fetchRSVPs} variant="outline" className="ml-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.total_rsvps}</h3>
              <p className="text-sm text-gray-600">Total RSVPs</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.yes_count}</h3>
              <p className="text-sm text-gray-600">Attending</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.no_count}</h3>
              <p className="text-sm text-gray-600">Not Attending</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <h3 className="text-2xl font-bold text-gray-800">{stats.maybe_count}</h3>
              <p className="text-sm text-gray-600">Maybe</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Guest Responses ({filteredRSVPs.length})</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search guests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Responses</option>
                  <option value="yes">Attending</option>
                  <option value="no">Not Attending</option>
                  <option value="maybe">Maybe</option>
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRSVPs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No RSVPs yet</p>
                <p className="text-sm">Share your invitation link to start receiving responses!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRSVPs.map((rsvp) => (
                  <div key={rsvp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(rsvp.rsvp_status)}
                      <div>
                        <h3 className="font-semibold text-gray-800">{rsvp.guest_name}</h3>
                        {rsvp.guest_email && <p className="text-sm text-gray-600">{rsvp.guest_email}</p>}
                        {rsvp.guest_phone && <p className="text-sm text-gray-600">{rsvp.guest_phone}</p>}
                        <p className="text-xs text-gray-500">
                          Responded: {new Date(rsvp.responded_at).toLocaleDateString()} at {new Date(rsvp.responded_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(rsvp.rsvp_status)}`}>
                        {getStatusText(rsvp.rsvp_status)}
                      </span>
                      {rsvp.guest_phone && (
                        <Button
                          size="sm"
                          onClick={() => handleSendWhatsAppReminder(rsvp)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Rate Visualization */}
        {stats.total_rsvps > 0 && (
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Response Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Attending
                  </span>
                  <span className="text-sm text-gray-600">{((stats.yes_count / stats.total_rsvps) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${(stats.yes_count / stats.total_rsvps) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                    Maybe
                  </span>
                  <span className="text-sm text-gray-600">{((stats.maybe_count / stats.total_rsvps) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${(stats.maybe_count / stats.total_rsvps) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <XCircle className="w-4 h-4 text-red-600 mr-2" />
                    Not Attending
                  </span>
                  <span className="text-sm text-gray-600">{((stats.no_count / stats.total_rsvps) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${(stats.no_count / stats.total_rsvps) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
