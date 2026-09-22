import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  History,
  Bell,
  User,
  Utensils,
  HeartHandshake,
  Truck,
  Users,
  BarChart3,
  Building2,
  Shield,
} from 'lucide-react';

export default function Sidebar({ role, activeSection, onSelectSection }) {
  const getNavItems = () => {
    switch (role) {
      case 'Donor':
        return [
          { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
          { id: 'donate', name: 'Donate Food', icon: PlusCircle },
          { id: 'my-donations', name: 'My Donations', icon: Package },
          { id: 'active', name: 'Active Donations', icon: Utensils },
          { id: 'history', name: 'Donation History', icon: History },
          { id: 'notifications', name: 'Notifications', icon: Bell },
          { id: 'profile', name: 'Profile', icon: User },
        ];

      case 'NGO':
        return [
          { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
          { id: 'available', name: 'Available Food', icon: Utensils },
          { id: 'my-requests', name: 'My Requests', icon: HeartHandshake },
          { id: 'history', name: 'Distribution History', icon: History },
          { id: 'notifications', name: 'Notifications', icon: Bell },
          { id: 'profile', name: 'Profile', icon: User },
        ];

      case 'Volunteer':
        return [
          { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
          { id: 'pickups', name: 'Pickup Requests', icon: Truck },
          { id: 'active-delivery', name: 'Active Delivery', icon: Package },
          { id: 'history', name: 'Delivery History', icon: History },
          { id: 'notifications', name: 'Notifications', icon: Bell },
          { id: 'profile', name: 'Profile', icon: User },
        ];

      case 'Admin':
        return [
          { id: 'overview', name: 'Overview Dashboard', icon: LayoutDashboard },
          { id: 'users', name: 'Users Management', icon: Users },
          { id: 'donations', name: 'Donations Monitor', icon: Package },
          { id: 'ngos', name: 'NGOs Directory', icon: Building2 },
          { id: 'volunteers', name: 'Volunteers Directory', icon: Truck },
          { id: 'reports', name: 'Analytics & Reports', icon: BarChart3 },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Role Tag */}
        <div className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{role} Portal</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xxs text-slate-400 text-center">
        SmartFood v1.0 • College Demo
      </div>
    </aside>
  );
}
