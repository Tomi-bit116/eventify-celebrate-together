
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, Lock, CheckCircle2, Clock } from 'lucide-react';

interface WorkflowStepProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  status: 'ready' | 'pending' | 'completed' | 'locked';
  step: number;
  onClick: () => void;
}

export const WorkflowStep = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  hoverColor,
  status, 
  step, 
  onClick 
}: WorkflowStepProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getCardStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 shadow-green-100';
      case 'locked':
        return 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed';
      default:
        return 'bg-white border-gray-200 hover:shadow-xl hover:border-gray-300';
    }
  };

  const getIconStyles = () => {
    switch (status) {
      case 'locked':
        return 'bg-gray-400';
      default:
        return color;
    }
  };

  const handleClick = () => {
    if (status !== 'locked') {
      onClick();
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-2 ${
        status !== 'locked' ? 'hover:scale-105' : ''
      } border-2 ${getCardStyles()} relative overflow-hidden group`}
      onClick={handleClick}
    >
      {/* Step Number Badge */}
      <div className="absolute top-3 right-3 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
        {step}
      </div>

      {/* Status Icon */}
      <div className="absolute top-3 left-3">
        {getStatusIcon()}
      </div>

      <CardContent className="p-6 pt-12 text-center">
        {/* Main Icon */}
        <div className={`w-20 h-20 mx-auto rounded-full ${getIconStyles()} ${
          status !== 'locked' ? `${hoverColor} group-hover:shadow-xl` : ''
        } flex items-center justify-center mb-6 shadow-lg transition-all duration-300 transform group-hover:scale-110`}>
          <Icon className="w-10 h-10 text-white" />
        </div>

        {/* Content */}
        <h3 className={`font-bold text-xl mb-3 transition-colors ${
          status === 'locked' ? 'text-gray-400' : 'text-gray-800 group-hover:text-gray-900'
        }`}>
          {title}
        </h3>
        
        <p className={`text-sm leading-relaxed ${
          status === 'locked' ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-700'
        }`}>
          {description}
        </p>

        {/* Progress Indicator */}
        {status === 'ready' && (
          <div className="mt-4 text-xs font-semibold text-coral-600 animate-pulse">
            Ready to start! 🚀
          </div>
        )}
        
        {status === 'pending' && (
          <div className="mt-4 text-xs font-semibold text-orange-600">
            Complete previous steps first
          </div>
        )}
        
        {status === 'completed' && (
          <div className="mt-4 text-xs font-semibold text-green-600">
            ✅ Completed!
          </div>
        )}
      </CardContent>

      {/* Hover Glow Effect */}
      {status !== 'locked' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-coral-500/0 via-pink-500/0 to-orange-500/0 group-hover:from-coral-500/10 group-hover:via-pink-500/10 group-hover:to-orange-500/10 transition-all duration-300 pointer-events-none"></div>
      )}
    </Card>
  );
};
