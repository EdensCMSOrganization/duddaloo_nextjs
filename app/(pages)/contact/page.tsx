import Navbar from '@/components/Navbar';
import ContactForm from './ContactForm';

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background p-6 md:p-10'>
        <div className="max-w-7xl mx-auto">
          {/* Rubrik och introduktion */}
          <header className="flex flex-col text-center space-y-6 mb-16">
            <h1 className="font-serif text-4xl font-extralight text-foreground">Kontakta oss</h1>
            <p className='text-gray-500 max-w-2xl mx-auto'>
              Vi skulle älska att höra från dig. Oavsett om du har en fråga om våra produkter, 
              behöver hjälp eller bara vill säga hej.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Vänster kolumn: Kontaktinformation */}
            <div className="space-y-10 flex flex-col items-center lg:mt-6">
              <h2 className="text-2xl font-semibold mb-2">Kontaktinformation</h2>
              
              <div className="space-y-8">
                {/* E-post */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/5 p-3 rounded-lg text-primary">
                    <MailIcon />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">E-post</h3>
                    <p className="text-muted-foreground font-light">team@duddaloos.se</p>
                  </div>
                </div>

                {/* Adress */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/5 p-3 rounded-lg text-primary">
                    <MapPinIcon />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Adress</h3>
                    <p className="text-muted-foreground font-light">Stockholm, Sverige</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Höger kolumn: Formulär (Client Component) */}
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

// Ikon-komponenter för att hålla koden ren
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail h-5 w-5">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-5 w-5">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default ContactPage;