import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Utensils, HeartHandshake, Truck, ShieldCheck, ArrowRight, Heart, AlertTriangle, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({
    mealsDonated: 1250,
    foodRescuedKg: 840,
    peopleHelped: 1100,
    successfulPickups: 320,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const { data } = await API.get('/donations');
        if (data && Array.isArray(data)) {
          const delivered = data.filter((d) => d.status === 'DELIVERED');
          const meals = delivered.reduce((acc, curr) => acc + (curr.peopleServed || 0), 0);
          const rescued = delivered.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
          setStats({
            mealsDonated: meals || 1250,
            foodRescuedKg: rescued || 840,
            peopleHelped: meals || 1100,
            successfulPickups: delivered.length || 320,
          });
        }
      } catch (err) {
        // Fallback to initial display stats if backend offline
      }
    };
    fetchPublicStats();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Copy */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold tracking-wide border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Smart Redistribution Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Don't Waste Food.{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                  Share It.
                </span>{' '}
                Save Lives.
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect surplus food with people who need it through a smart and simple food redistribution platform. Bridging donors, NGOs, and volunteers in real time.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register?role=Donor"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Utensils className="w-5 h-5" />
                  <span>Donate Food</span>
                </Link>
                <Link
                  to="/available-food"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-xs transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <HeartHandshake className="w-5 h-5 text-emerald-600" />
                  <span>Find Food</span>
                </Link>
                <Link
                  to="/register?role=Volunteer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base shadow-md shadow-amber-500/30 transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Truck className="w-5 h-5" />
                  <span>Become a Volunteer</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="relative flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-emerald-100/80 relative space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      🍱
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Fresh Surplus Meals</h4>
                      <p className="text-xs text-slate-500">Live Smart Feed</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                {/* Sample Live Mock Item */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Grand Horizon Hotel</span>
                    <span className="text-red-600 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2h left
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">40 Meal Boxes (Vegetable Rice & Curry)</p>
                  <div className="flex items-center text-slate-400 text-xxs">
                    <MapPin className="w-3 h-3 text-emerald-500 mr-1" /> Downtown • Pick-up ready
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-emerald-50/70 rounded-xl">
                    <p className="text-xs text-slate-500 font-medium">Smart Match Score</p>
                    <p className="text-lg font-black text-emerald-700">98% Priority</p>
                  </div>
                  <div className="p-3 bg-amber-50/70 rounded-xl">
                    <p className="text-xs text-slate-500 font-medium">Est. Delivery</p>
                    <p className="text-lg font-black text-amber-700">&lt; 30 Mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Our Real-Time Platform Impact</h2>
            <p className="text-emerald-200 text-sm mt-2">
              Transforming surplus food into immediate nourishment for local communities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-emerald-800/40 rounded-2xl border border-emerald-700/50">
              <h3 className="text-3xl sm:text-4xl font-black text-amber-400">{stats.mealsDonated}+</h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">Meals Donated</p>
            </div>
            <div className="p-4 bg-emerald-800/40 rounded-2xl border border-emerald-700/50">
              <h3 className="text-3xl sm:text-4xl font-black text-emerald-300">{stats.foodRescuedKg} kg</h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">Food Rescued</p>
            </div>
            <div className="p-4 bg-emerald-800/40 rounded-2xl border border-emerald-700/50">
              <h3 className="text-3xl sm:text-4xl font-black text-amber-400">{stats.peopleHelped}+</h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">People Helped</p>
            </div>
            <div className="p-4 bg-emerald-800/40 rounded-2xl border border-emerald-700/50">
              <h3 className="text-3xl sm:text-4xl font-black text-emerald-300">{stats.successfulPickups}</h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">Successful Pickups</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full">
            Understanding The Challenge
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">The Food Waste Crisis</h2>
          <p className="text-slate-600 text-base mt-2">
            Millions of tons of perfectly edible food are discarded daily while communities experience food hunger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Massive Surplus Waste</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Restaurants, events, and households generate large volumes of excess edible food that gets thrown away simply due to lack of immediate disposal options.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Widespread Insecurity</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Shelters and community groups struggle daily to procure nutritious meals for underprivileged individuals and families.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Communication & Delay Gaps</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Without real-time coordination and nearby volunteer logistics, fresh food spoils before it can be collected and safely distributed.
            </p>
          </div>
        </div>
      </section>

      {/* 4. OUR SOLUTION SECTION */}
      <section className="bg-emerald-50/50 py-16 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                Technology for Social Good
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Our Smart Redistribution Solution
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                SmartFood provides a digital bridge connecting food providers directly with local NGOs and certified volunteers. With automated urgency countdowns and smart proximity matching, food moves from donor to plate in record time.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Real-time food availability listings with dynamic timers</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Smart location-based priority matching for NGOs</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Verified volunteer pickup and delivery tracking</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Complete lifecycle audit and transparency for administrators</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-emerald-200/80 shadow-lg space-y-4">
              <h3 className="text-xl font-bold text-slate-800">5-Step Automated Workflow</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Donate Food', desc: 'Donor posts food details, quantity, address & available until time.' },
                  { step: '2', title: 'Smart Matching', desc: 'System ranks & notifies nearest NGOs and volunteers.' },
                  { step: '3', title: 'Accept Pickup', desc: 'Partner NGO accepts the food donation request.' },
                  { step: '4', title: 'Collect Food', desc: 'Volunteer claims pickup & collects food from donor.' },
                  { step: '5', title: 'Deliver Food', desc: 'Volunteer delivers meals safely to NGO or community shelter.' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-extrabold">Have surplus food?</h2>
            <p className="text-amber-100 text-base">Help us turn food waste into nourishing meals today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              to="/register?role=Donor"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-md text-center transition-all"
            >
              Donate Food
            </Link>
            <Link
              to="/register?role=Volunteer"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm shadow-md text-center transition-all"
            >
              Join as Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
