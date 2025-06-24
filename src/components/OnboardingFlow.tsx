import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, CheckCircle, DollarSign, Heart, Zap, ChevronLeft, ChevronRight, Upload, MapPin, Phone, Mail, User, Lock, Sparkles } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export const OnboardingFlow = ({ onComplete, onBack }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    eventType: '',
    eventDate: '',
    profileImage: null as File | null,
  });

  const steps = [
    {
      id: 'welcome',
      title: "Welcome to your celebration journey! 🎉",
      subtitle: "Let's create something beautiful together",
      content: <WelcomeStep />
    },
    {
      id: 'features',
      title: "Discover what makes us special ✨",
      subtitle: "Everything you need for perfect celebrations",
      content: <FeatureSlides />
    },
    {
      id: 'signup',
      title: "Let's get to know you! 👋",
      subtitle: "Just a few details to personalize your experience",
      content: <SignUpStep formData={formData} setFormData={setFormData} />
    },
    {
      id: 'contact',
      title: "How can we reach you? 📱",
      subtitle: "Your contact details for updates and reminders",
      content: <ContactStep formData={formData} setFormData={setFormData} />
    },
    {
      id: 'event-setup',
      title: "What are we celebrating? 🎊",
      subtitle: "Tell us about your upcoming event",
      content: <EventSetupStep formData={formData} setFormData={setFormData} />
    },
    {
      id: 'ready',
      title: "You're all set! 🌟",
      subtitle: "Ready to start planning your perfect celebration?",
      content: <ReadyStep />
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col relative overflow-hidden">
      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-2xl opacity-20 animate-pulse animation-delay-300">✨</div>
        <div className="absolute top-20 right-20 text-xl opacity-15 animate-pulse animation-delay-700">🌟</div>
        <div className="absolute bottom-32 left-20 text-2xl opacity-20 animate-pulse animation-delay-1000">💫</div>
        <div className="absolute bottom-40 right-16 text-xl opacity-15 animate-pulse animation-delay-500">⭐</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/90 backdrop-blur-sm p-4 shadow-lg border-b border-orange-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-800">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm font-semibold text-orange-600">{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 relative z-10">
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4 animate-bounce">
              {currentStep === 0 && "🎯"}
              {currentStep === 1 && "✨"}
              {currentStep === 2 && "👋"}
              {currentStep === 3 && "📱"}
              {currentStep === 4 && "🎊"}
              {currentStep === 5 && "🌟"}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 text-lg">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-orange-100">
            <CardContent className="p-8">
              {steps[currentStep].content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center space-x-2 border-2 border-orange-200 hover:border-orange-400 px-6 py-3 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </Button>

            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center space-x-2 px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
            >
              <span>{currentStep === steps.length - 1 ? "Start Planning!" : "Continue"}</span>
              {currentStep === steps.length - 1 ? <Sparkles className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomeStep = () => (
  <div className="text-center py-8">
    <div className="text-5xl mb-8 animate-bounce">🎯✨🎪</div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">
      Transform your event planning experience
    </h2>
    <p className="text-gray-600 leading-relaxed mb-8">
      Welcome to Eventify, where every celebration becomes a masterpiece. 
      We're here to turn your vision into reality with elegance and ease.
    </p>
    <div className="grid grid-cols-3 gap-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
          <CheckCircle className="w-8 h-8 text-orange-600" />
        </div>
        <span className="text-sm text-gray-600 font-medium">Stay Organized</span>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
          <Heart className="w-8 h-8 text-amber-600" />
        </div>
        <span className="text-sm text-gray-600 font-medium">Create Joy</span>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
          <Users className="w-8 h-8 text-yellow-600" />
        </div>
        <span className="text-sm text-gray-600 font-medium">Connect People</span>
      </div>
    </div>
  </div>
);

const FeatureSlides = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const features = [
    {
      icon: <CheckCircle className="w-10 h-10 text-orange-500" />,
      title: "Smart Planning",
      description: "Intelligent checklists and reminders keep you on track",
      color: "from-orange-100 to-amber-100"
    },
    {
      icon: <DollarSign className="w-10 h-10 text-amber-500" />,
      title: "Budget Management",
      description: "Track expenses and stay within budget effortlessly",
      color: "from-amber-100 to-yellow-100"
    },
    {
      icon: <Users className="w-10 h-10 text-yellow-500" />,
      title: "Guest Coordination",
      description: "Seamless invitation and RSVP management",
      color: "from-yellow-100 to-orange-100"
    }
  ];

  return (
    <div className="py-4">
      <div className={`bg-gradient-to-br ${features[activeSlide].color} rounded-lg p-8 mb-6 transition-all duration-300 shadow-lg`}>
        <div className="text-center">
          <div className="mb-6">{features[activeSlide].icon}</div>
          <h3 className="text-xl font-semibold mb-4">{features[activeSlide].title}</h3>
          <p className="text-gray-600 text-lg">{features[activeSlide].description}</p>
        </div>
      </div>
      
      <div className="flex justify-center space-x-3">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === activeSlide ? 'bg-gradient-to-r from-orange-500 to-amber-500 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const SignUpStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => (
  <div className="space-y-6">
    <div className="space-y-5">
      <div>
        <Label htmlFor="fullName" className="text-base font-medium flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>Full Name</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          className="mt-2 border-2 border-orange-100 focus:border-orange-400"
        />
      </div>
      
      <div>
        <Label htmlFor="displayName" className="text-base font-medium flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>Preferred Display Name</span>
        </Label>
        <Input
          id="displayName"
          placeholder="What should we call you?"
          value={formData.displayName}
          onChange={(e) => setFormData({...formData, displayName: e.target.value})}
          className="mt-2 border-2 border-orange-100 focus:border-orange-400"
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="text-base font-medium flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span>Email Address</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="mt-2 border-2 border-orange-100 focus:border-orange-400"
        />
      </div>
      
      <div>
        <Label htmlFor="password" className="text-base font-medium flex items-center space-x-2">
          <Lock className="w-4 h-4" />
          <span>Create Password</span>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Choose a secure password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="mt-2 border-2 border-orange-100 focus:border-orange-400"
        />
      </div>
    </div>
  </div>
);

const ContactStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <div className="text-3xl mb-3">📱💬</div>
      <p className="text-gray-600">
        Your contact information helps us keep you updated
      </p>
    </div>
    
    <div className="space-y-5">
      <div>
        <Label htmlFor="phone" className="text-base font-medium flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>Phone Number</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+234 801 234 5678"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="mt-2 border-2 border-orange-100 focus:border-orange-400"
        />
      </div>
      
      <div>
        <Label htmlFor="address" className="text-base font-medium flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Location</span>
        </Label>
        <Input
          id="address"
          placeholder="e.g., Lagos, Nigeria"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="mt-2 border-2 border-orange-100 focus:border-orange-400"
        />
      </div>
    </div>
  </div>
);

const EventSetupStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
  const eventTypes = [
    { id: 'wedding', name: 'Wedding', icon: '💒' },
    { id: 'birthday', name: 'Birthday Party', icon: '🎂' },
    { id: 'graduation', name: 'Graduation', icon: '🎓' },
    { id: 'corporate', name: 'Corporate Event', icon: '🏢' },
    { id: 'traditional', name: 'Traditional Ceremony', icon: '🥁' },
    { id: 'other', name: 'Other Celebration', icon: '🎉' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">What type of event are you planning?</Label>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {eventTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFormData({...formData, eventType: type.id})}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                formData.eventType === type.id
                  ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-lg'
                  : 'border-orange-100 hover:border-orange-200 hover:bg-orange-50'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="event-date" className="text-base font-medium flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Event Date</span>
        </Label>
        <Input
          id="event-date"
          type="date"
          value={formData.eventDate}
          onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
          className="mt-2 border-2 border-orange-100 focus:border-orange-400"
        />
      </div>
    </div>
  );
};

const ReadyStep = () => (
  <div className="text-center py-8">
    <div className="text-5xl mb-8 animate-bounce">🌟🎉✨</div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">
      Your celebration journey begins now!
    </h2>
    <p className="text-gray-600 leading-relaxed mb-8">
      You're all set to start planning amazing events. Let's create something beautiful together!
    </p>
    <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-6 border border-orange-200">
      <p className="text-orange-800 font-medium">
        Click "Start Planning!" to access your dashboard and begin creating your perfect celebration.
      </p>
    </div>
  </div>
);
