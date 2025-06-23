
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
        
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto animate-fade-in animation-delay-200">
          Ready to make some magic happen? ✨ Turn your event planning from chaos to celebration with your new bestie! 
          From intimate family gatherings to grand celebrations, we've got everything you need to create unforgettable moments.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="font-bold text-xl mb-4">Lightning Fast Setup</h3>
              <p className="text-gray-600 leading-relaxed">
                Set up your first event in under 2 minutes! Our intuitive workflow guides you through every step, making event planning feel like a breeze.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="font-bold text-xl mb-4">Made for Nigeria</h3>
              <p className="text-gray-600 leading-relaxed">
                WhatsApp integration, Naira tracking, local vendor connections, and features designed specifically for Nigerian celebrations and culture.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-6">💝</div>
              <h3 className="font-bold text-xl mb-4">Free to Start</h3>
              <p className="text-gray-600 leading-relaxed">
                Plan your first amazing event completely free! No hidden costs, no credit card required. Just pure event planning joy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🎊</div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Smart Workflow System</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our step-by-step workflow ensures you never miss important details. From creating your event to tracking RSVPs, 
                each stage builds naturally into the next.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Guided event creation process</li>
                <li>✓ Automatic task prioritization</li>
                <li>✓ Progress tracking at every step</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Collaborative Planning</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Share the planning load! Invite family and friends to help organize, assign tasks, 
                and keep everyone in the loop with real-time updates.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Team member invitations</li>
                <li>✓ Task assignment and tracking</li>
                <li>✓ WhatsApp group integration</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
