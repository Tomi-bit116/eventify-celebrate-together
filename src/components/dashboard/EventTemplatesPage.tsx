import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Users, DollarSign, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

interface EventTemplatesPageProps {
  onBack: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  tasks: string[];
  guestCategories: string[];
  budgetCategories: string[];
}

export const EventTemplatesPage = ({ onBack }: EventTemplatesPageProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const templates: Template[] = [
    {
      id: 'wedding',
      name: 'Wedding',
      description: 'Traditional Nigerian wedding ceremony',
      emoji: '💒',
      color: 'from-pink-400 to-rose-500',
      tasks: [
        'Book venue',
        'Send save the dates',
        'Choose caterer',
        'Buy wedding rings',
        'Arrange photography',
        'Order wedding cake',
        'Plan bachelor/bachelorette parties',
        'Final guest count',
        'Rehearsal dinner'
      ],
      guestCategories: ['Family', 'Friends', 'Colleagues', 'Extended Family'],
      budgetCategories: ['Venue', 'Catering', 'Photography', 'Decorations', 'Clothing', 'Transportation']
    },
    {
      id: 'birthday',
      name: 'Birthday Party',
      description: 'Celebrate another year of life',
      emoji: '🎂',
      color: 'from-blue-400 to-purple-500',
      tasks: [
        'Choose theme',
        'Book venue',
        'Send invitations',
        'Order cake',
        'Plan activities/games',
        'Buy decorations',
        'Arrange music/DJ',
        'Prepare party favors',
        'Confirm catering'
      ],
      guestCategories: ['Family', 'Friends', 'Classmates', 'Neighbors'],
      budgetCategories: ['Venue', 'Food & Drinks', 'Cake', 'Decorations', 'Entertainment', 'Party Favors']
    },
    {
      id: 'baby-shower',
      name: 'Baby Shower',
      description: 'Welcome the little one',
      emoji: '🍼',
      color: 'from-yellow-400 to-orange-500',
      tasks: [
        'Set date and time',
        'Create guest list',
        'Choose theme',
        'Send invitations',
        'Plan games',
        'Order decorations',
        'Arrange catering',
        'Create gift registry',
        'Prepare thank you cards'
      ],
      guestCategories: ['Family', 'Close Friends', 'Colleagues', 'Neighbors'],
      budgetCategories: ['Decorations', 'Food & Drinks', 'Games & Prizes', 'Venue', 'Invitations', 'Favors']
    },
    {
      id: 'naming-ceremony',
      name: 'Naming Ceremony',
      description: 'Traditional child naming celebration',
      emoji: '👶',
      color: 'from-green-400 to-teal-500',
      tasks: [
        'Choose ceremony date',
        'Invite extended family',
        'Prepare traditional items',
        'Arrange religious leader',
        'Plan traditional foods',
        'Prepare gift list',
        'Set up ceremony space',
        'Arrange photography',
        'Prepare speeches'
      ],
      guestCategories: ['Extended Family', 'Family Friends', 'Religious Community', 'Elders'],
      budgetCategories: ['Traditional Items', 'Food & Drinks', 'Gifts', 'Photography', 'Venue', 'Transportation']
    }
  ];

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    
    // Here you would typically apply the template to the user's event
    toast.success(`${selectedTemplate.name} template applied! Your event is ready to customize.`);
    onBack();
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              Event Templates
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose Your Event Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                    selectedTemplate?.id === template.id 
                      ? 'ring-2 ring-green-400 bg-green-50' 
                      : 'bg-white/90 backdrop-blur-sm hover:bg-lime-50'
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <span className="text-2xl">{template.emoji}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          <div>
            {selectedTemplate ? (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    <span className="text-2xl mr-3">{selectedTemplate.emoji}</span>
                    {selectedTemplate.name} Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tasks Preview */}
                  <div>
                    <div className="flex items-center mb-3">
                      <CheckSquare className="w-5 h-5 mr-2 text-green-600" />
                      <h4 className="font-medium text-gray-800">Tasks ({selectedTemplate.tasks.length})</h4>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedTemplate.tasks.slice(0, 5).map((task, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          {task}
                        </div>
                      ))}
                      {selectedTemplate.tasks.length > 5 && (
                        <p className="text-xs text-gray-500 italic">
                          +{selectedTemplate.tasks.length - 5} more tasks...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Guest Categories */}
                  <div>
                    <div className="flex items-center mb-3">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      <h4 className="font-medium text-gray-800">Guest Categories</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.guestCategories.map((category, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-lime-100 text-green-700 rounded-full text-xs font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Budget Categories */}
                  <div>
                    <div className="flex items-center mb-3">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                      <h4 className="font-medium text-gray-800">Budget Categories</h4>
                    </div>
                    <div className="space-y-1">
                      {selectedTemplate.budgetCategories.map((category, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleUseTemplate}
                    className="w-full bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white"
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Select a Template
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose an event type to see what's included in the template
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
