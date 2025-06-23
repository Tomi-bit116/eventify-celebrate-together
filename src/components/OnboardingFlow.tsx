
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, CheckCircle, DollarSign, Heart, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export const OnboardingFlow = ({ onComplete, onBack }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    eventType: '',
    eventDate: '',
  });

  const steps = [
    {
      id: 'welcome',
      title: "Welcome to your new party planning bestie! 🎉",
      subtitle: "Let's make your events absolutely amazing together!",
      content: <WelcomeStep />
    },
    {
      id: 'features',
      title: "Here's how we'll make magic happen ✨",
      subtitle: "Swipe through to see what we can do together!",
      content: <FeatureSlides />
    },
    {
      id: 'signup',
      title: "Let's get you set up! 👋",
      subtitle: "Choose how you'd like to join the party",
      content: <SignUpStep formData={formData} setFormData={setFormData} />
    },
    {
      id: 'event-setup',
      title: "What's the celebration? 🎊",
      subtitle: "Tell us a bit about your upcoming event",
      content: <EventSetupStep formData={formData} setFormData={setFormData} />
    },
    {
      id: 'permissions',
      title: "Help us help you better! 🤝",
      subtitle: "These permissions make your planning super smooth",
      content: <PermissionsStep />
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white/50 backdrop-blur-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-coral-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              {steps[currentStep].content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-coral-500 to-pink-500 hover:from-coral-600 hover:to-pink-600 text-white flex items-center space-x-2"
            >
              <span>{currentStep === steps.length - 1 ? "Start Planning!" : "Continue"}</span>
              {currentStep === steps.length - 1 ? <Zap className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomeStep = () => (
  <div className="text-center py-8">
    <div className="text-6xl mb-6 animate-bounce">🎯✨</div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Say goodbye to party planning stress!
    </h2>
    <p className="text-gray-600 leading-relaxed">
      We're here to turn your event planning from overwhelming chaos into pure joy. 
      Think of us as your most organized friend who never forgets anything! 🤗
    </p>
    <div className="mt-6 flex justify-center space-x-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle className="w-6 h-6 text-coral-600" />
        </div>
        <span className="text-sm text-gray-600">Stay Organized</span>
      </div>
      <div className="text-center">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
          <Heart className="w-6 h-6 text-emerald-600" />
        </div>
        <span className="text-sm text-gray-600">Have Fun</span>
      </div>
      <div className="text-center">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
          <Users className="w-6 h-6 text-yellow-600" />
        </div>
        <span className="text-sm text-gray-600">Work Together</span>
      </div>
    </div>
  </div>
);

const FeatureSlides = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
      title: "Smart Checklists",
      description: "Never forget a thing! We'll remind you with the sweetest nudges 💕",
      color: "from-emerald-100 to-green-100"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-yellow-500" />,
      title: "Budget Bestie",
      description: "Keep your naira happy with friendly spending alerts ₦",
      color: "from-yellow-100 to-orange-100"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Team Planning",
      description: "Get your squad involved - planning is better together! 👯‍♀️",
      color: "from-blue-100 to-purple-100"
    }
  ];

  return (
    <div className="py-4">
      <div className={`bg-gradient-to-br ${features[activeSlide].color} rounded-lg p-6 mb-4 transition-all duration-300`}>
        <div className="text-center">
          <div className="mb-4">{features[activeSlide].icon}</div>
          <h3 className="text-lg font-semibold mb-2">{features[activeSlide].title}</h3>
          <p className="text-gray-600">{features[activeSlide].description}</p>
        </div>
      </div>
      
      <div className="flex justify-center space-x-2">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === activeSlide ? 'bg-coral-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const SignUpStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <Button className="bg-white border-2 border-gray-200 text-gray-700 hover:border-coral-300 flex items-center justify-center space-x-2">
        <span className="text-lg">📧</span>
        <span>Email</span>
      </Button>
      <Button className="bg-white border-2 border-gray-200 text-gray-700 hover:border-coral-300 flex items-center justify-center space-x-2">
        <span className="text-lg">📱</span>
        <span>Phone</span>
      </Button>
      <Button className="bg-white border-2 border-gray-200 text-gray-700 hover:border-coral-300 flex items-center justify-center space-x-2">
        <span className="text-lg">🔍</span>
        <span>Google</span>
      </Button>
    </div>
    
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">What should we call you? 😊</Label>
        <Input
          id="name"
          placeholder="Your awesome name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="password">Create a password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Make it strong! 💪"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
      </div>
    </div>
  </div>
);

const EventSetupStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
  const eventTypes = [
    { id: 'birthday', name: 'Birthday Party', icon: '🎂' },
    { id: 'wedding', name: 'Wedding', icon: '💒' },
    { id: 'naming', name: 'Naming Ceremony', icon: '👶' },
    { id: 'graduation', name: 'Graduation', icon: '🎓' },
    { id: 'corporate', name: 'Corporate Event', icon: '🏢' },
    { id: 'other', name: 'Other Celebration', icon: '🎉' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">What type of event are we planning?</Label>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {eventTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFormData({...formData, eventType: type.id})}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                formData.eventType === type.id
                  ? 'border-coral-400 bg-coral-50 text-coral-700'
                  : 'border-gray-200 hover:border-coral-200'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-sm font-medium">{type.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="event-date">When's the big day? 📅</Label>
        <Input
          id="event-date"
          type="date"
          value={formData.eventDate}
          onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
          className="mt-2"
        />
      </div>
    </div>
  );
};

const PermissionsStep = () => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <div className="text-4xl mb-4">🤝</div>
      <p className="text-gray-600">
        We'll only use these to make your planning experience amazing!
      </p>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl">📱</div>
        <div>
          <h4 className="font-medium text-gray-800">Contacts</h4>
          <p className="text-sm text-gray-600">
            Import your contacts to easily invite guests and find vendors
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
        <div className="text-2xl">🔔</div>
        <div>
          <h4 className="font-medium text-gray-800">Notifications</h4>
          <p className="text-sm text-gray-600">
            Get gentle reminders so you never miss important deadlines
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
        <div className="text-2xl">📍</div>
        <div>
          <h4 className="font-medium text-gray-800">Location</h4>
          <p className="text-sm text-gray-600">
            Find nearby vendors and get better recommendations
          </p>
        </div>
      </div>
    </div>
    
    <p className="text-xs text-gray-500 text-center">
      You can change these settings anytime in your profile 💕
    </p>
  </div>
);
