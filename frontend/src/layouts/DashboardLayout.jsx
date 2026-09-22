import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import NotificationBell from '../components/dashboard/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ activeSection, onSelectSection, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <Sidebar role={user?.role} activeSection={activeSection} onSelectSection={onSelectSection} />

        {/* Main Content Dashboard Area */}
        <main className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6 overflow-hidden">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back, {user?.organizationName || user?.name}!
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Role: <strong className="text-emerald-700 font-semibold">{user?.role}</strong> • {user?.email}
              </p>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <NotificationBell />
              <div className="h-6 w-px bg-slate-200" />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Render Active Section Children */}
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
