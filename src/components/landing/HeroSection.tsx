
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
      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-2xl opacity-30 animate-pulse animation-delay-300">✨</div>
        <div className="absolute top-32 right-20 text-2xl opacity-20 animate-pulse animation-delay-700">🌟</div>
        <div className="absolute bottom-40 right-10 text-2xl opacity-25 animate-pulse animation-delay-500">💫</div>
        <div className="absolute bottom-60 left-1/3 text-2xl opacity-30 animate-pulse animation-delay-900">⭐</div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Elegant Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
            <span className="text-3xl text-white">☀️</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Eventify
          </h1>
          <p className="text-lg text-gray-600 font-medium">Your celebration planning companion</p>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Create memorable celebrations with ease
        </h2>
        
        <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
          From intimate gatherings to grand celebrations, Eventify helps you plan every detail 
          with confidence and joy. Organize, invite, budget, and celebrate—all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Free
          </Button>
          
          <Button 
            onClick={onShowAuth}
            variant="outline" 
            className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-10 py-4 text-lg rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Sign In
          </Button>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Simple Planning</h3>
              <p className="text-gray-600 leading-relaxed">
                Intuitive tools that make event planning feel effortless. Set up your celebration in minutes, not hours.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Smart Features</h3>
              <p className="text-gray-600 leading-relaxed">
                Budget tracking, guest management, RSVP monitoring, and vendor coordination—all designed for your success.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Always Free</h3>
              <p className="text-gray-600 leading-relaxed">
                Start planning immediately with our free plan. Upgrade anytime to unlock premium features and support.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Celebration showcase */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-8 text-white shadow-xl">
          <div className="text-3xl mb-4">🎭</div>
          <h3 className="text-2xl font-bold mb-6">Perfect for Every Celebration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors">
              <div className="text-2xl mb-2">💒</div>
              <p className="font-medium">Weddings</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors">
              <div className="text-2xl mb-2">🎂</div>
              <p className="font-medium">Birthdays</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors">
              <div className="text-2xl mb-2">🎓</div>
              <p className="font-medium">Graduations</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors">
              <div className="text-2xl mb-2">🎪</div>
              <p className="font-medium">Parties</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
