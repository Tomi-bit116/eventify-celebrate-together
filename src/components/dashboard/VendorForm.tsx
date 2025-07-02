
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Vendor {
  id?: string;
  name: string;
  service_type: string;
  contact_phone: string;
  contact_email: string;
  amount: number;
  payment_status: string;
  notes: string;
}

interface VendorFormProps {
  vendor?: Vendor;
  onSubmit: (vendor: Omit<Vendor, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const serviceTypes = [
  'Catering', 'Photography', 'Videography', 'Decoration', 'Music/DJ', 
  'Venue', 'Transportation', 'Security', 'Cleaning', 'Lighting', 'Other'
];

export const VendorForm = ({ vendor, onSubmit, onCancel, loading = false }: VendorFormProps) => {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    service_type: vendor?.service_type || '',
    contact_phone: vendor?.contact_phone || '',
    contact_email: vendor?.contact_email || '',
    amount: vendor?.amount || 0,
    payment_status: vendor?.payment_status || 'pending',
    notes: vendor?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Vendor Name *</Label>
          <Input
            id="name"
            placeholder="e.g., ABC Catering"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service_type">Service Type *</Label>
          <Select value={formData.service_type} onValueChange={(value) => setFormData({...formData, service_type: value})}>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Phone Number *</Label>
          <Input
            id="contact_phone"
            type="tel"
            placeholder="+1234567890"
            value={formData.contact_phone}
            onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Email Address</Label>
          <Input
            id="contact_email"
            type="email"
            placeholder="vendor@example.com"
            value={formData.contact_email}
            onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_status">Payment Status</Label>
          <Select value={formData.payment_status} onValueChange={(value) => setFormData({...formData, payment_status: value})}>
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
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes about the vendor..."
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          disabled={loading}
        >
          {loading ? 'Saving...' : vendor ? 'Update Vendor' : 'Add Vendor'}
        </Button>
      </div>
    </form>
  );
};
