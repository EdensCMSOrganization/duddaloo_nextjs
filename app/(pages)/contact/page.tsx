import Navbar from '@/components/Nabvar'

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background p-6 md:p-10'>
        <div className="max-w-7xl mx-auto">
          <div className="flex-col text-center space-y-6 mb-10">
              <h1 className="font-serif text-4xl font-extralight">Get in Touch</h1>
              <p className='text-gray-500'>
                We&apos;d love to hear from you. Whether you have a question about our products, need assistance, <br />
                or just want to say hello.
              </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Columna Izquierda: Información de Contacto */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-blush/10 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail h-5 w-5 text-blush-foreground">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Email</h3>
                      <p className="text-muted-foreground">hello@yourbrand.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-sage/10 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone h-5 w-5 text-sage-foreground">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Phone</h3>
                      <p className="text-muted-foreground">+46 123 456 789</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-muted/10 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-5 w-5 text-muted-foreground">
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Address</h3>
                      <p className="text-muted-foreground">123 Business Street<br />Stockholm, Sweden 12345</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-8 bg-[#F8F6F2] rounded-2xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
                <div className="space-y-2">
                  <p className="text-muted-foreground"><span className="font-medium">Monday - Friday:</span> 9:00 AM - 5:00 PM (CET)</p>
                  <p className="text-muted-foreground"><span className="font-medium">Saturday - Sunday:</span> Closed</p>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="bg-card rounded-xl p-6 md:p-8 ">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage