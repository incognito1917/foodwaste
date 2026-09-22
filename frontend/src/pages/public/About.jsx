import React from 'react';
import { Target, Eye, ShieldCheck, Heart, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
          About SmartFood
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">
          Reducing Food Waste, One Meal at a Time
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Smart Food Waste Management System is a tech-driven social platform bridging the gap between food abundance and food scarcity.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            To eliminate food waste in urban communities by empowering donors, NGOs, and volunteers with instant smart matching, automated logistics tracking, and food safety transparency.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Our Vision</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            A world where zero edible food goes to landfills, and every community has real-time access to surplus meals through compassionate volunteer networks.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Core Platform Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">Safety & Transparency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear donor-provided expiry timestamps, preparation details, and pickup addresses ensure smooth distribution.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <Users className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">Community Collaboration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connecting restaurants, hotels, local NGOs, and dedicated volunteer drivers into a unified network.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <Award className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">Measurable Impact</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time analytics tracking total meals rescued, kilograms saved, and active delivery pipelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
