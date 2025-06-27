
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, DollarSign, MessageSquare, BarChart3 } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <CheckCircle className="h-10 w-10 text-green-500" />,
      title: "Smart Task Management",
      description: "Never forget a detail with our intelligent task system! Get reminders, set deadlines, and celebrate each completed task with confetti animations 🎉",
      details: ["Automated reminders", "Priority sorting", "Progress tracking", "Team task assignments"],
      bgColor: "from-green-50 to-lime-50",
      iconBg: "from-green-400 to-lime-400"
    },
    {
      icon: <DollarSign className="h-10 w-10 text-yellow-500" />,
      title: "Budget Buddy",
      description: "Keep your naira in check with smart spending alerts, expense categories, and real-time budget tracking. No more budget surprises! ₦",
      details: ["Expense categorization", "Spending alerts", "Vendor cost comparison", "Budget progress visualization"],
      bgColor: "from-yellow-50 to-orange-50",
      iconBg: "from-yellow-400 to-orange-400"
    },
    {
      icon: <Users className="h-10 w-10 text-blue-500" />,
      title: "Guest Management",
      description: "From invitations to RSVPs, manage your guest list like a pro! WhatsApp integration makes communication seamless 👥",
      details: ["Digital invitations", "RSVP tracking", "Guest preferences", "Seating arrangements"],
      bgColor: "from-blue-50 to-indigo-50",
      iconBg: "from-blue-400 to-indigo-400"
    },
    {
      icon: <Calendar className="h-10 w-10 text-coral-500" />,
      title: "Event Dashboard",
      description: "Your command center! See everything at a glance with countdown timers, progress bars, and upcoming deadlines 📅",
      details: ["Live countdown timers", "Progress indicators", "Upcoming tasks", "Event timeline"],
      bgColor: "from-orange-50 to-pink-50",
      iconBg: "from-orange-400 to-pink-400"
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-green-600" />,
      title: "Vendor Network",
      description: "Connect with trusted local vendors, get quotes, and manage all your service providers in one place 🤝",
      details: ["Vendor directory", "Quote comparisons", "Contract management", "Review system"],
      bgColor: "from-emerald-50 to-green-50",
      iconBg: "from-emerald-400 to-green-400"
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-lime-600" />,
      title: "Smart Analytics",
      description: "Get insights into your event planning with detailed analytics, guest engagement metrics, and success tracking 📊",
      details: ["Guest engagement stats", "Budget analytics", "Planning efficiency", "Success metrics"],
      bgColor: "from-lime-50 to-yellow-50",
      iconBg: "from-lime-400 to-yellow-400"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-yellow-50/30 to-green-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-yellow-500 to-green-600 bg-clip-text text-transparent">
            Everything you need to throw the perfect party! 🎊
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From intimate family gatherings to campus celebrations, our comprehensive suite of tools 
            has got your back every step of the way. Planning has never been this enjoyable!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border-0 group">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className={`bg-gradient-to-br ${feature.iconBg} p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="w-full">
                    <h4 className="font-semibold text-sm text-gray-700 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full mr-3 flex-shrink-0"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
            Why Nigerian event planners love Eventify ❤️
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-green-50 rounded-2xl">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600">Setup in 2 minutes, plan in hours</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-lime-50 rounded-2xl">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold mb-2">Mobile First</h4>
              <p className="text-sm text-gray-600">Perfect for planning on the go</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-lime-50 to-yellow-50 rounded-2xl">
              <div className="text-3xl mb-3">🇳🇬</div>
              <h4 className="font-semibold mb-2">Built for Nigeria</h4>
              <p className="text-sm text-gray-600">Local vendors, culture, and currency</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-50 to-green-50 rounded-2xl">
              <div className="text-3xl mb-3">💯</div>
              <h4 className="font-semibold mb-2">Always Free</h4>
              <p className="text-sm text-gray-600">Core features free forever</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
