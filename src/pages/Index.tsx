import { useState } from 'react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Dashboard } from '@/components/Dashboard';
import { Navbar } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, DollarSign, Star, Heart, Zap } from 'lucide-react';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowDashboard(true);
  };

  const handleBackToLanding = () => {
    setShowOnboarding(false);
    setShowDashboard(false);
  };

  if (showDashboard) {
    return <Dashboard />;
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onBack={handleBackToLanding}
      />
    );
  }

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-500" />,
      title: "Smart Task Lists",
      description: "Never forget a detail! Organized checklists with celebration animations 🎉"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
      title: "Budget Buddy",
      description: "Keep your naira in check with friendly spending alerts and progress tracking ₦"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Team Planning",
      description: "Collaborate with friends and family - planning parties is more fun together! 👥"
    },
    {
      icon: <Calendar className="h-8 w-8 text-coral-500" />,
      title: "Event Dashboard",
      description: "All your celebrations in one place with countdown timers and progress bars 📅"
    }
  ];

  const testimonials = [
    {
      name: "Kemi A.",
      event: "Birthday Bash",
      text: "Eventify made my 30th birthday planning so stress-free! The budget tracker saved me from overspending 😅",
      rating: 5
    },
    {
      name: "David O.",
      event: "Wedding Planning",
      text: "Planning our traditional wedding became fun instead of overwhelming. The collaboration features are amazing! 🎊",
      rating: 5
    },
    {
      name: "Funmi S.",
      event: "Campus Event",
      text: "Organized our department's end-of-year party like a pro. Everyone loved how organized we were! ✨",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      <Navbar onGetStarted={handleGetStarted} />
      
      {/* Hero Section */}
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
              onClick={handleGetStarted}
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

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Everything you need to throw the perfect party! 🎊
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From intimate family gatherings to campus celebrations - we've got your back every step of the way!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-orange-100 to-pink-100 p-3 rounded-full">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Look at these amazing party planners! 🌟
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of Nigerians who've made their events unforgettable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-white to-orange-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.event}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
            onClick={() => setShowAuth(true)}
            className="bg-white text-coral-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
          >
            Start Planning Now - It's Free! 🎉
          </Button>
          
          <p className="text-sm mt-4 opacity-75">
            No credit card required • 2-minute setup • Cancel anytime
          </p>
        </div>
      </section>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default Index;
