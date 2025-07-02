
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Edit, Trash2, MessageCircle, DollarSign } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  service_type: string;
  contact_phone: string;
  contact_email: string | null;
  amount: number | null;
  payment_status: string | null;
  notes: string | null;
}

interface VendorCardProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendorId: string) => void;
  onWhatsApp: (vendor: Vendor) => void;
}

export const VendorCard = ({ vendor, onEdit, onDelete, onWhatsApp }: VendorCardProps) => {
  return (
    <Card className="shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-800">{vendor.name}</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              {vendor.service_type}
            </Badge>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWhatsApp(vendor)}
              className="hover:bg-green-100 text-green-600"
              title="Send WhatsApp Message"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(vendor)}
              className="hover:bg-blue-100 text-blue-600"
              title="Edit Vendor"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(vendor.id)}
              className="hover:bg-red-100 text-red-600"
              title="Delete Vendor"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2 text-blue-500" />
          <span>{vendor.contact_phone}</span>
        </div>
        
        {vendor.contact_email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-green-500" />
            <span className="truncate">{vendor.contact_email}</span>
          </div>
        )}
        
        {vendor.amount && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-purple-500" />
            <span>${vendor.amount.toLocaleString()}</span>
            <Badge 
              variant={vendor.payment_status === 'paid' ? 'default' : 'secondary'} 
              className="ml-2 text-xs"
            >
              {vendor.payment_status || 'pending'}
            </Badge>
          </div>
        )}
        
        {vendor.notes && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{vendor.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
