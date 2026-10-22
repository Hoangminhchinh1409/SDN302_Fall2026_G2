import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 px-4 md:px-12 lg:px-24 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative Paw Prints Background */}
      <i className="fas fa-paw absolute top-10 left-10 text-4xl text-gray-100 -rotate-12"></i>
      <i className="fas fa-paw absolute bottom-20 left-1/4 text-5xl text-gray-100 rotate-45"></i>
      <i className="fas fa-paw absolute top-20 right-1/3 text-3xl text-gray-100 -rotate-45"></i>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 relative z-10">
        {/* Brand & Social */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-brand-dark mb-4">
            <i className="fas fa-paw text-brand-orange"></i> Pet Shop
          </Link>
          <p className="text-brand-text text-sm mb-6 max-w-sm">
            Sed viverra eget fames sit varius. Pellentesque mattis libero viverra dictumst amet et justo convallis vitae.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"><i className="fab fa-facebook-f text-sm" aria-hidden="true"></i></a>
            <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"><i className="fab fa-twitter text-sm" aria-hidden="true"></i></a>
            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"><i className="fab fa-instagram text-sm" aria-hidden="true"></i></a>
            <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"><i className="fab fa-youtube text-sm" aria-hidden="true"></i></a>
          </div>
        </div>
        
        {/* Company */}
        <div>
          <h4 className="font-bold text-brand-dark mb-4">Company</h4>
          <ul className="flex flex-col gap-3 text-sm text-brand-text">
            <li><Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
            <li><Link to="#" className="hover:text-brand-orange transition-colors">Blog</Link></li>
            <li><Link to="#" className="hover:text-brand-orange transition-colors">Gift cards</Link></li>
            <li><Link to="#" className="hover:text-brand-orange transition-colors">Careers</Link></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="font-bold text-brand-dark mb-4">Useful Links</h4>
          <ul className="flex flex-col gap-3 text-sm text-brand-text">
            <li><Link to="#" className="hover:text-brand-orange transition-colors">New products</Link></li>
            <li><Link to="#" className="hover:text-brand-orange transition-colors">Best sellers</Link></li>
            <li><Link to="#" className="hover:text-brand-orange transition-colors">Discount</Link></li>
            <li><Link to="#" className="hover:text-brand-orange transition-colors">F.A.Q</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-bold text-brand-dark mb-4">Customer Service</h4>
          <ul className="flex flex-col gap-3 text-sm text-brand-text">
            <li><Link to="/contact" className="hover:text-brand-orange transition-colors">Contact Us</Link></li>
            <li><Link to="#" className="hover:text-brand-orange transition-colors">Shipping</Link></li>
            <li><Link to="#" className="hover:text-brand-orange transition-colors">Returns</Link></li>
            <li><Link to="#" className="hover:text-brand-orange transition-colors">Order tracking</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 relative z-10">
        <p className="text-brand-text text-sm mb-4 md:mb-0">
          © Copyright Pet Shop 2026. FPT Uni, SDN302
        </p>
        <div className="flex gap-4 opacity-50" aria-label="Payment Methods">
          {/* Payment Methods Placeholders */}
          <i className="fab fa-cc-visa text-2xl" aria-hidden="true"></i>
          <i className="fab fa-cc-mastercard text-2xl" aria-hidden="true"></i>
          <i className="fab fa-cc-paypal text-2xl" aria-hidden="true"></i>
          <i className="fab fa-cc-amex text-2xl" aria-hidden="true"></i>
        </div>
      </div>
      
      {/* Bottom right orange blob */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-orange rounded-full opacity-80 blob-shape"></div>
    </footer>
  );
};

export default Footer;
