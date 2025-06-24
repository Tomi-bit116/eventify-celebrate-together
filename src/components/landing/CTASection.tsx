
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection = ({ onGetStarted }: CTASectionProps) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
      <div className="max-w-4xl mx-auto text-center text-white">
        <div className="animate-bounce mb-8">
          <span className="text-5xl">🎊</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to create something extraordinary?
        </h2>
        
        <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto">
          Join thousands of celebration planners who trust Eventify to bring their visions to life. 
          Your perfect event starts here.
        </p>
        
        <Button 
          onClick={onGetStarted}
          className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
        >
          Start Your Celebration Journey
        </Button>
        
        <p className="text-sm mt-6 opacity-80">
          No credit card required • Free to start • Premium features available
        </p>
      </div>
    </section>
  );
};
