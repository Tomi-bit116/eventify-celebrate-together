
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, BookOpen, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { VendorCard } from './VendorCard';
import { VendorForm } from './VendorForm';

interface VendorContactBookPageProps {
  onBack: () => void;
  onWhatsAppMessage?: (vendor: any) => void;
}

interface Vendor {
  id: string;
  name: string;
  service_type: string;
  contact_phone: string;
  contact_email: string | null;
  amount: number | null;
  payment_status: string | null;
  notes: string | null;
  event_id: string | null;
  created_at: string;
}

export const VendorContactBookPage = ({ onBack, onWhatsAppMessage }: VendorContactBookPageProps) => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchVendors();
    }
  }, [user]);

  const fetchVendors = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'event_id'>) => {
    if (!user) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert({
          ...vendorData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setVendors([data, ...vendors]);
      toast.success('Vendor added successfully');
      setShowForm(false);
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error('Failed to add vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateVendor = async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'event_id'>) => {
    if (!user || !editingVendor) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(vendorData)
        .eq('id', editingVendor.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setVendors(vendors.map(v => v.id === editingVendor.id ? data : v));
      toast.success('Vendor updated successfully');
      setEditingVendor(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast.error('Failed to update vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId)
        .eq('user_id', user.id);

      if (error) throw error;

      setVendors(vendors.filter(v => v.id !== vendorId));
      toast.success('Vendor deleted successfully');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error('Failed to delete vendor');
    }
  };

  const handleWhatsApp = (vendor: Vendor) => {
    if (onWhatsAppMessage) {
      onWhatsAppMessage(vendor);
    } else {
      // Fallback to direct WhatsApp link
      const message = `Hi ${vendor.name}, I hope you're doing well!`;
      const phoneNumber = vendor.contact_phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.service_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="mr-4 hover:bg-orange-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Vendor Contact Book
              </h1>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search vendors by name or service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/90 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Vendors Grid */}
        {filteredVendors.length === 0 ? (
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No vendors found' : 'No vendors yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Add your first vendor to start building your contact book!'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Vendor
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onEdit={(vendor) => {
                  setEditingVendor(vendor);
                  setShowForm(true);
                }}
                onDelete={handleDeleteVendor}
                onWhatsApp={handleWhatsApp}
              />
            ))}
          </div>
        )}

        {/* Add/Edit Vendor Modal */}
        <Dialog open={showForm} onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditingVendor(null);
          }
        }}>
          <DialogContent className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
              </DialogTitle>
            </DialogHeader>
            
            <VendorForm
              vendor={editingVendor || undefined}
              onSubmit={editingVendor ? handleUpdateVendor : handleAddVendor}
              onCancel={() => {
                setShowForm(false);
                setEditingVendor(null);
              }}
              loading={submitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
