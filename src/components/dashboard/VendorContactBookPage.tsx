
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Search, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { VendorCard } from './VendorCard';
import { VendorForm } from './VendorForm';

interface VendorContactBookPageProps {
  onBack: () => void;
  onWhatsAppMessage: (vendor: Vendor) => void;
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

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

      if (error) {
        console.error('Error fetching vendors:', error);
        toast.error('Failed to load vendors');
        return;
      }

      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (vendorData: Omit<Vendor, 'id' | 'event_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert({
          ...vendorData,
          user_id: user.id,
          event_id: null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding vendor:', error);
        toast.error('Failed to add vendor');
        return;
      }

      setVendors([data, ...vendors]);
      toast.success('Vendor added successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error('Failed to add vendor');
    }
  };

  const handleEditVendor = async (vendorData: Omit<Vendor, 'id' | 'event_id' | 'created_at'>) => {
    if (!user || !editingVendor) return;

    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(vendorData)
        .eq('id', editingVendor.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating vendor:', error);
        toast.error('Failed to update vendor');
        return;
      }

      setVendors(vendors.map(v => v.id === editingVendor.id ? data : v));
      toast.success('Vendor updated successfully');
      setIsEditModalOpen(false);
      setEditingVendor(null);
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast.error('Failed to update vendor');
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

      if (error) {
        console.error('Error deleting vendor:', error);
        toast.error('Failed to delete vendor');
        return;
      }

      setVendors(vendors.filter(v => v.id !== vendorId));
      toast.success('Vendor deleted successfully');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error('Failed to delete vendor');
    }
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsEditModalOpen(true);
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.service_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vendor Contact Book
              </h1>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search vendors or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/90 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Vendors Grid */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No vendors found' : 'No vendors yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start building your vendor network by adding your first contact'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Vendor
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onEdit={openEditModal}
                onDelete={handleDeleteVendor}
                onWhatsApp={onWhatsAppMessage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Add New Vendor
            </DialogTitle>
          </DialogHeader>
          <VendorForm
            onSubmit={handleAddVendor}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Edit Vendor
            </DialogTitle>
          </DialogHeader>
          {editingVendor && (
            <VendorForm
              vendor={editingVendor}
              onSubmit={handleEditVendor}
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingVendor(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
