
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BookOpen, Plus, Phone, Mail, DollarSign, Check, X, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface VendorContactBookPageProps {
  onBack: () => void;
}

interface Vendor {
  id: string;
  name: string;
  serviceType: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  paymentStatus: 'paid' | 'pending';
  amount: number;
  notes: string;
}

export const VendorContactBookPage = ({ onBack }: VendorContactBookPageProps) => {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Golden Catering Services',
      serviceType: 'Catering',
      contactInfo: {
        phone: '+234 901 234 5678',
        email: 'info@goldencatering.com'
      },
      paymentStatus: 'paid',
      amount: 150000,
      notes: 'Excellent service, recommended by friends'
    },
    {
      id: '2',
      name: 'Perfect Photos Studio',
      serviceType: 'Photography',
      contactInfo: {
        phone: '+234 902 345 6789',
        email: 'bookings@perfectphotos.ng'
      },
      paymentStatus: 'pending',
      amount: 80000,
      notes: 'Need to confirm final package details'
    },
    {
      id: '3',
      name: 'Elite Event Decorators',
      serviceType: 'Decoration',
      contactInfo: {
        phone: '+234 903 456 7890',
        email: 'elite@eventdecor.ng'
      },
      paymentStatus: 'pending',
      amount: 120000,
      notes: 'Waiting for color scheme confirmation'
    }
  ]);

  const [showAddVendor, setShowAddVendor] = useState(false);
  const [editingVendor, setEditingVendor] = useState<string | null>(null);
  const [vendorForm, setVendorForm] = useState({
    name: '',
    serviceType: '',
    phone: '',
    email: '',
    amount: '',
    notes: ''
  });

  const serviceTypes = [
    'Catering', 'Photography', 'Decoration', 'Music/DJ', 'Transportation', 
    'Security', 'Cleaning', 'Floral', 'Makeup Artist', 'Event Planning', 'Other'
  ];

  const resetForm = () => {
    setVendorForm({
      name: '',
      serviceType: '',
      phone: '',
      email: '',
      amount: '',
      notes: ''
    });
  };

  const handleAddVendor = () => {
    if (!vendorForm.name || !vendorForm.serviceType || !vendorForm.phone) {
      toast.error('Please fill in required fields');
      return;
    }

    const newVendor: Vendor = {
      id: Date.now().toString(),
      name: vendorForm.name,
      serviceType: vendorForm.serviceType,
      contactInfo: {
        phone: vendorForm.phone,
        email: vendorForm.email
      },
      paymentStatus: 'pending',
      amount: parseInt(vendorForm.amount) || 0,
      notes: vendorForm.notes
    };

    setVendors([...vendors, newVendor]);
    resetForm();
    setShowAddVendor(false);
    toast.success('Vendor added successfully!');
  };

  const handleEditVendor = (vendor: Vendor) => {
    setVendorForm({
      name: vendor.name,
      serviceType: vendor.serviceType,
      phone: vendor.contactInfo.phone,
      email: vendor.contactInfo.email,
      amount: vendor.amount.toString(),
      notes: vendor.notes
    });
    setEditingVendor(vendor.id);
    setShowAddVendor(true);
  };

  const handleUpdateVendor = () => {
    if (!editingVendor) return;

    setVendors(vendors.map(vendor => 
      vendor.id === editingVendor 
        ? {
            ...vendor,
            name: vendorForm.name,
            serviceType: vendorForm.serviceType,
            contactInfo: {
              phone: vendorForm.phone,
              email: vendorForm.email
            },
            amount: parseInt(vendorForm.amount) || 0,
            notes: vendorForm.notes
          }
        : vendor
    ));

    resetForm();
    setShowAddVendor(false);
    setEditingVendor(null);
    toast.success('Vendor updated successfully!');
  };

  const handleDeleteVendor = (vendorId: string) => {
    setVendors(vendors.filter(vendor => vendor.id !== vendorId));
    toast.success('Vendor removed!');
  };

  const handlePaymentStatusChange = (vendorId: string, status: 'paid' | 'pending') => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId ? { ...vendor, paymentStatus: status } : vendor
    ));
    toast.success(`Payment status updated to ${status}`);
  };

  const getTotalAmount = () => {
    return vendors.reduce((total, vendor) => total + vendor.amount, 0);
  };

  const getPaidAmount = () => {
    return vendors.filter(v => v.paymentStatus === 'paid').reduce((total, vendor) => total + vendor.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-lime-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              Vendor's Contact Book
            </h1>
          </div>
        </div>

        {/* Payment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-100 to-lime-100">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <div className="text-2xl font-bold text-green-700">
                ₦{getTotalAmount().toLocaleString()}
              </div>
              <div className="text-sm text-green-600">Total Budget</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-100 to-cyan-100">
            <CardContent className="p-6 text-center">
              <Check className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <div className="text-2xl font-bold text-blue-700">
                ₦{getPaidAmount().toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Paid</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-100 to-orange-100">
            <CardContent className="p-6 text-center">
              <X className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <div className="text-2xl font-bold text-orange-700">
                ₦{(getTotalAmount() - getPaidAmount()).toLocaleString()}
              </div>
              <div className="text-sm text-orange-600">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Vendor Button */}
        <div className="mb-6">
          <Button 
            onClick={() => {
              resetForm();
              setEditingVendor(null);
              setShowAddVendor(!showAddVendor);
            }}
            className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Vendor
          </Button>
        </div>

        {/* Add/Edit Vendor Form */}
        {showAddVendor && (
          <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">
                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Vendor Name *</label>
                  <Input
                    placeholder="Enter vendor name"
                    value={vendorForm.name}
                    onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                    className="border-lime-200 focus:border-green-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service Type *</label>
                  <Select 
                    value={vendorForm.serviceType} 
                    onValueChange={(value) => setVendorForm({ ...vendorForm, serviceType: value })}
                  >
                    <SelectTrigger className="border-lime-200 focus:border-green-400">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-lime-200">
                      {serviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <Input
                    placeholder="+234 901 234 5678"
                    value={vendorForm.phone}
                    onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                    className="border-lime-200 focus:border-green-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input
                    type="email"
                    placeholder="vendor@email.com"
                    value={vendorForm.email}
                    onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                    className="border-lime-200 focus:border-green-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amount (₦)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={vendorForm.amount}
                  onChange={(e) => setVendorForm({ ...vendorForm, amount: e.target.value })}
                  className="border-lime-200 focus:border-green-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <Textarea
                  placeholder="Additional notes or preferences"
                  value={vendorForm.notes}
                  onChange={(e) => setVendorForm({ ...vendorForm, notes: e.target.value })}
                  className="border-lime-200 focus:border-green-400"
                />
              </div>
              <div className="flex space-x-4">
                <Button 
                  onClick={editingVendor ? handleUpdateVendor : handleAddVendor}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddVendor(false);
                    setEditingVendor(null);
                    resetForm();
                  }}
                  variant="outline"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vendors List */}
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {vendor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{vendor.name}</h3>
                        <span className="px-2 py-1 bg-lime-100 text-green-700 rounded-full text-xs font-medium">
                          {vendor.serviceType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {vendor.contactInfo.phone}
                        </div>
                        {vendor.contactInfo.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {vendor.contactInfo.email}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          ₦{vendor.amount.toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Payment:</span>
                          <select
                            value={vendor.paymentStatus}
                            onChange={(e) => handlePaymentStatusChange(vendor.id, e.target.value as 'paid' | 'pending')}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              vendor.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {vendor.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-600">{vendor.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      onClick={() => handleEditVendor(vendor)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
