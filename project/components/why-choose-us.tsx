import { Award, Heart, Clock } from 'lucide-react';

const features = [
  {
    title: 'Verified Professionals',
    description: 'All our vendors are thoroughly vetted and reviewed.',
    icon: Award
  },
  {
    title: 'Tailored Matches',
    description: 'Find vendors that match your style and budget perfectly.',
    icon: Heart
  },
  {
    title: 'Stress-Free Planning',
    description: 'Streamline your wedding planning process with our tools.',
    icon: Clock
  }
];

export function WhyChooseUs() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose WeddingVendors?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="bg-white rounded-lg shadow-md p-6 text-center">
              <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}