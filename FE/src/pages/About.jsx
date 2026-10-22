import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white pt-12 pb-16 px-4 md:px-12 lg:px-24 flex items-center justify-between overflow-hidden border-b border-gray-100">
        <div className="relative z-10 max-w-lg">
          <span className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-2 block">Pet Shop</span>
          <h1 className="text-5xl font-extrabold text-brand-dark mb-4 leading-tight">If animals could talk,<br />they'd talk about us!</h1>
          <p className="text-brand-text mb-8">We are passionate about pets. Our mission is to provide top-quality supplies and accessories to help you care for your beloved animal companions.</p>
          <Link to="/shop" className="bg-brand-dark text-white px-8 py-3 rounded hover:bg-brand-orange transition-colors font-semibold inline-block">Shop Now</Link>
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

      {/* About Content */}
      <main className="py-16 px-4 md:px-12 lg:px-24 bg-white">
        
        {/* Stats Section */}
        <section className="mb-24 flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">About our store</h2>
            <p className="text-brand-text text-sm leading-relaxed mb-4">
              Founded by a group of passionate animal lovers, our store has grown into a trusted community hub for pet owners. We carefully source every product on our shelves, ensuring that everything from our nutrient-rich foods to our durable toys meets the highest standards of quality and safety.
            </p>
            <div className="flex gap-12 mt-8">
              <div>
                <span className="block text-3xl font-bold text-brand-orange mb-1">2k+</span>
                <span className="text-sm text-brand-text">Happy Clients</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-brand-orange mb-1">72</span>
                <span className="text-sm text-brand-text">Brands</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 pt-12 lg:pt-0">
            <p className="text-brand-text text-sm leading-relaxed mb-4">
              We believe that pets are family. That's why our dedicated team works tirelessly to discover innovative products that improve the wellbeing of your pets. With over 28 years of combined experience, we are here to support you in giving your furry friends the exceptional care they deserve.
            </p>
            <div className="flex gap-12 mt-8">
              <div>
                <span className="block text-3xl font-bold text-brand-orange mb-1">1.8k+</span>
                <span className="text-sm text-brand-text">Products</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-brand-orange mb-1">28</span>
                <span className="text-sm text-brand-text">Years in business</span>
              </div>
            </div>
          </div>
        </section>

        {/* Director Profile */}
        <section className="mb-24 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-200 rounded-2xl h-80 w-full overflow-hidden flex items-center justify-center">
              <i className="far fa-user text-6xl text-gray-400"></i>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-2xl font-bold text-brand-dark">Taylor Joshua</h3>
            <span className="text-sm text-brand-text block mb-6">Director</span>
            <p className="text-brand-text text-sm italic leading-relaxed mb-4">
              "Our philosophy is simple: prioritize the health and happiness of pets above all else. We've built this store on a foundation of trust and a deep commitment to animal welfare."
            </p>
            <p className="text-brand-text text-sm italic leading-relaxed mb-6">
              "Every product we offer is something we would confidently give to our own pets. Seeing the joy our supplies bring to pets and their owners is what drives us every single day."
            </p>
            <div className="text-3xl font-[cursive] text-brand-dark">Taylor J.</div>
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-24 text-center">
          <h2 className="text-3xl font-bold text-brand-dark mb-12">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="bg-yellow-100 rounded-2xl h-64 mb-4 flex items-center justify-center">
                <i className="far fa-user text-4xl text-gray-400"></i>
              </div>
              <h4 className="font-bold text-brand-dark">Caroline Washington</h4>
              <span className="text-xs text-brand-text">Seller</span>
            </div>
            <div>
              <div className="bg-teal-100 rounded-2xl h-64 mb-4 flex items-center justify-center">
                <i className="far fa-user text-4xl text-gray-400"></i>
              </div>
              <h4 className="font-bold text-brand-dark">Gerald Ferguson</h4>
              <span className="text-xs text-brand-text">Seller</span>
            </div>
            <div>
              <div className="bg-red-100 rounded-2xl h-64 mb-4 flex items-center justify-center">
                <i className="far fa-user text-4xl text-gray-400"></i>
              </div>
              <h4 className="font-bold text-brand-dark">Brent Maddox</h4>
              <span className="text-xs text-brand-text">Seller</span>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default About;
