
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Plus } from 'lucide-react';

interface EmptyEventsStateProps {
  onCreateEvent: () => void;
}

export const EmptyEventsState = ({ onCreateEvent }: EmptyEventsStateProps) => {
  return (
    <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
      <CardContent className="p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No events yet</h3>
        <p className="text-gray-600 mb-6">Create your first event to get started with planning!</p>
        <Button 
          onClick={onCreateEvent}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Event
        </Button>
      </CardContent>
    </Card>
  );
};
