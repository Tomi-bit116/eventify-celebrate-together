
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onShowAuth: () => void;
}

export const CTASection = ({ onShowAuth }: CTASectionProps) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-coral-500 via-pink-500 to-orange-500">
      <div className="max-w-4xl mx-auto text-center text-white">
        <div className="animate-bounce mb-6">
          <span className="text-6xl">🎈</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to plan something incredible?
        </h2>
        
        <p className="text-xl mb-8 opacity-90">
          Your dream event is just a few clicks away. Let's make it happen together! 💫
        </p>
        
        <Button 
          onClick={onShowAuth}
          className="bg-white text-coral-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
        >
          Start Planning Now - It's Free! 🎉
        </Button>
        
        <p className="text-sm mt-4 opacity-75">
          No credit card required • 2-minute setup • Cancel anytime
        </p>
      </div>
    </section>
  );
};
