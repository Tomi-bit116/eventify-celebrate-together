
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Dashboard } from '@/components/Dashboard';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CTASection } from '@/components/landing/CTASection';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setShowDashboard(true);
    }
  }, [user, loading]);

  const handleGetStarted = () => {
    if (user) {
      setShowOnboarding(true);
    } else {
      navigate('/auth');
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowDashboard(true);
  };

  const handleBackToLanding = () => {
    setShowOnboarding(false);
    setShowDashboard(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
            <span className="text-2xl text-white">☀️</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && showDashboard) {
    return <Dashboard />;
  }

  if (user && showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onBack={handleBackToLanding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50">
      <Navbar onGetStarted={handleGetStarted} onSignIn={handleSignIn} />
      
      <HeroSection 
        onGetStarted={handleGetStarted} 
        onSignIn={handleSignIn}
      />
      
      <FeaturesSection />
      
      <CTASection onGetStarted={handleGetStarted} />
    </div>
  );
};

export default Index;
