
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HeroSectionProps {
  onGetStarted: () => void;
  onShowAuth: () => void;
}

export const HeroSection = ({ onGetStarted, onShowAuth }: HeroSectionProps) => {
  return (
    <section className="pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="animate-bounce mb-8">
          <span className="text-6xl">🎯</span>
          <span className="text-2xl animate-wiggle">✨</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-coral-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent animate-fade-in">
          Hey there, party planner!
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in animation-delay-200">
          Ready to make some magic happen? ✨ Turn your event planning from chaos to celebration with your new bestie!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
          >
            Let's plan something amazing! 🚀
          </Button>
          
          <Button 
            variant="outline" 
            className="border-2 border-emerald-400 text-emerald-600 hover:bg-emerald-400 hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300"
          >
            See how it works 👀
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Set up your first event in under 2 minutes!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-bold text-lg mb-2">Made for Nigeria</h3>
              <p className="text-gray-600">WhatsApp integration, Naira tracking, local vibes!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="font-bold text-lg mb-2">Free to Start</h3>
              <p className="text-gray-600">Plan your first amazing event completely free!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
