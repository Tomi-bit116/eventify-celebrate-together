
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, User, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Oops! Those passwords don't match 😅");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Yaaaas! Welcome to the Eventify family! 🎉");
      onClose();
    }, 2000);
  };

  const handlePhoneSignUp = async () => {
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Check your phone! OTP is on its way 📱");
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome aboard! Let's plan something amazing! 🚀");
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-2xl border-0 shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-4 text-4xl animate-bounce">🎊</div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-coral-600 to-pink-600 bg-clip-text text-transparent">
            Join the Party!
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Ready to make event planning fun and stress-free? Let's get started! ✨
          </p>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="email" className="text-xs">📧 Email</TabsTrigger>
            <TabsTrigger value="phone" className="text-xs">📱 Phone</TabsTrigger>
            <TabsTrigger value="google" className="text-xs">🔍 Google</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Card className="border-0 shadow-none">
              <CardContent className="space-y-4 p-0">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    What should we call you? 😊
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="pl-10 border-gray-200 focus:border-coral-400 focus:ring-coral-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Your email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 border-gray-200 focus:border-coral-400 focus:ring-coral-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Create a secure password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 border-gray-200 focus:border-coral-400 focus:ring-coral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm your password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Type it again"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 border-gray-200 focus:border-coral-400 focus:ring-coral-400"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleEmailSignUp}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? "Creating your account... ✨" : "Let's Start Planning! 🎉"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            <Card className="border-0 shadow-none">
              <CardContent className="space-y-4 p-0">
                <div className="space-y-2">
                  <Label htmlFor="phoneFullName" className="text-sm font-medium text-gray-700">
                    What should we call you? 😊
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneFullName"
                      placeholder="Your full name"
                      className="pl-10 border-gray-200 focus:border-coral-400 focus:ring-coral-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Your phone number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+234 801 234 5678"
                      className="pl-10 border-gray-200 focus:border-coral-400 focus:ring-coral-400"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handlePhoneSignUp}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? "Sending OTP... 📱" : "Send Verification Code 🚀"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="google" className="space-y-4">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0 text-center space-y-4">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 mb-6">
                  Quick and secure sign-up with your Google account. No hassle, just party planning! 🎊
                </p>
                
                <Button 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>{isLoading ? "Signing you in... ✨" : "Continue with Google"}</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-gray-500 text-center mt-4">
          By signing up, you agree to our Terms & Privacy Policy. 
          <br />Ready to make your events unforgettable? 💫
        </p>
      </DialogContent>
    </Dialog>
  );
};
