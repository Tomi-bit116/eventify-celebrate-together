
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, CheckCircle, DollarSign, Heart, Zap, ChevronLeft, ChevronRight, Upload, MapPin, Phone, Mail, User, Lock } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export const OnboardingFlow = ({ onComplete, onBack }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
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
      title: "Welcome to your new party planning bestie! 🎉",
      subtitle: "E don tey wey you dey find am abi? Make we start this journey together!",
      content: <WelcomeStep />
    },
    {
      id: 'features',
      title: "See wetin we fit do together o! ✨",
      subtitle: "Swipe make you see all the sweet sweet features!",
      content: <FeatureSlides />
    },
    {
      id: 'signup',
      title: "Make we know you small! 👋",
      subtitle: "Just small details, no wahala at all!",
      content: <SignUpStep formData={formData} setFormData={setFormData} />
    },
    {
      id: 'contact',
      title: "How we go reach you? 📱",
      subtitle: "Your contact details for updates and reminders",
      content: <ContactStep formData={formData} setFormData={setFormData} />
    },
    {
      id: 'event-setup',
      title: "Wetin we dey celebrate? 🎊",
      subtitle: "Tell us small about your upcoming event",
      content: <EventSetupStep formData={formData} setFormData={setFormData} />
    },
    {
      id: 'permissions',
      title: "Small small permissions! 🤝",
      subtitle: "These go make your planning super smooth, no stress!",
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 flex flex-col relative overflow-hidden">
      {/* Floating celebration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-3xl animate-bounce animation-delay-300">🎊</div>
        <div className="absolute top-20 right-20 text-2xl animate-pulse animation-delay-700">✨</div>
        <div className="absolute bottom-32 left-20 text-3xl animate-spin-slow animation-delay-1000">🎉</div>
        <div className="absolute bottom-40 right-16 text-2xl animate-bounce animation-delay-500">🥳</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/80 backdrop-blur-sm p-4 shadow-lg border-b-4 border-gradient-to-r from-green-400 via-yellow-400 to-red-400">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm font-bold text-gray-800">{Math.round(((currentStep + 1) / steps.length) * 100)}% complete! 🚀</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 relative z-10">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 animate-bounce">
              {currentStep === 0 && "🎯"}
              {currentStep === 1 && "✨"}
              {currentStep === 2 && "👋"}
              {currentStep === 3 && "📱"}
              {currentStep === 4 && "🎊"}
              {currentStep === 5 && "🤝"}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 text-lg">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-gradient-to-r from-green-200 via-yellow-200 to-red-200">
            <CardContent className="p-8">
              {steps[currentStep].content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center space-x-2 border-2 border-gray-300 hover:border-green-400 px-6 py-3"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </Button>

            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 hover:from-green-600 hover:via-yellow-600 hover:to-red-600 text-white flex items-center space-x-2 px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span>{currentStep === steps.length - 1 ? "Oya, let's start planning! 🚀" : "Continue"}</span>
              {currentStep === steps.length - 1 ? <Zap className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomeStep = () => (
  <div className="text-center py-8">
    <div className="text-6xl mb-6 animate-bounce">🎯✨🎪</div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      No more party planning wahala!
    </h2>
    <p className="text-gray-600 leading-relaxed mb-6">
      We dey here to turn your event planning from stress to pure enjoyment. 
      Think of us as your most organized friend wey no dey forget anything! 🤗
    </p>
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <span className="text-sm text-gray-600 font-medium">Stay Organized</span>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
          <Heart className="w-8 h-8 text-yellow-600" />
        </div>
        <span className="text-sm text-gray-600 font-medium">Have Fun</span>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
          <Users className="w-8 h-8 text-red-600" />
        </div>
        <span className="text-sm text-gray-600 font-medium">Work Together</span>
      </div>
    </div>
  </div>
);

const FeatureSlides = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const features = [
    {
      icon: <CheckCircle className="w-10 h-10 text-green-500" />,
      title: "Smart Checklist",
      description: "Never forget anything! We go remind you with sweet sweet notifications 💕",
      color: "from-green-100 to-emerald-100"
    },
    {
      icon: <DollarSign className="w-10 h-10 text-yellow-500" />,
      title: "Budget Helper",
      description: "Keep your naira in check with smart spending alerts ₦",
      color: "from-yellow-100 to-orange-100"
    },
    {
      icon: <Users className="w-10 h-10 text-red-500" />,
      title: "Team Planning",
      description: "Get your people involved - planning dey sweet when everybody join! 👯‍♀️",
      color: "from-red-100 to-pink-100"
    }
  ];

  return (
    <div className="py-4">
      <div className={`bg-gradient-to-br ${features[activeSlide].color} rounded-lg p-8 mb-6 transition-all duration-300 shadow-lg`}>
        <div className="text-center">
          <div className="mb-6">{features[activeSlide].icon}</div>
          <h3 className="text-xl font-semibold mb-3">{features[activeSlide].title}</h3>
          <p className="text-gray-600 text-lg">{features[activeSlide].description}</p>
        </div>
      </div>
      
      <div className="flex justify-center space-x-3">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === activeSlide ? 'bg-gradient-to-r from-green-500 to-red-500 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const SignUpStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <Button className="bg-white border-2 border-green-200 text-gray-700 hover:border-green-400 hover:bg-green-50 flex items-center justify-center space-x-2 py-4">
        <span className="text-lg">📧</span>
        <span>Email</span>
      </Button>
      <Button className="bg-white border-2 border-yellow-200 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50 flex items-center justify-center space-x-2 py-4">
        <span className="text-lg">📱</span>
        <span>Phone</span>
      </Button>
      <Button className="bg-white border-2 border-red-200 text-gray-700 hover:border-red-400 hover:bg-red-50 flex items-center justify-center space-x-2 py-4">
        <span className="text-lg">🔍</span>
        <span>Google</span>
      </Button>
    </div>
    
    <div className="space-y-5">
      <div>
        <Label htmlFor="fullName" className="text-base font-medium flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>Wetin be your full name? 😊</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Your sweet name"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          className="mt-2 border-2 border-gray-200 focus:border-green-400"
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="text-base font-medium flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span>Email address</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="mt-2 border-2 border-gray-200 focus:border-green-400"
        />
      </div>
      
      <div>
        <Label htmlFor="password" className="text-base font-medium flex items-center space-x-2">
          <Lock className="w-4 h-4" />
          <span>Create password (make am strong o! 💪)</span>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Strong password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="mt-2 border-2 border-gray-200 focus:border-green-400"
        />
      </div>
    </div>
  </div>
);

const ContactStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <div className="text-4xl mb-3">📱💬</div>
      <p className="text-gray-600">
        How we go reach you for updates and sweet reminders!
      </p>
    </div>
    
    <div className="space-y-5">
      <div>
        <Label htmlFor="phone" className="text-base font-medium flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>Phone number</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+234 801 234 5678"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="mt-2 border-2 border-gray-200 focus:border-green-400"
        />
      </div>
      
      <div>
        <Label htmlFor="address" className="text-base font-medium flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Home address (which area you dey?)</span>
        </Label>
        <Input
          id="address"
          placeholder="e.g., Lekki, Lagos State"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="mt-2 border-2 border-gray-200 focus:border-green-400"
        />
      </div>
      
      <div>
        <Label htmlFor="profileImage" className="text-base font-medium flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Profile picture (optional but sweet! 📸)</span>
        </Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">Click to upload your photo</p>
        </div>
      </div>
    </div>
  </div>
);

const EventSetupStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
  const eventTypes = [
    { id: 'wedding', name: 'Wedding', icon: '💒' },
    { id: 'birthday', name: 'Birthday Party', icon: '🎂' },
    { id: 'naming', name: 'Naming Ceremony', icon: '👶' },
    { id: 'graduation', name: 'Graduation', icon: '🎓' },
    { id: 'corporate', name: 'Corporate Event', icon: '🏢' },
    { id: 'traditional', name: 'Traditional Event', icon: '🥁' },
    { id: 'religious', name: 'Religious Event', icon: '🙏' },
    { id: 'other', name: 'Other Celebration', icon: '🎉' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Which kind celebration we dey plan?</Label>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {eventTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFormData({...formData, eventType: type.id})}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                formData.eventType === type.id
                  ? 'border-green-400 bg-green-50 text-green-700 shadow-lg'
                  : 'border-gray-200 hover:border-green-200 hover:bg-green-50'
              }`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="event-date" className="text-base font-medium flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>When be the big day? 📅</span>
        </Label>
        <Input
          id="event-date"
          type="date"
          value={formData.eventDate}
          onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
          className="mt-2 border-2 border-gray-200 focus:border-green-400"
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
        We go only use these to make your planning experience sweet pass honey!
      </p>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
        <div className="text-3xl">📱</div>
        <div>
          <h4 className="font-medium text-gray-800">Contacts</h4>
          <p className="text-sm text-gray-600">
            Import your contacts to easily invite guests and find vendors
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
        <div className="text-3xl">🔔</div>
        <div>
          <h4 className="font-medium text-gray-800">Notifications</h4>
          <p className="text-sm text-gray-600">
            Get sweet reminders so you no go forget important things
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-3xl">📍</div>
        <div>
          <h4 className="font-medium text-gray-800">Location</h4>
          <p className="text-sm text-gray-600">
            Find vendors near you and get better recommendations
          </p>
        </div>
      </div>
    </div>
    
    <p className="text-xs text-gray-500 text-center">
      You fit change these settings anytime for your profile 💕
    </p>
  </div>
);
