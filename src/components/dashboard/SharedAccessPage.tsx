
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Users, UserPlus, Mail, Trash2, Crown, Edit, Eye, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'accepted' | 'declined';
  invitedAt: string;
}

interface SharedAccessPageProps {
  onBack: () => void;
}

export const SharedAccessPage = ({ onBack }: SharedAccessPageProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { 
      id: '1', 
      name: 'Sarah Johnson', 
      email: 'sarah@email.com', 
      role: 'editor', 
      status: 'accepted',
      invitedAt: '2024-01-15'
    },
    { 
      id: '2', 
      name: 'Mike Chen', 
      email: 'mike@email.com', 
      role: 'viewer', 
      status: 'pending',
      invitedAt: '2024-01-20'
    },
  ]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
    message: 'You have been invited to collaborate on our event planning!'
  });

  const handleInviteCollaborator = async () => {
    if (!inviteData.name || !inviteData.email) {
      toast.error("Please provide name and email");
      return;
    }

    if (!inviteData.email.includes('@')) {
      toast.error("Please provide a valid email address");
      return;
    }

    // Create new collaborator
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: inviteData.name,
      email: inviteData.email,
      role: inviteData.role,
      status: 'pending',
      invitedAt: new Date().toISOString().split('T')[0]
    };

    setCollaborators([...collaborators, newCollaborator]);

    // Simulate sending invitation email
    try {
      const subject = "You're invited to collaborate on our event!";
      const body = `Hi ${inviteData.name},\n\n${inviteData.message}\n\nYou have been invited as a ${inviteData.role} to help plan our event.\n\nClick the link below to accept the invitation:\nhttps://eventify.app/accept-invite/${newCollaborator.id}\n\nBest regards,\nThe Event Planning Team`;
      
      // Open default email client with pre-filled invitation
      const emailUrl = `mailto:${inviteData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(emailUrl);
      
      toast.success(`Invitation sent to ${inviteData.name}!`);
      setIsInviteModalOpen(false);
      setInviteData({ name: '', email: '', role: 'viewer', message: 'You have been invited to collaborate on our event planning!' });
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  const handleResendInvite = (collaborator: Collaborator) => {
    const subject = "Reminder: You're invited to collaborate on our event!";
    const body = `Hi ${collaborator.name},\n\nThis is a reminder that you have been invited to collaborate on our event planning.\n\nClick the link below to accept the invitation:\nhttps://eventify.app/accept-invite/${collaborator.id}\n\nBest regards,\nThe Event Planning Team`;
    
    const emailUrl = `mailto:${collaborator.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
    toast.success(`Reminder sent to ${collaborator.name}!`);
  };

  const handleRemoveCollaborator = (id: string) => {
    const collaborator = collaborators.find(c => c.id === id);
    setCollaborators(collaborators.filter(c => c.id !== id));
    toast.success(`${collaborator?.name} removed from collaborators`);
  };

  const handleRoleChange = (collaboratorId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    setCollaborators(collaborators.map(c => 
      c.id === collaboratorId ? { ...c, role: newRole } : c
    ));
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    toast.success(`${collaborator?.name}'s role updated to ${newRole}`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-blue-600" />;
      default:
        return <Eye className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-4 hover:bg-blue-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Shared Access
            </h1>
          </div>
        </div>

        {/* Invite Collaborator Section */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center text-blue-700">
                <UserPlus className="w-6 h-6 mr-2" />
                Invite Collaborators
              </span>
              <Button 
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Collaborator
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Invite friends, family, or co-planners to help you organize your event. You can assign different permission levels.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center mb-2">
                  <Crown className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-yellow-800">Admin</h3>
                </div>
                <p className="text-sm text-yellow-700">Full access to edit, delete, and manage all aspects of the event</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Edit className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-800">Editor</h3>
                </div>
                <p className="text-sm text-blue-700">Can edit event details, manage guests, and update information</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <Eye className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-800">Viewer</h3>
                </div>
                <p className="text-sm text-green-700">View-only access to event details and planning progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collaborators List */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Current Collaborators ({collaborators.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{collaborator.name}</h3>
                      <p className="text-sm text-gray-600">{collaborator.email}</p>
                      <p className="text-xs text-gray-500">Invited: {collaborator.invitedAt}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(collaborator.role)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(collaborator.role)}`}>
                        {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                      </span>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collaborator.status)}`}>
                      {collaborator.status.charAt(0).toUpperCase() + collaborator.status.slice(1)}
                    </span>
                    
                    <div className="flex space-x-2">
                      {collaborator.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleResendInvite(collaborator)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Select 
                        value={collaborator.role} 
                        onValueChange={(value: 'admin' | 'editor' | 'viewer') => 
                          handleRoleChange(collaborator.id, value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invite Modal */}
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Collaborator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="collaboratorName">Name</Label>
                <Input
                  id="collaboratorName"
                  placeholder="Enter collaborator's name"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="collaboratorEmail">Email</Label>
                <Input
                  id="collaboratorEmail"
                  type="email"
                  placeholder="collaborator@email.com"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="collaboratorRole">Role</Label>
                <Select 
                  value={inviteData.role} 
                  onValueChange={(value: 'admin' | 'editor' | 'viewer') => 
                    setInviteData({...inviteData, role: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - View only access</SelectItem>
                    <SelectItem value="editor">Editor - Can edit and update</SelectItem>
                    <SelectItem value="admin">Admin - Full access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="inviteMessage">Invitation Message</Label>
                <textarea
                  id="inviteMessage"
                  rows={3}
                  className="w-full p-2 border rounded-lg"
                  value={inviteData.message}
                  onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleInviteCollaborator}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsInviteModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
