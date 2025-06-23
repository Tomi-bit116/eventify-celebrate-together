
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

export const FeatureCard = ({ icon: Icon, title, description, color, onClick }: FeatureCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border-0 shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 mx-auto rounded-full ${color} flex items-center justify-center mb-4 shadow-sm`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};
