
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressOverviewProps {
  completedTasks: number;
  totalTasks: number;
}

export const ProgressOverview = ({ completedTasks, totalTasks }: ProgressOverviewProps) => {
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="mb-6 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Progress Overview</span>
          <span className="text-sm text-gray-600">{completedTasks}/{totalTasks} tasks completed</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-blue-600">{Math.round(completionPercentage)}%</span>
          <span className="text-gray-600 ml-2">Complete</span>
        </div>
      </CardContent>
    </Card>
  );
};
