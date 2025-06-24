
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Star, Heart } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onShowAuth: () => void;
}

export const HeroSection = ({ onGetStarted, onShowAuth }: HeroSectionProps) => {
  return (
    <section className="pt-20 pb-16 px-4 overflow-hidden relative">
      {/* Floating party elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce animation-delay-300">🎊</div>
        <div className="absolute top-32 right-20 text-3xl animate-pulse animation-delay-700">✨</div>
        <div className="absolute top-48 left-1/4 text-2xl animate-spin animation-delay-1000">🎉</div>
        <div className="absolute bottom-40 right-10 text-3xl animate-bounce animation-delay-500">🥳</div>
        <div className="absolute bottom-60 left-1/3 text-2xl animate-pulse animation-delay-900">💃</div>
      </div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="animate-bounce mb-8">
          <span className="text-8xl">🎯</span>
          <span className="text-4xl animate-wiggle">✨</span>
          <span className="text-6xl animate-spin-slow">🎪</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text text-transparent animate-fade-in">
          Let's Party! 🎉
        </h1>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800 animate-fade-in animation-delay-200">
          Ready to throw the most amazing celebration? 🚀
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto animate-fade-in animation-delay-400">
          From intimate gatherings to grand celebrations - we'll help you plan it perfectly! 
          No stress, no hassle. Just pure fun and amazing memories! 💫
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600 text-white px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse border-4 border-white"
          >
            Get Started - It's Free! 🚀
          </Button>
          
          <Button 
            onClick={onShowAuth}
            variant="outline" 
            className="border-4 border-green-400 text-green-600 hover:bg-green-400 hover:text-white px-10 py-6 text-xl rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Already have an account? Sign In! 👋
          </Button>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-2">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6 animate-bounce">⚡</div>
              <h3 className="font-bold text-2xl mb-4 text-green-800">Super Quick Setup!</h3>
              <p className="text-gray-700 leading-relaxed">
                Set up your celebration in just 2 minutes! Our system guides you step by step, making planning feel like a fun game! 🎮
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:-rotate-2">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6 animate-pulse">🎭</div>
              <h3 className="font-bold text-2xl mb-4 text-orange-800">Made for Celebrations!</h3>
              <p className="text-gray-700 leading-relaxed">
                WhatsApp integration, budget tracking, guest management, plus features that speak your language - literally! 🗣️
              </p>
              <div className="mt-4 text-2xl animate-bounce">🎊🎈🎉</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-pink-100 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-2">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6 animate-spin-slow">💝</div>
              <h3 className="font-bold text-2xl mb-4 text-red-800">Start for Free!</h3>
              <p className="text-gray-700 leading-relaxed">
                Plan your first celebration completely free! No hidden charges, no credit card required. Just pure planning joy! 🎊
              </p>
              <div className="mt-4 flex justify-center">
                <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Celebration showcase */}
        <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
          <div className="text-5xl mb-4 animate-bounce">🎭</div>
          <h3 className="text-3xl font-bold mb-4">Every Type of Celebration!</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl mb-2">💒</div>
              <p>Wedding</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl mb-2">🎂</div>
              <p>Birthday</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl mb-2">🎓</div>
              <p>Graduation</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl mb-2">🎪</div>
              <p>Party</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
