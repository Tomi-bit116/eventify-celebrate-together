
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, DollarSign } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-500" />,
      title: "Smart Task Lists",
      description: "Never forget a detail! Organized checklists with celebration animations 🎉"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
      title: "Budget Buddy",
      description: "Keep your naira in check with friendly spending alerts and progress tracking ₦"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Team Planning",
      description: "Collaborate with friends and family - planning parties is more fun together! 👥"
    },
    {
      icon: <Calendar className="h-8 w-8 text-coral-500" />,
      title: "Event Dashboard",
      description: "All your celebrations in one place with countdown timers and progress bars 📅"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Everything you need to throw the perfect party! 🎊
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From intimate family gatherings to campus celebrations - we've got your back every step of the way!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-orange-100 to-pink-100 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
