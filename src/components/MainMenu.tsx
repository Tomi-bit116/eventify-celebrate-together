
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Menu, 
  X, 
  Plus,
  Users,
  DollarSign,
  UserCheck,
  UserPlus, 
  MessageSquare, 
  FileText, 
  CheckSquare, 
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  CalendarIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MainMenuProps {
  onFeatureClick: (feature: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  currentEvent?: any;
  onEditEvent?: () => void;
  onShareEvent?: () => void;
  onCreateEvent?: () => void;
  events?: any[];
}

export const MainMenu = ({ 
  onFeatureClick, 
  isOpen, 
  onToggle, 
  currentEvent,
  onEditEvent,
  onShareEvent,
  onCreateEvent,
  events = []
}: MainMenuProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/auth');
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  // All menu items in one section
  const menuItems = [
    {
      id: 'create-event',
      title: 'Create Event',
      description: 'Start planning your celebration',
      icon: Plus,
      color: 'from-coral-500 to-coral-600'
    },
    {
      id: 'my-events',
      title: 'My Events',
      description: 'View all celebrations',
      icon: Calendar,
      color: 'from-lime-400 to-green-400'
    },
    {
      id: 'interactive-invite-guests',
      title: 'Invite Guests',
      description: 'Generate links, share invites & track RSVPs',
      icon: Users,
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'enhanced-track-rsvps',
      title: 'Track RSVPs',
      description: 'Monitor guest responses in real-time',
      icon: UserCheck,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'task-checklist',
      title: 'Task Checklist',
      description: 'Track tasks and deadlines',
      icon: CheckSquare,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'manage-budget',
      title: 'Budget Tracker',
      description: 'Monitor expenses and stay on track',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'event-templates',
      title: 'Event Templates',
      description: 'Pre-built templates for quick setup',
      icon: FileText,
      color: 'from-lime-500 to-emerald-600'
    },
    {
      id: 'vendor-contact-book',
      title: 'Vendor Contact Book',
      description: 'Manage vendor details and payments',
      icon: BookOpen,
      color: 'from-green-500 to-yellow-600'
    },
    {
      id: 'enhanced-shared-access',
      title: 'Shared Access & Collaborators',
      description: 'Invite co-hosts, manage collaborators & permissions',
      icon: UserPlus,
      color: 'from-yellow-500 to-green-600'
    },
    {
      id: 'whatsapp-bulk-messaging',
      title: 'WhatsApp Integration',
      description: 'Send bulk messages to multiple contacts',
      icon: MessageSquare,
      color: 'from-green-500 to-lime-600'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'App preferences',
      icon: Settings,
      color: 'from-green-400 to-emerald-400'
    }
  ];

  const handleItemClick = (itemId: string, customAction?: () => void) => {
    if (customAction) {
      customAction();
    } else if (itemId === 'create-event' && onCreateEvent) {
      onCreateEvent();
    } else {
      onFeatureClick(itemId);
    }
    
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={onToggle}
        className="lg:hidden fixed top-4 right-4 z-50 bg-gradient-to-r from-coral-500 to-coral-600 text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 md:w-80 bg-white shadow-2xl transform transition-transform duration-300 z-40 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none lg:bg-transparent`}>
        
        {/* Menu Header */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-coral-500 to-teal-500 text-white lg:bg-none lg:text-gray-800">
          <h2 className="text-lg md:text-xl font-bold mb-2">Eventify</h2>
          <p className="text-sm opacity-90 lg:text-gray-600">Manage your celebrations</p>
        </div>

        {/* Menu Items */}
        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
          {menuItems.map((item) => (
            <Card
              key={`${item.id}-${item.title}`}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-r from-green-50 to-lime-50 hover:from-green-100 hover:to-lime-100 mb-2"
              onClick={() => handleItemClick(item.id)}
            >
              <CardContent className="p-2 md:p-3">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-xs md:text-sm truncate">{item.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sign Out Section */}
        <div className="p-3 md:p-4 border-t border-gray-200 mt-auto">
          <Card
            className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200"
            onClick={handleSignOut}
          >
            <CardContent className="p-2 md:p-3">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-xs md:text-sm">Sign Out</h4>
                  <p className="text-xs text-gray-600">Log out of your account</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
