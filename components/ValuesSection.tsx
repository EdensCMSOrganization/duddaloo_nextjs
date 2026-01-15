import { Heart, Sparkles, Users } from 'lucide-react';

const ValuesSection = () => {
 const values = [
    {
      title: "Emotional Learning",
      description: "Our products help children understand and express their feelings in healthy, creative ways.",
      icon: Heart,
      color: "bg-pink-200"
    },
    {
      title: "Sparking Creativity",
      description: "We believe imagination is the foundation of growth. Every product encourages wonder and play.",
      icon: Sparkles,
      color: "bg-pink-200"
    },
    {
      title: "Family Connection",
      description: "Designed to bring families closer through shared moments of reading, learning, and creating together.",
      icon: Users,
      color: "bg-pink-200"
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#F8F6F2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-gray-800">
            Our Values
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Every product we create is rooted in our commitment to nurturing kindness, 
            creativity, and emotional intelligence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="text-center p-8 rounded-2xl bg-white shadow-lg"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${value.color} mb-6`}>
                <value.icon className="h-6 w-6 text-pink-700" />
              </div>
              <h3 className="font-serif text-xl font-medium text-gray-800 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ValuesSection