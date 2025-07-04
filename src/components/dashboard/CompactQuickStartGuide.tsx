
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, Users, DollarSign, Share2, ArrowRight, Sparkles } from 'lucide-react';

interface CompactQuickStartGuideProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateEvent: () => void;
  onInviteGuests: () => void;
  onManageBudget: () => void;
  onShareEvent: () => void;
}

export const CompactQuickStartGuide = ({ 
  isVisible, 
  onClose, 
  onCreateEvent,
  onInviteGuests,
  onManageBudget,
  onShareEvent
}: CompactQuickStartGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 0,
      title: "Create Event",
      description: "Start your celebration",
      icon: Plus,
      action: onCreateEvent,
      color: "from-blue-500 to-purple-500"
    },
    {
      id: 1,
      title: "Invite Guests",
      description: "Add your people",
      icon: Users,
      action: onInviteGuests,
      color: "from-green-500 to-blue-500"
    },
    {
      id: 2,
      title: "Set Budget",
      description: "Track expenses",
      icon: DollarSign,
      action: onManageBudget,
      color: "from-yellow-500 to-green-500"
    },
    {
      id: 3,
      title: "Share Event",
      description: "Spread the word",
      icon: Share2,
      action: onShareEvent,
      color: "from-pink-500 to-orange-500"
    }
  ];

  const handleStepAction = (step: typeof steps[0]) => {
    step.action();
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
    }
    
    // Move to next step or close if completed
    if (step.id < steps.length - 1) {
      setCurrentStep(step.id + 1);
    } else {
      setTimeout(() => onClose(), 1000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-gray-800">Quick Start</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-orange-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* Progress indicator */}
            <div className="flex space-x-1 mb-3">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded ${
                    completedSteps.includes(index)
                      ? 'bg-green-500'
                      : index === currentStep
                      ? 'bg-orange-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Current step */}
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center`}>
                    <steps[currentStep].icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {steps[currentStep].title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {steps[currentStep].description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleStepAction(steps[currentStep])}
                  size="sm"
                  className={`bg-gradient-to-r ${steps[currentStep].color} hover:opacity-90 text-white`}
                >
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Completion status */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </p>
              {completedSteps.length === steps.length && (
                <p className="text-xs text-green-600 font-medium">
                  🎉 All set! You&apos;re ready to plan!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
