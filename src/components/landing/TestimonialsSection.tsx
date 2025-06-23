
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Kemi A.",
      event: "Birthday Bash",
      text: "Eventify made my 30th birthday planning so stress-free! The budget tracker saved me from overspending 😅",
      rating: 5
    },
    {
      name: "David O.",
      event: "Wedding Planning",
      text: "Planning our traditional wedding became fun instead of overwhelming. The collaboration features are amazing! 🎊",
      rating: 5
    },
    {
      name: "Funmi S.",
      event: "Campus Event",
      text: "Organized our department's end-of-year party like a pro. Everyone loved how organized we were! ✨",
      rating: 5
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Look at these amazing party planners! 🌟
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of Nigerians who've made their events unforgettable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gradient-to-br from-white to-orange-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.event}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
