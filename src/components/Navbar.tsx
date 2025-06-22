
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onGetStarted: () => void;
}

export const Navbar = ({ onGetStarted }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎉</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-coral-600 to-pink-600 bg-clip-text text-transparent">
              Eventify
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-coral-600 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-coral-600 transition-colors">
              Success Stories
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-coral-600 transition-colors">
              Pricing
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-coral-600"
            >
              Sign In
            </Button>
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started 🚀
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
