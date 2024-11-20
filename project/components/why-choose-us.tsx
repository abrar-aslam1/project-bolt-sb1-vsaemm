"use client";

import { Award, Heart, Clock, Star, Users, Shield } from 'lucide-react';

const features = [
  {
    title: 'Curated Excellence',
    description: 'Every vendor is carefully selected and verified to ensure the highest quality service for your special day.',
    icon: Award
  },
  {
    title: 'Perfect Matches',
    description: 'Find vendors who align perfectly with your vision, style, and budget for a truly magical celebration.',
    icon: Heart
  },
  {
    title: 'Seamless Planning',
    description: 'Our intuitive tools and expert guidance make wedding planning a joyful journey rather than a stressful task.',
    icon: Clock
  },
  {
    title: 'Real Experiences',
    description: 'Read authentic reviews from couples who have celebrated their love stories with our trusted vendors.',
    icon: Star
  },
  {
    title: 'Personal Support',
    description: 'Our dedicated team is here to assist you every step of the way on your wedding planning journey.',
    icon: Users
  },
  {
    title: 'Secure Booking',
    description: 'Book with confidence knowing that your special day is protected by our secure platform.',
    icon: Shield
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-playfair font-bold mb-6 wedding-text-gradient">
            Why Choose WeddingVendors?
          </h2>
          <p className="text-lg text-muted-foreground">
            We're dedicated to making your wedding planning journey as beautiful as your special day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ title, description, icon: Icon }, index) => (
            <div 
              key={title}
              className="group relative bg-card rounded-xl p-8 text-center
                transition-all duration-500 hover:shadow-xl
                border border-border/50 backdrop-blur-sm
                hover:border-primary/50 hover:-translate-y-1
                animate-fadeIn"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-xl font-playfair font-semibold mb-4 group-hover:wedding-text-gradient">
                  {title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
