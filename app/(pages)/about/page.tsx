import Navbar from "@/components/Nabvar"
import Image from "next/image"

const AboutPage = () => {
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
                <div className="space-y-6">
                  <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed">
                    Vi tror att varje barn förtjänar produkter som stärker deras emotionella utveckling, 
                    väcker kreativitet och skapar bestående minnen med sina familjer.
                  </p>
                  <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed">
                    Grundat av föräldrar och pedagoger är vårt uppdrag att skapa vackra, genomtänkta 
                    produkter som stödjer barns emotionella lärande och samtidigt ger glädje i vardagen.
                  </p>
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
          </div>
        </section>

        {/* Separador */}
        <div className="h-16 md:h-24"></div>

        {/* Sección 2: Uppdrag */}
        <section className="py-20 md:py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex flex-col items-center">
              {/* Texto */}
              <div className="w-full text-center mb-16">
                <h1 className="font-serif ext-4xl md:text-5xl font-bold text-gray-800 mb-8">
                  Vårt Uppdrag
                </h1>
                <div className="max-w-4xl mx-auto">
                  <p className="text-muted-foreground text-lg md:text-xl text-gray-600 leading-relaxed">
                    Att skapa produkter som hjälper barn förstå sina känslor, utveckla empati och bygga självförtroende 
                    – samtidigt som de har roligt. Vi samarbetar med barnpsykologer, pedagoger och familjer för att säkerställa att allt vi
                    gör verkligen stödjer tidig barndomsutveckling.
                  </p>
                </div>
              </div>
              
                        
              <div className="w-full flex justify-center">
                <div className="relative w-full max-w-6xl h-[90vw] max-h-175  rounded-3xl p-6">
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
              <div className="flex-1 text-center p-8 bg-[#F7F0ED]  rounded-2xl shadow-lg">
                <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-4">Melleloos</h3>
                <p className="text-muted-foreground text-gray-600 leading-relaxed">
                  Det äldsta syskonet i Duddaloos-familjen! Trygg, klok och full av idéer. Den som ser, förstår och finns där, alltid med ett varmt hjärta och en ny uppfinning på gång.
                </p>
              </div>
              <div className="flex-1 text-center p-8 bg-[#E8EEEA] rounded-2xl shadow-lg">
                <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-4">Storeloos</h3>
                <p className="text-muted-foreground text-gray-600 leading-relaxed">
                  Mellanbarnet i Duddaloos-familjen! Nyfiken, modig och full av tankar. Känner stort, tänker djupt och hittar sin väg, ett steg i taget.
                </p>
              </div>
              <div className="flex-1 text-center p-8 bg-[#F8F6F2] rounded-2xl shadow-lg">
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
                  <div className="relative w-full max-w-6xl h-[90vw] max-h-175  rounded-3xl p-6">
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

       <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8">

            <div className="grid gap-8 md:grid-cols-3">

              {/* Card 1 */}
              <div className="p-8 rounded-2xl bg-[#F7F0ED] animate-fade-in">
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  Kvalitet Först
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Varje produkt är tillverkad med omsorg och använder säkra, hållbara material som föräldrar kan lita på.
                </p>
              </div>

              {/* Card 2 */}
              <div
                className="p-8 rounded-2xl bg-[#E8EEEA] animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  Barncentrerad Design
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Allt vi skapar är utformat med barns utvecklingsbehov i åtanke.
                </p>
              </div>

              {/* Card 3 */}
              <div
                className="p-8 rounded-2xl bg-[#F8F6F2] animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  Familjeband
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Våra produkter uppmuntrar meningsfulla stunder mellan barn och deras nära och kära.
                </p>
              </div>

            </div>

          </div>
        </section>


      </div>
    </>
  )
}

export default AboutPage