
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onGetStarted: () => void;
}

export const Navbar = ({ onGetStarted }: NavbarProps) => {
  const handleSignIn = () => {
    console.log('Sign in clicked');
    // Sign in logic will be implemented here
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-lg text-white">☀️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Eventify
              </span>
              <span className="text-xs text-gray-500 -mt-1">Plan with confidence</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Features
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Success Stories
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
              Pricing
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleSignIn}
              variant="ghost" 
              className="text-gray-600 hover:text-orange-600 border border-transparent hover:border-orange-200 transition-all duration-300 font-medium"
            >
              Sign In
            </Button>
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
