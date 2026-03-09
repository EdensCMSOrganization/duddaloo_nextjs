"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState } from "react";

const AboutPage = () => {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-12 md:py-16">
        
        {/* Sección 1: Historia - Imagen ALTA */}
        <section className="py-10 md:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Texto */}
              <div className="flex-1 w-full">
                <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-800 mb-8">
                  Vår Historia
                </h1>
                
                {/* Texto con funcionalidad "Leer más" */}
                <div className="space-y-6">
                  <div className="relative">
                    <p className={`text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed transition-all duration-300 ${
                      !showFullText ? 'line-clamp-16' : ''
                    }`}>
                      Vi är två barndomsvänner som har följts åt genom livet, från lek i parken till arbete med barn 
                      i vår yrkesvardag. Genom våra egna erfarenheter, både som pedagoger och föräldrar, har vi 
                      gång på gång sett hur svårt det kan vara för barn att förstå, uttrycka och hantera sina 
                      känslor. 
                      Duddaloos föddes ur en gemensam önskan att skapa något som vi själva saknade i mötet 
                      med barn. 
                      Med utbildning och yrkeserfarenhet inom pedagogik, samtalsstöd och barns emotionella 
                      utveckling har vi under många år arbetat nära barn i både förskole- och skolmiljö. En av oss 
                      arbetar som kurator med särskilt fokus på barns psykiska mående, känsloreglering och 
                      stödjande samtal. Det dagliga arbetet med att möta barn i svåra känslor, hjälpa dem att sätta 
                      ord på sina upplevelser och skapa trygghet i samtal har gett oss en djupare förståelse för 
                      barns inre värld och behovet av konkreta verktyg för att kunna uttrycka det som känns. 
                      Vi har sett hur känslor som sorg, ilska, skam, rädsla eller ensamhet ofta tar plats utan att 
                      barnen alltid har orden för att beskriva vad som händer inuti, varken hemma eller i 
                      pedagogiska miljöer.
                    </p>
                    
                    {/* Botón "Läs mer" / "Visa mindre" */}
                    {!showFullText && (
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowFullText(!showFullText)}
                    className="text-purple-600 font-semibold hover:text-purple-800 transition-colors focus:outline-none"
                  >
                    {showFullText ? 'Visa mindre ↑' : 'Läs mer ↓'}
                  </button>
                </div>
              </div>
              
              {/* Imagen ALTA */}
              <div className="flex-1 flex justify-center w-full mt-10 lg:mt-0">
                <div className="relative w-62 h-75 md:w-96 md:h-100 lg:h-112.5">
                  <Image
                    src="/aboutbild.svg"
                    alt="Bolla illustration"
                    fill
                    className="drop-shadow-lg rounded-3xl object-cover"
                    priority
                  />
                </div>
              </div>          
            </div>
            
            {/* Segundo párrafo - Solo visible cuando showFullText es true */}
            {showFullText && (
              <div className="mt-8 animate-fadeIn">
                <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed">
                  Vi började därför fundera, tänk om känslor kunde bli något synligt, något lekfullt och något 
                  man kan prata om tillsammans utan att det känns svårt eller fel. Det blev starten på 
                  Duddaloos. 
                  Vårt mål är att skapa genomtänkta produkter och material som stärker barns emotionella 
                  utveckling, väcker kreativitet och fungerar både som ett stöd i familjens vardag och som ett 
                  pedagogiskt verktyg i förskola och skola. Genom lek, färg och berättelser vill vi ge barn 
                  möjlighet att förstå sig själva och varandra i trygga sammanhang, oavsett om det sker 
                  hemma eller i en lärmiljö. 
                  Duddaloos är inte bara ett varumärke, det är vårt hjärteprojekt. 
                  Byggt på vänskap, erfarenhet och en stark tro på att varje barn förtjänar att bli förstått även 
                  när orden inte riktigt räcker till.
                </p>
              </div>
            )}
          </div>
        </section>

      
        <div className="h-16 md:h-24"></div>

        {/* Sección 2: Uppdrag */}
        <section className="py-20 md:py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex flex-col items-center">
              {/* Texto */}
              <div className="w-full text-center mb-16">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                  Vår Vision
                </h1>
                <div className="max-w-4xl mx-auto">
                  <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed">
                    Att skapa produkter som hjälper barn förstå sina känslor, utveckla empati och bygga en trygg 
                    självbild samtidigt som de har roligt. Vi utvärderar kontinuerligt våra pedagogiska material 
                    tillsammans med lärare och pedagoger för att säkerställa att de fungerar som ett 
                    meningsfullt stöd för barns utveckling i både hemmet och i pedagogiska miljöer. 
                  </p>
                </div>
              </div>
              
              <div className="w-full flex justify-center">
                <div className="relative w-full max-w-6xl h-[90vw] max-h-175 rounded-3xl p-6">
                  <Image
                    src="/aboutDuddaloo.svg"
                    alt="Bolla illustration"
                    fill
                    className="object-contain object-center drop-shadow-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sección de personajes */}
          <div className="max-w-6xl mx-auto px-4 md:px-8 mt-20 md:mt-32">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
              Våra Karaktärer
            </h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="flex-1 text-center p-8 bg-[#eefcfd] rounded-2xl shadow-lg">
                <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-4">Melleloos</h3>
                <p className="text-muted-foreground text-gray-600 leading-relaxed">
                  Mellanbarnet i Duddaloos-familjen! Nyfiken, modig och full av tankar. Känner stort, tänker djupt och hittar sin väg, ett steg i taget.
                </p>
              </div>
              <div className="flex-1 text-center p-8 bg-[#E8EEEA] rounded-2xl shadow-lg">
                <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-4">Storeloos</h3>
                <p className="text-muted-foreground text-gray-600 leading-relaxed">
                  Det äldsta syskonet i Duddaloos-familjen! Trygg, klok och full av idéer. Den som ser, förstår och finns där, alltid med ett varmt hjärta och en ny uppfinning på gång.
                </p>
              </div>
              <div className="flex-1 text-center p-8 bg-[#F7F0ED] rounded-2xl shadow-lg">
                <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-4">Lilleloos</h3>
                <p className="text-muted-foreground text-gray-600 leading-relaxed">
                  Den allra yngsta i Duddaloos-familjen! Liten till storleken men med ett hjärta fullt av färger. Älskar att leka, känna och upptäcka världen, en känsla i taget.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            {/* Imagen */}
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-6xl h-[90vw] max-h-175 rounded-3xl p-6">
                <Image
                  src="/aboutBollar.svg"
                  alt="Bolla illustration"
                  fill
                  className="object-contain object-center drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            {/* Texto */}
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 my-8">
                Vårt Fokus
              </h2>

              <div className="space-y-6">
                <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed">
                  Vi arbetar med känslor och bubblor för att göra det osynliga synligt.
                </p>

                <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed">
                  För barn kan känslor vara stora, nya och ibland svåra att sätta ord på. Med våra bubblor vill vi skapa ett tryggt och lekfullt sätt att känna igen, uttrycka och prata om det som händer inuti.
                </p>

                <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed">
                  Varje bubbla bär en känsla, ingen är fel, ingen är för stor.
                </p>

                <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed">
                  Genom färg, fantasi och igenkänning vill vi hjälpa barn att förstå sig själva, möta andra med empati och känna att alla känslor får finnas.
                </p>

                <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed font-semibold">
                  Det är så vi bygger trygghet, nyfikenhet och starka små hjärtan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Estilos personalizados para la animación */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default AboutPage;