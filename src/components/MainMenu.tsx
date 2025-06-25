
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Menu, 
  X, 
  UserPlus, 
  MessageCircle, 
  FileText, 
  CheckSquare, 
  BookOpen,
  Calendar,
  Clock,
  Settings
} from 'lucide-react';

interface MainMenuProps {
  onFeatureClick: (feature: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const MainMenu = ({ onFeatureClick, isOpen, onToggle }: MainMenuProps) => {
  const menuItems = [
    {
      id: 'shared-access',
      title: 'Shared Access',
      description: 'Invite co-hosts and manage collaborators',
      icon: UserPlus,
      color: 'from-yellow-500 to-green-600'
    },
    {
      id: 'whatsapp-integration',
      title: 'WhatsApp Integration',
      description: 'Share updates via WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-lime-600'
    },
    {
      id: 'event-templates',
      title: 'Event Templates',
      description: 'Pre-built templates for quick setup',
      icon: FileText,
      color: 'from-lime-500 to-emerald-600'
    },
    {
      id: 'task-checklist',
      title: 'Task Checklist',
      description: 'Track progress with deadlines',
      icon: CheckSquare,
      color: 'from-yellow-500 to-lime-600'
    },
    {
      id: 'vendor-contact-book',
      title: 'Vendor\'s Contact Book',
      description: 'Manage vendor details and payments',
      icon: BookOpen,
      color: 'from-green-500 to-yellow-600'
    }
  ];

  const quickAccessItems = [
    {
      id: 'my-events',
      title: 'My Events',
      description: 'View all celebrations',
      icon: Calendar,
      color: 'from-lime-400 to-green-400'
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'Event planning timeline',
      icon: Clock,
      color: 'from-yellow-400 to-lime-400'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'App preferences',
      icon: Settings,
      color: 'from-green-400 to-emerald-400'
    }
  ];

  const handleItemClick = (itemId: string) => {
    onFeatureClick(itemId);
    onToggle(); // Close menu on mobile after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-yellow-500 to-lime-500 text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile Sliding Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-40 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none lg:bg-transparent`}>
        
        {/* Menu Header */}
        <div className="p-6 bg-gradient-to-r from-yellow-500 to-green-500 text-white lg:bg-none lg:text-gray-800">
          <h2 className="text-xl font-bold mb-2">Event Features</h2>
          <p className="text-sm opacity-90 lg:text-gray-600">Manage your celebrations</p>
        </div>

        {/* Main Menu Items */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-700 mb-3">Planning Tools</h3>
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-r from-yellow-50 to-lime-50 hover:from-yellow-100 hover:to-lime-100"
              onClick={() => handleItemClick(item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Quick Access</h3>
          {quickAccessItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-r from-green-50 to-lime-50 hover:from-green-100 hover:to-lime-100 mb-2"
              onClick={() => handleItemClick(item.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};
