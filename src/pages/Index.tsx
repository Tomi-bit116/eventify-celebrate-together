
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      <Navbar onGetStarted={handleGetStarted} />
      
      <HeroSection 
        onGetStarted={handleGetStarted} 
        onShowAuth={() => setShowAuth(true)} 
      />
      
      <FeaturesSection />
      
      <CTASection onShowAuth={() => setShowAuth(true)} />

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default Index;
