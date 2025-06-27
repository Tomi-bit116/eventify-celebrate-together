
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Star, Heart, Users, Calendar, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const HeroSection = ({ onGetStarted, onSignIn }: HeroSectionProps) => {
  return (
    <section className="pt-20 pb-16 px-4 overflow-hidden relative">
      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-2xl opacity-20 animate-pulse animation-delay-300">✨</div>
        <div className="absolute top-32 right-20 text-2xl opacity-15 animate-pulse animation-delay-700">🌟</div>
        <div className="absolute bottom-40 right-10 text-2xl opacity-20 animate-pulse animation-delay-500">💫</div>
        <div className="absolute bottom-60 left-1/3 text-2xl opacity-25 animate-pulse animation-delay-900">⭐</div>
      </div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Elegant Logo */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 via-amber-400 to-lime-500 rounded-full shadow-xl mb-6">
            <span className="text-3xl text-white">☀️</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-yellow-500 to-green-500 bg-clip-text text-transparent">
            Eventify
          </h1>
          <p className="text-lg text-gray-600 font-medium">Your celebration planning companion</p>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800 leading-tight">
          Create beautiful celebrations with elegance and ease
        </h2>
        
        <p className="text-xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
          From intimate gatherings to grand celebrations, Eventify brings sophistication to every detail. 
          Plan with confidence, celebrate with joy, and create memories that last a lifetime.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-yellow-500 via-orange-500 to-green-500 hover:from-yellow-600 hover:via-orange-600 hover:to-green-600 text-white px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
          >
            Start Planning Today
          </Button>
          
          <Button 
            onClick={onSignIn}
            variant="outline" 
            className="border-2 border-green-300 text-green-700 hover:bg-green-50 px-12 py-4 text-lg rounded-full transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
          >
            Sign In
          </Button>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Effortless Planning</h3>
              <p className="text-gray-600 leading-relaxed">
                Intuitive tools that transform event planning into a delightful experience. Your celebration starts here.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-lime-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-lime-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Guest Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly invite, track, and coordinate with your guests. Keep everyone connected and excited.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-green-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Smart Organization</h3>
              <p className="text-gray-600 leading-relaxed">
                Budget tracking, task management, and vendor coordination—all designed for your success.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Celebration showcase */}
        <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-green-500 rounded-2xl p-8 text-white shadow-xl">
          <div className="text-4xl mb-6">🎭</div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Perfect for Every Celebration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-3">💒</div>
              <p className="font-semibold text-lg">Weddings</p>
              <p className="text-sm opacity-90 mt-1">Dream ceremonies</p>
            </div>
            <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-3">🎂</div>
              <p className="font-semibold text-lg">Birthdays</p>
              <p className="text-sm opacity-90 mt-1">Special moments</p>
            </div>
            <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-3">🎓</div>
              <p className="font-semibold text-lg">Graduations</p>
              <p className="text-sm opacity-90 mt-1">Achievement celebrations</p>
            </div>
            <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl mb-3">🎪</div>
              <p className="font-semibold text-lg">Corporate</p>
              <p className="text-sm opacity-90 mt-1">Professional events</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
