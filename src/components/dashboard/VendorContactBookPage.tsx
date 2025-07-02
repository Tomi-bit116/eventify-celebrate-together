
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Phone, Mail, Plus, Trash2, Store, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface VendorContactBookPageProps {
  onBack: () => void;
}

interface Vendor {
  id: string;
  name: string;
  service_type: string;
  contact_phone: string;
  contact_email: string;
  amount: number;
  payment_status: string;
  notes: string;
  event_id: string;
  created_at: string;
}

interface Event {
  id: string;
  name: string;
}

export const VendorContactBookPage = ({ onBack }: VendorContactBookPageProps) => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [vendorData, setVendorData] = useState({
    name: '',
    service_type: '',
    contact_phone: '',
    contact_email: '',
    amount: '',
    payment_status: 'pending',
    notes: '',
    event_id: ''
  });

  const serviceTypes = [
    'Catering', 'Photography', 'Music/DJ', 'Decoration', 'Venue', 
    'Transportation', 'Flowers', 'Lighting', 'Security', 'Other'
  ];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, name')
        .eq('user_id', user.id);

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Fetch vendors
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (vendorsError) throw vendorsError;
      setVendors(vendorsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  const addVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert({
          user_id: user.id,
          event_id: vendorData.event_id || null,
          name: vendorData.name,
          service_type: vendorData.service_type,
          contact_phone: vendorData.contact_phone,
          contact_email: vendorData.contact_email || null,
          amount: vendorData.amount ? parseFloat(vendorData.amount) : 0,
          payment_status: vendorData.payment_status,
          notes: vendorData.notes || null
        })
        .select()
        .single();

      if (error) throw error;

      setVendors([data, ...vendors]);
      toast.success('Vendor added successfully!');
      setShowAddModal(false);
      setVendorData({
        name: '',
        service_type: '',
        contact_phone: '',
        contact_email: '',
        amount: '',
        payment_status: 'pending',
        notes: '',
        event_id: ''
      });
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error('Failed to add vendor');
    }
  };

  const deleteVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      if (error) throw error;

      setVendors(vendors.filter(v => v.id !== vendorId));
      toast.success('Vendor deleted successfully');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error('Failed to delete vendor');
    }
  };

  const getEventName = (eventId: string) => {
    if (!eventId) return 'General Contact';
    const event = events.find(e => e.id === eventId);
    return event?.name || 'Unknown Event';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="mr-4 hover:bg-purple-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-orange-500 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                Vendor Contact Book
              </h1>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Vendors Grid */}
        {vendors.length === 0 ? (
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No vendors yet</h3>
              <p className="text-gray-600 mb-6">Start building your vendor network for seamless event planning!</p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Vendor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800 truncate">{vendor.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteVendor(vendor.id)}
                      className="hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {vendor.service_type}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-green-500" />
                    <a href={`tel:${vendor.contact_phone}`} className="hover:text-green-600">
                      {vendor.contact_phone}
                    </a>
                  </div>
                  
                  {vendor.contact_email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      <a href={`mailto:${vendor.contact_email}`} className="hover:text-blue-600 truncate">
                        {vendor.contact_email}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                      <span>${vendor.amount?.toLocaleString() || '0'}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vendor.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendor.payment_status}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Event: {getEventName(vendor.event_id)}
                  </div>
                  
                  {vendor.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {vendor.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Vendor Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-lg mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                Add New Vendor
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={addVendor} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vendor_name">Vendor Name</Label>
                <Input
                  id="vendor_name"
                  placeholder="e.g., ABC Catering Services"
                  value={vendorData.name}
                  onChange={(e) => setVendorData({...vendorData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_type">Service Type</Label>
                <Select value={vendorData.service_type} onValueChange={(value) => setVendorData({...vendorData, service_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone Number</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={vendorData.contact_phone}
                  onChange={(e) => setVendorData({...vendorData, contact_phone: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Email (Optional)</Label>
                <Input
                  id="contact_email"
                  type="email"
                  placeholder="vendor@example.com"
                  value={vendorData.contact_email}
                  onChange={(e) => setVendorData({...vendorData, contact_email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={vendorData.amount}
                    onChange={(e) => setVendorData({...vendorData, amount: e.target.value})}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <Select value={vendorData.payment_status} onValueChange={(value) => setVendorData({...vendorData, payment_status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_select">Associated Event (Optional)</Label>
                <Select value={vendorData.event_id} onValueChange={(value) => setVendorData({...vendorData, event_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event or leave blank for general contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">General Contact</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this vendor..."
                  value={vendorData.notes}
                  onChange={(e) => setVendorData({...vendorData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
                >
                  Add Vendor
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
