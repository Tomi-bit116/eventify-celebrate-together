
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Plus, 
  Users, 
  DollarSign, 
  Share2,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuickStartGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: () => void;
  onInviteGuests: () => void;
  onManageBudget: () => void;
  onShareEvent: () => void;
}

export const QuickStartGuide = ({ 
  isOpen, 
  onClose, 
  onCreateEvent,
  onInviteGuests,
  onManageBudget,
  onShareEvent
}: QuickStartGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 0,
      title: "Create Your First Event",
      description: "Start by creating your celebration. Add the name, date, venue, and other details.",
      icon: Plus,
      action: onCreateEvent,
      actionText: "Create Event",
      color: "from-blue-500 to-purple-500"
    },
    {
      id: 1,
      title: "Invite Your Guests",
      description: "Build your guest list and send beautiful invitations to friends and family.",
      icon: Users,
      action: onInviteGuests,
      actionText: "Invite Guests",
      color: "from-green-500 to-blue-500"
    },
    {
      id: 2,
      title: "Manage Your Budget",
      description: "Track expenses, set budgets for different categories, and stay on top of costs.",
      icon: DollarSign,
      action: onManageBudget,
      actionText: "Set Budget",
      color: "from-yellow-500 to-green-500"
    },
    {
      id: 3,
      title: "Share Your Event",
      description: "Generate beautiful posters and share your event on social media platforms.",
      icon: Share2,
      action: onShareEvent,
      actionText: "Share Event",
      color: "from-pink-500 to-orange-500"
    }
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    // Move to next step if not at the end
    if (stepId < steps.length - 1) {
      setCurrentStep(stepId + 1);
    }
  };

  const handleStepAction = (step: typeof steps[0]) => {
    step.action();
    handleStepComplete(step.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-lg shadow-xl">
        <DialogHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="flex items-center space-x-2 text-2xl font-bold">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Eventify!
            </span>
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Let's get you started with creating amazing celebrations in just a few steps.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              
              return (
                <Card 
                  key={step.id}
                  className={`transition-all duration-300 ${
                    isCurrent 
                      ? 'ring-2 ring-orange-300 shadow-lg scale-[1.02]' 
                      : isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : 'hover:shadow-md'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <step.icon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{step.title}</h3>
                          {isCompleted && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {!isCompleted && (
                        <Button
                          onClick={() => handleStepAction(step)}
                          size="sm"
                          className={`bg-gradient-to-r ${step.color} hover:opacity-90 text-white`}
                        >
                          {step.actionText}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Completion Message */}
          {completedSteps.length === steps.length && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 mb-1">Congratulations! 🎉</h3>
                <p className="text-sm text-green-600">
                  You've completed the quick start guide. You're ready to create amazing events!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </Button>
            <p className="text-xs text-gray-500">
              {completedSteps.length} of {steps.length} completed
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
