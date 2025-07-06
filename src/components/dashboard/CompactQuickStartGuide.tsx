
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Lightbulb, Users, Calendar, CheckSquare } from 'lucide-react';

interface CompactQuickStartGuideProps {
  onClose: () => void;
}

export const CompactQuickStartGuide = ({ onClose }: CompactQuickStartGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Calendar,
      title: "Create Your Event",
      description: "Start by clicking 'Create New Event' to set up your celebration details.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Invite Your Guests",
      description: "Use 'Invite Guests' to send beautiful invitations via WhatsApp, email, or social media.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: CheckSquare,
      title: "Track Everything",
      description: "Monitor RSVPs, manage your budget, and check off tasks as you plan.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-800">Quick Start Guide</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center`}>
                <StepIcon className="w-8 h-8 text-white" />
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {steps[currentStep].title}
              </h4>

              <p className="text-gray-600 text-sm leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-4"
              >
                Previous
              </Button>

              <div className="text-xs text-gray-500 self-center">
                {currentStep + 1} of {steps.length}
              </div>

              <Button
                onClick={nextStep}
                className="px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {currentStep === steps.length - 1 ? "Let's Go!" : "Next"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
