import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white pt-12 pb-16 px-4 md:px-12 lg:px-24 flex items-center justify-between overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <span className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-2 block">Pet Shop</span>
          <h1 className="text-5xl font-extrabold text-brand-dark mb-4 leading-tight">If animals could talk,<br />they'd talk about us!</h1>
          <p className="text-brand-text mb-8">Have a question about our products or need assistance with your order? Our friendly team is here to help you and your pet.</p>
          <Link to="/shop" className="bg-brand-dark text-white px-8 py-3 rounded-md hover:bg-brand-orange transition-colors font-semibold inline-block">Shop Now</Link>
        </div>
        
        {/* Hero Graphics */}
        <div className="relative z-10 hidden md:block w-96 h-96">
          <div className="absolute inset-0 bg-brand-orange blob-shape opacity-90 transform translate-x-4"></div>
          <div className="absolute inset-4 bg-gray-200 blob-shape z-10 flex items-center justify-center overflow-hidden">
            <i className="fas fa-paw text-8xl text-gray-400"></i>
          </div>
          <i className="fas fa-dove absolute -top-8 left-10 text-4xl text-gray-300"></i>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-10 w-24 h-24 bg-brand-orange rounded-full opacity-80 blob-shape"></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-brand-orange rounded-full opacity-80 blob-shape"></div>
      </section>

      {/* Main Content */}
      <main className="py-16 px-4 md:px-12 lg:px-24 bg-white">
        <div className="flex flex-col md:flex-row gap-16 mb-16">
          {/* Contact Form */}
          <div className="md:w-1/2">
            <form className="bg-brand-gray/30 p-10 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">First name</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none" placeholder="First name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Last name</label>
                  <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none" placeholder="Last name" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-brand-dark mb-2">Email address</label>
                <input type="email" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none" placeholder="Email address" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-brand-dark mb-2">Message</label>
                <textarea rows="6" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none resize-none" placeholder="Your message..."></textarea>
              </div>
              <button type="button" className="bg-brand-orange text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="md:w-1/2 pt-4">
            <h2 className="text-3xl font-extrabold text-brand-dark mb-6">Feel free to contact us</h2>
            <p className="text-brand-text text-sm leading-relaxed mb-10">
              Whether you have feedback, inquiries, or just want to share a cute story about your pet, we would love to hear from you. Drop us a message and we will respond promptly!
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-brand-orange text-brand-orange flex items-center justify-center shrink-0">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <p className="text-brand-dark font-medium">Khu Công Nghệ Cao Hòa Lạc, CT03, Hòa Lạc, Hà Nội, Việt Nam</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-brand-orange text-brand-orange flex items-center justify-center shrink-0">
                  <i className="fas fa-envelope"></i>
                </div>
                <p className="text-brand-dark font-medium">chinhhmhe171181@fpt.edu.vn</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-brand-orange text-brand-orange flex items-center justify-center shrink-0">
                  <i className="fas fa-phone"></i>
                </div>
                <p className="text-brand-dark font-medium">+8493-629-5902</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-brand-orange text-brand-orange flex items-center justify-center shrink-0">
                  <i className="far fa-clock"></i>
                </div>
                <p className="text-brand-dark font-medium">Mon - Fri: 10AM - 10PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-96 bg-gray-200 rounded-3xl overflow-hidden relative">
          <iframe 
            src="https://maps.google.com/maps?q=21.0124167,105.5252892&z=16&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            title="Google Map"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>
    </>
  );
};

export default Contact;
