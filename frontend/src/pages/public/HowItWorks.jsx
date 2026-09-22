import React from 'react';
import { Utensils, HeartHandshake, Truck, Shield, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      role: 'Donor',
      title: 'Post Food Donation',
      desc: 'Restaurants, hotels, or individuals create a donation specifying food name, quantity, preparation time, pickup location, and availability window.',
      icon: Utensils,
      color: 'bg-emerald-500',
    },
    {
      step: '02',
      role: 'System',
      title: 'Smart Matching & Alert',
      desc: 'Our intelligent matching algorithm prioritizes nearby verified NGOs based on distance, quantity capacity, and time urgency.',
      icon: CheckCircle,
      color: 'bg-amber-500',
    },
    {
      step: '03',
      role: 'NGO',
      title: 'Accept Food Donation',
      desc: 'Partner NGOs review available food listings and accept donations that fit their daily community distribution needs.',
      icon: HeartHandshake,
      color: 'bg-blue-500',
    },
    {
      step: '04',
      role: 'Volunteer',
      title: 'Claim Pickup & Transport',
      desc: 'Volunteers accept pickup requests, collect food from the donor, and update transit status in real-time.',
      icon: Truck,
      color: 'bg-indigo-500',
    },
    {
      step: '05',
      role: 'Delivery',
      title: 'Successful Distribution',
      desc: 'Food is safely delivered to the NGO. System updates statistics and sends delivery confirmations to all participants.',
      icon: Shield,
      color: 'bg-emerald-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
          Simple & Efficient
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">How SmartFood Works</h1>
        <p className="text-slate-600 text-base leading-relaxed">
          A seamless 5-step workflow connecting food providers with people in need without delays.
        </p>
      </div>

      <div className="relative border-l-2 border-emerald-200 ml-4 md:ml-32 space-y-12 py-4">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="relative flex items-start group">
              {/* Timeline marker */}
              <div className={`absolute -left-[17px] w-8 h-8 rounded-full ${item.color} text-white flex items-center justify-center font-bold text-xs shadow-md`}>
                {item.step}
              </div>

              <div className="ml-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl w-full hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase mb-1">
                  <Icon className="w-4 h-4" />
                  <span>{item.role} Role</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
