import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/donation/StatusBadge';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Building2,
  Truck,
  Package,
  Heart,
  BarChart3,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [donationsList, setDonationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const { data: statsData } = await API.get('/admin/statistics');
      setStats(statsData);

      const { data: usersData } = await API.get('/admin/users');
      setUsersList(usersData || []);

      const { data: donationsData } = await API.get('/admin/donations');
      setDonationsList(donationsData || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId) => {
    try {
      const { data } = await API.put(`/admin/users/${userId}/status`);
      showSuccess(data.message);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: data.user.isActive } : u))
      );
    } catch (err) {
      showError('Failed to update user status.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeSection={activeSection} onSelectSection={setActiveSection}>
        <LoadingSpinner text="Loading platform statistics & management data..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeSection={activeSection} onSelectSection={setActiveSection}>
      {/* 1. OVERVIEW DASHBOARD & RECHARTS */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Platform Users" value={stats?.totalUsers || 0} icon={Users} color="blue" />
            <StatCard title="Total Food Donations" value={stats?.totalDonations || 0} icon={Package} color="amber" />
            <StatCard title="Food Distributed" value={`${stats?.foodDistributed || 0} kg`} icon={Package} color="emerald" />
            <StatCard title="Total People Helped" value={stats?.peopleHelped || 0} icon={Heart} color="purple" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Registered Donors" value={stats?.totalDonors || 0} icon={Building2} color="emerald" />
            <StatCard title="Partner NGOs" value={stats?.totalNgos || 0} icon={Building2} color="amber" />
            <StatCard title="Volunteers Network" value={stats?.totalVolunteers || 0} icon={Truck} color="blue" />
            <StatCard title="Successful Deliveries" value={stats?.successfulPickups || 0} icon={CheckCircle} color="emerald" />
          </div>

          {/* Recharts Graphical Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Monthly Donation Trends */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Monthly Food Donations & Deliveries</span>
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.donationsByMonth || []}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="donations" stroke="#10b981" fill="#ecfdf5" name="Total Donations" />
                    <Area type="monotone" dataKey="delivered" stroke="#f59e0b" fill="#fef3c7" name="Delivered" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Donation Lifecycle Status Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <PieIcon className="w-4 h-4 text-amber-600" />
                <span>Donation Lifecycle Status Breakdown</span>
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.statusDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {(stats?.statusDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 3: User Role Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Platform Registered User Demographics</span>
            </h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.userDistribution || []}>
                  <XAxis dataKey="role" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} name="Active User Accounts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS MANAGEMENT SECTION */}
      {(activeSection === 'users' || activeSection === 'ngos' || activeSection === 'volunteers') && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 capitalize">
              {activeSection === 'ngos' ? 'Registered Partner NGOs' : activeSection === 'volunteers' ? 'Registered Volunteers' : 'User Accounts Directory'}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Name / Org</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList
                  .filter((u) => {
                    if (activeSection === 'ngos') return u.role === 'NGO';
                    if (activeSection === 'volunteers') return u.role === 'Volunteer';
                    return true;
                  })
                  .map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-800">{u.organizationName || u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">{u.phone}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate">{u.address}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'Admin' && (
                          <button
                            onClick={() => handleToggleUserStatus(u._id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DONATIONS MONITOR SECTION */}
      {(activeSection === 'donations' || activeSection === 'reports') && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Platform Donations Monitor</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Food Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Donor</th>
                  <th className="p-4">NGO</th>
                  <th className="p-4">Volunteer</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donationsList.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">🍱 {d.foodName}</td>
                    <td className="p-4">{d.category}</td>
                    <td className="p-4 font-semibold">{d.quantity} {d.unit}</td>
                    <td className="p-4">{d.donorId?.name || 'Donor'}</td>
                    <td className="p-4">{d.ngoId?.organizationName || d.ngoId?.name || 'Unassigned'}</td>
                    <td className="p-4">{d.volunteerId?.name || 'Unassigned'}</td>
                    <td className="p-4">
                      <StatusBadge status={d.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
