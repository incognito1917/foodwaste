import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">SmartFood</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Don't Waste Food. Share It. Save Lives. Empowering communities to redistribute surplus food seamlessly to those in need.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link to="/available-food" className="hover:text-emerald-400 transition-colors">Available Surplus Food</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Food Donors</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Partner NGOs</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Volunteer Network</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Portal Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact & Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@smartfoodwaste.org</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+1 (800) 555-FOOD</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>San Francisco, CA & Global Partners</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Smart Food Waste Management System. College Project Demo.</p>
          <p className="flex items-center space-x-1 mt-2 md:mt-0">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
            <span>for Zero Hunger & Sustainability</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
