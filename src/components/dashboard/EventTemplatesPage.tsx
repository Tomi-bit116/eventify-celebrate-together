
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Calendar, Users, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface EventTemplatesPageProps {
  onBack: () => void;
  onCreateEvent: () => void;
}

interface EventTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultGuests: number;
  defaultBudget: number;
  defaultDuration: string;
  checklist: string[];
  venue: string;
}

export const EventTemplatesPage = ({ onBack, onCreateEvent }: EventTemplatesPageProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);

  const templates: EventTemplate[] = [
    {
      id: 'wedding',
      name: 'Wedding Celebration',
      description: 'Plan the perfect wedding with our comprehensive template',
      icon: '💍',
      color: 'from-pink-500 to-rose-600',
      defaultGuests: 100,
      defaultBudget: 25000,
      defaultDuration: '6-8 hours',
      checklist: ['Book venue', 'Send invitations', 'Order flowers', 'Book photographer', 'Arrange catering'],
      venue: 'Wedding venue or church'
    },
    {
      id: 'birthday',
      name: 'Birthday Party',
      description: 'Celebrate another year with a fantastic birthday bash',
      icon: '🎂',
      color: 'from-yellow-500 to-orange-600',
      defaultGuests: 30,
      defaultBudget: 2000,
      defaultDuration: '3-4 hours',
      checklist: ['Book venue', 'Order cake', 'Send invitations', 'Plan activities', 'Arrange decorations'],
      venue: 'Party hall or home'
    },
    {
      id: 'corporate',
      name: 'Corporate Event',
      description: 'Professional events for networking and business',
      icon: '🏢',
      color: 'from-blue-500 to-indigo-600',
      defaultGuests: 50,
      defaultBudget: 5000,
      defaultDuration: '4-6 hours',
      checklist: ['Book venue', 'Arrange catering', 'Set up AV equipment', 'Send invitations', 'Plan agenda'],
      venue: 'Conference center or hotel'
    },
    {
      id: 'graduation',
      name: 'Graduation Party',
      description: 'Celebrate academic achievements in style',
      icon: '🎓',
      color: 'from-green-500 to-emerald-600',
      defaultGuests: 40,
      defaultBudget: 3000,
      defaultDuration: '4-5 hours',
      checklist: ['Book venue', 'Order decorations', 'Plan menu', 'Send invitations', 'Arrange entertainment'],
      venue: 'Banquet hall or garden'
    },
    {
      id: 'anniversary',
      name: 'Anniversary Celebration',
      description: 'Commemorate special milestones together',
      icon: '💕',
      color: 'from-purple-500 to-pink-600',
      defaultGuests: 25,
      defaultBudget: 2500,
      defaultDuration: '3-4 hours',
      checklist: ['Book venue', 'Plan menu', 'Send invitations', 'Arrange flowers', 'Plan entertainment'],
      venue: 'Restaurant or intimate venue'
    },
    {
      id: 'baby-shower',
      name: 'Baby Shower',
      description: 'Welcome the new arrival with a beautiful celebration',
      icon: '👶',
      color: 'from-teal-500 to-cyan-600',
      defaultGuests: 20,
      defaultBudget: 1500,
      defaultDuration: '2-3 hours',
      checklist: ['Book venue', 'Plan games', 'Order decorations', 'Send invitations', 'Arrange refreshments'],
      venue: 'Home or community center'
    }
  ];

  const handleUseTemplate = (template: EventTemplate) => {
    // This would normally populate the event creation form with template data
    toast.success(`Using ${template.name} template! Creating your event...`);
    onCreateEvent();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 font-montserrat">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="ghost" className="mr-4 hover:bg-white/50">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-purple-600" />
              Event Templates
            </h1>
            <p className="text-gray-600 mt-2">Choose a template to quickly set up your event</p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 overflow-hidden"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className={`h-2 bg-gradient-to-r ${template.color}`}></div>
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2">{template.icon}</div>
                <CardTitle className="text-xl font-bold text-gray-800">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm text-center">{template.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      Guests
                    </span>
                    <span className="font-medium">{template.defaultGuests}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Budget
                    </span>
                    <span className="font-medium">${template.defaultBudget.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      Duration
                    </span>
                    <span className="font-medium">{template.defaultDuration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      Venue
                    </span>
                    <span className="font-medium text-xs">{template.venue}</span>
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}
                  className={`w-full bg-gradient-to-r ${template.color} hover:opacity-90 text-white`}
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Template Details Modal */}
        {selectedTemplate && (
          <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border-0">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">{selectedTemplate.icon}</div>
              <CardTitle className="text-2xl font-bold text-gray-800">{selectedTemplate.name}</CardTitle>
              <p className="text-gray-600">{selectedTemplate.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Template Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center text-gray-700">
                        <Users className="w-5 h-5 mr-2" />
                        Expected Guests
                      </span>
                      <span className="font-medium">{selectedTemplate.defaultGuests}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center text-gray-700">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Suggested Budget
                      </span>
                      <span className="font-medium">${selectedTemplate.defaultBudget.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-2" />
                        Typical Duration
                      </span>
                      <span className="font-medium">{selectedTemplate.defaultDuration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-2" />
                        Venue Type
                      </span>
                      <span className="font-medium">{selectedTemplate.venue}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Planning Checklist</h3>
                  <div className="space-y-2">
                    {selectedTemplate.checklist.map((item, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setSelectedTemplate(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className={`flex-1 bg-gradient-to-r ${selectedTemplate.color} hover:opacity-90 text-white`}
                >
                  Use This Template
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
