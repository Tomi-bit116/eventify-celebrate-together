
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus, Mail, Eye, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface SharedAccessPageProps {
  onBack: () => void;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'view-only' | 'edit';
  status: 'pending' | 'active';
}

export const SharedAccessPage = ({ onBack }: SharedAccessPageProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      role: 'edit',
      status: 'active'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@email.com',
      role: 'view-only',
      status: 'pending'
    }
  ]);

  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    email: '',
    role: 'view-only' as 'view-only' | 'edit'
  });

  const handleAddCollaborator = () => {
    if (!newCollaborator.name || !newCollaborator.email) {
      toast.error('Please fill in all fields');
      return;
    }

    const newCollab: Collaborator = {
      id: Date.now().toString(),
      name: newCollaborator.name,
      email: newCollaborator.email,
      role: newCollaborator.role,
      status: 'pending'
    };

    setCollaborators([...collaborators, newCollab]);
    setNewCollaborator({ name: '', email: '', role: 'view-only' });
    toast.success('Invitation sent successfully!');
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
    toast.success('Collaborator removed');
  };

  const handleRoleChange = (id: string, newRole: 'view-only' | 'edit') => {
    setCollaborators(collaborators.map(c => 
      c.id === id ? { ...c, role: newRole } : c
    ));
    toast.success('Role updated successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
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
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              Shared Access
            </h1>
          </div>
        </div>

        {/* Add New Collaborator */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-gray-800">
              <UserPlus className="w-6 h-6 mr-3 text-green-600" />
              Add Co-host or Collaborator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter collaborator's name"
                  value={newCollaborator.name}
                  onChange={(e) => setNewCollaborator({ ...newCollaborator, name: e.target.value })}
                  className="border-lime-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newCollaborator.email}
                  onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}
                  className="border-lime-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Permission Level
              </Label>
              <Select 
                value={newCollaborator.role} 
                onValueChange={(value: 'view-only' | 'edit') => 
                  setNewCollaborator({ ...newCollaborator, role: value })
                }
              >
                <SelectTrigger className="border-lime-200 focus:border-green-400 focus:ring-green-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-lime-200">
                  <SelectItem value="view-only">View Only</SelectItem>
                  <SelectItem value="edit">Edit Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAddCollaborator}
              className="w-full bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </CardContent>
        </Card>

        {/* Current Collaborators */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Current Contributors ({collaborators.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-4 bg-lime-50 rounded-lg border border-lime-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{collaborator.name}</h3>
                      <p className="text-sm text-gray-600">{collaborator.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          collaborator.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {collaborator.status}
                        </span>
                        <span className="flex items-center text-xs text-gray-500">
                          {collaborator.role === 'edit' ? (
                            <>
                              <Edit className="w-3 h-3 mr-1" />
                              Edit Access
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              View Only
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={collaborator.role} 
                      onValueChange={(value: 'view-only' | 'edit') => 
                        handleRoleChange(collaborator.id, value)
                      }
                    >
                      <SelectTrigger className="w-32 border-lime-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-lime-200">
                        <SelectItem value="view-only">View Only</SelectItem>
                        <SelectItem value="edit">Edit Access</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
