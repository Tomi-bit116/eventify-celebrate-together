
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Calendar, Users, CheckSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface NewUserQuickStartGuideProps {
  onClose: () => void;
}

export const NewUserQuickStartGuide = ({ onClose }: NewUserQuickStartGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();

  const steps = [
    {
      icon: Calendar,
      title: "Create Your First Event",
      description: "Start by creating your celebration. Click 'Create New Event' to add your event details like name, date, and venue.",
      color: "from-coral-500 to-coral-600",
      illustration: "🎉"
    },
    {
      icon: Users,
      title: "Invite Your Guests",
      description: "Generate beautiful invitation links and share them via WhatsApp, email, or SMS. Your guests can RSVP instantly!",
      color: "from-teal-500 to-teal-600",
      illustration: "📧"
    },
    {
      icon: CheckSquare,
      title: "Track Your Progress",
      description: "Monitor RSVPs, manage tasks, and keep everything organized. Watch your event come together seamlessly!",
      color: "from-amber-500 to-amber-600",
      illustration: "✅"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Mark user as no longer new
    if (user) {
      await supabase.auth.updateUser({
        data: { is_new_user: false }
      });
    }
    onClose();
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 font-montserrat">
      <Card className="w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-500 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-coral-500 to-teal-500 p-6 text-white relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to Eventify! 🎊</h2>
              <p className="text-coral-50">Let's get you started in 3 simple steps</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="flex justify-center space-x-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-coral-500 scale-125' 
                      : index < currentStep 
                        ? 'bg-teal-500' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="px-6 pb-6">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center text-3xl animate-in zoom-in-50 duration-300`}>
                <span>{steps[currentStep].illustration}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {steps[currentStep].title}
              </h3>

              <p className="text-gray-600 leading-relaxed px-4">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="text-xs text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>

              <Button
                onClick={nextStep}
                className={`flex items-center gap-2 px-4 bg-gradient-to-r ${steps[currentStep].color} hover:opacity-90 text-white`}
              >
                {currentStep === steps.length - 1 ? "Let's Go!" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Skip Option */}
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={handleComplete}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
