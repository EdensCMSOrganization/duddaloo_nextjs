"use client"; // Denna komponent körs på klienten för att undvika hydration mismatch

import { Heart, Sparkles, Users } from "lucide-react";

const ValuesSection = () => {
  // Definiera värden (svenska kommentarer för förklaring)
  const values = [
    {
      title: "Emotionell utveckling",
      description:
        "Våra pedagogiska material är framtagna för att stödja barns emotionella utveckling och utvärderas kontinuerligt i skol- och förskolemiljö.",
      icon: Heart,
      bgColor: "bg-[#eefcfd]",
      iconBgColor: "bg-white",
      iconColor: "bg-pink-200",
    },
    {
      title: "Ansvarsfull produktion",
      description:
        "Vi samarbetar med seriösa tillverkare som uppfyller höga krav på kvalitet, säkerhet och arbetsvillkor. Våra material är certifierade och produceras utan utnyttjande av barnarbete eller osäkra arbetsförhållanden.",
      icon: Sparkles,
      bgColor: "bg-[#E8EEEA]",
      iconBgColor: "bg-white",
      iconColor: "bg-[#E8EEEA]",
    },
    {
      title: "Lokalt engagemang",
      description:
        "De flesta av våra samarbeten sker i Sverige där vi aktivt väljer att stötta lokala och mindre tillverkare. På så sätt kan vi bidra till hållbar produktion och samtidigt säkerställa kvalitet i varje del av det vi skapar.",
      icon: Users,
      bgColor: "bg-[#F7F0ED]",
      iconBgColor: "bg-white",
      iconColor: "bg-[#F7F0ED]",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#F8F6F2]">
      {/* Yttre container för centrerad layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fokus på rubriksektionen */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-gray-800">
            Med omtanke i varje steg
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Pedagogiskt förankrat och skapat med ansvar från idé till färdig
            produkt.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`text-center p-8 rounded-2xl ${value.bgColor} shadow-lg`} // Aquí aplicamos el color de fondo de la tarjeta
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${value.iconBgColor} mb-6 shadow-md`}
              >
                <value.icon className={`h-6 w-6 ${value.iconColor}`} />{" "}
                {/* Color del icono */}
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
};

export default ValuesSection;
