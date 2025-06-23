
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface ProgressTrackerProps {
  currentStep: number;
  completedSteps: string[];
}

const steps = [
  { id: 'create', title: 'Event Created', description: 'Basic event details set up' },
  { id: 'guests', title: 'Guests Invited', description: 'Guest list created and invitations sent' },
  { id: 'budget', title: 'Budget Planned', description: 'Budget categories and limits defined' },
  { id: 'tasks', title: 'Tasks Organized', description: 'Timeline and checklist created' },
  { id: 'analytics', title: 'Ready to Launch', description: 'All preparations complete' }
];

export const ProgressTracker = ({ currentStep, completedSteps }: ProgressTrackerProps) => {
  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
        <span className="text-sm font-medium text-gray-600">
          {completedSteps.length} of {steps.length} completed
        </span>
      </div>

      <div className="mb-6">
        <Progress value={progressPercentage} className="h-3" />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Getting Started</span>
          <span>{progressPercentage.toFixed(0)}% Complete</span>
          <span>Ready to Celebrate! 🎉</span>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                isCompleted
                  ? 'bg-green-50 border-green-200 border'
                  : isCurrent
                  ? 'bg-coral-50 border-coral-200 border'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : isCurrent ? (
                  <Clock className="w-5 h-5 text-coral-600 animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-medium ${
                  isCompleted ? 'text-green-800' : isCurrent ? 'text-coral-800' : 'text-gray-700'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${
                  isCompleted ? 'text-green-600' : isCurrent ? 'text-coral-600' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>

              {isCompleted && (
                <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  ✓ Done
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
