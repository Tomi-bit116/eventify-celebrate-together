
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Users, UserPlus, Mail, Trash2, Crown, Edit, Eye, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'accepted' | 'declined';
  invitedAt: string;
  acceptedAt?: string;
}

interface EnhancedSharedAccessPageProps {
  onBack: () => void;
}

export const EnhancedSharedAccessPage = ({ onBack }: EnhancedSharedAccessPageProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { 
      id: '1', 
      name: 'Sarah Johnson', 
      email: 'sarah@email.com', 
      role: 'editor', 
      status: 'accepted',
      invitedAt: '2024-01-15',
      acceptedAt: '2024-01-16'
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

    // Check if email already exists
    if (collaborators.some(c => c.email === inviteData.email)) {
      toast.error("This email is already invited");
      return;
    }

    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: inviteData.name,
      email: inviteData.email,
      role: inviteData.role,
      status: 'pending',
      invitedAt: new Date().toISOString().split('T')[0]
    };

    setCollaborators([...collaborators, newCollaborator]);

    // Send actual email invitation
    try {
      const subject = "You're invited to collaborate on our event!";
      const acceptLink = `${window.location.origin}/accept-invite/${newCollaborator.id}`;
      const body = `Hi ${inviteData.name},\n\n${inviteData.message}\n\nYou have been invited as a ${inviteData.role} to help plan our event.\n\nClick the link below to accept the invitation:\n${acceptLink}\n\nBest regards,\nThe Event Planning Team`;
      
      const emailUrl = `mailto:${inviteData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(emailUrl);
      
      toast.success(`Invitation sent to ${inviteData.name}!`);
      setIsInviteModalOpen(false);
      setInviteData({ name: '', email: '', role: 'viewer', message: 'You have been invited to collaborate on our event planning!' });
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  const handleAcceptInvite = (collaboratorId: string) => {
    setCollaborators(collaborators.map(c => 
      c.id === collaboratorId 
        ? { ...c, status: 'accepted', acceptedAt: new Date().toISOString().split('T')[0] }
        : c
    ));
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    toast.success(`${collaborator?.name} has accepted the invitation!`);
  };

  const handleDeclineInvite = (collaboratorId: string) => {
    setCollaborators(collaborators.map(c => 
      c.id === collaboratorId ? { ...c, status: 'declined' } : c
    ));
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    toast.info(`${collaborator?.name} has declined the invitation.`);
  };

  const handleResendInvite = (collaborator: Collaborator) => {
    const subject = "Reminder: You're invited to collaborate on our event!";
    const acceptLink = `${window.location.origin}/accept-invite/${collaborator.id}`;
    const body = `Hi ${collaborator.name},\n\nThis is a reminder that you have been invited to collaborate on our event planning.\n\nClick the link below to accept the invitation:\n${acceptLink}\n\nBest regards,\nThe Event Planning Team`;
    
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 md:p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-4 md:mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mr-2 md:mr-4 hover:bg-blue-100 p-2"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Shared Access
            </h1>
          </div>
        </div>

        {/* Invite Collaborator Section */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm mb-4 md:mb-6">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="flex items-center text-blue-700 text-base md:text-lg">
                <UserPlus className="w-4 h-4 md:w-6 md:h-6 mr-2" />
                Invite Collaborators
              </span>
              <Button 
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Collaborator
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              Invite friends, family, or co-planners to help you organize your event. You can assign different permission levels.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-yellow-50 p-3 md:p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center mb-2">
                  <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-yellow-800 text-sm md:text-base">Admin</h3>
                </div>
                <p className="text-xs md:text-sm text-yellow-700">Full access to edit, delete, and manage all aspects of the event</p>
              </div>
              
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Edit className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-800 text-sm md:text-base">Editor</h3>
                </div>
                <p className="text-xs md:text-sm text-blue-700">Can edit event details, manage guests, and update information</p>
              </div>
              
              <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <Eye className="w-4 h-4 md:w-5 md:h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-800 text-sm md:text-base">Viewer</h3>
                </div>
                <p className="text-xs md:text-sm text-green-700">View-only access to event details and planning progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collaborators List */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center text-base md:text-lg">
              <Users className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Current Collaborators ({collaborators.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border gap-3 lg:gap-0">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm md:text-base">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">{collaborator.name}</h3>
                      <p className="text-xs md:text-sm text-gray-600 truncate">{collaborator.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <p className="text-xs text-gray-500">Invited: {collaborator.invitedAt}</p>
                        {collaborator.acceptedAt && (
                          <p className="text-xs text-gray-500">• Joined: {collaborator.acceptedAt}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(collaborator.role)}
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(collaborator.role)}`}>
                        {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(collaborator.status)}
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collaborator.status)}`}>
                        {collaborator.status.charAt(0).toUpperCase() + collaborator.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {collaborator.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptInvite(collaborator.id)}
                            className="bg-green-500 hover:bg-green-600 text-xs p-2"
                          >
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeclineInvite(collaborator.id)}
                            className="bg-red-500 hover:bg-red-600 text-xs p-2"
                          >
                            <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleResendInvite(collaborator)}
                            className="bg-blue-500 hover:bg-blue-600 text-xs p-2"
                          >
                            <Send className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                        </>
                      )}
                      
                      <Select 
                        value={collaborator.role} 
                        onValueChange={(value: 'admin' | 'editor' | 'viewer') => 
                          handleRoleChange(collaborator.id, value)
                        }
                      >
                        <SelectTrigger className="w-20 md:w-24 h-8 text-xs">
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
                        className="p-2"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
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
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Invite Collaborator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="collaboratorName" className="text-sm">Name</Label>
                <Input
                  id="collaboratorName"
                  placeholder="Enter collaborator's name"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="collaboratorEmail" className="text-sm">Email</Label>
                <Input
                  id="collaboratorEmail"
                  type="email"
                  placeholder="collaborator@email.com"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="collaboratorRole" className="text-sm">Role</Label>
                <Select 
                  value={inviteData.role} 
                  onValueChange={(value: 'admin' | 'editor' | 'viewer') => 
                    setInviteData({...inviteData, role: value})
                  }
                >
                  <SelectTrigger className="text-sm">
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
                <Label htmlFor="inviteMessage" className="text-sm">Invitation Message</Label>
                <textarea
                  id="inviteMessage"
                  rows={3}
                  className="w-full p-2 border rounded-lg text-sm"
                  value={inviteData.message}
                  onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleInviteCollaborator}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsInviteModalOpen(false)}
                  className="text-sm"
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
