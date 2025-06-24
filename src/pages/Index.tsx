
import { useState } from 'react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Dashboard } from '@/components/Dashboard';
import { Navbar } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CTASection } from '@/components/landing/CTASection';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleSignIn = () => {
    setShowAuth(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowDashboard(true);
  };

  const handleBackToLanding = () => {
    setShowOnboarding(false);
    setShowDashboard(false);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setShowDashboard(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navbar onGetStarted={handleGetStarted} onSignIn={handleSignIn} />
      
      <HeroSection 
        onGetStarted={handleGetStarted} 
        onSignIn={handleSignIn}
      />
      
      <FeaturesSection />
      
      <CTASection onGetStarted={handleGetStarted} />

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
