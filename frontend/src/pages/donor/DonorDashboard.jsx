import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import DonationCard from '../../components/donation/DonationCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Utensils, Heart, Users, Package, PlusCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DonorDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  // Form State
  const [form, setForm] = useState({
    foodName: '',
    category: 'Cooked Food',
    quantity: '',
    unit: 'kg',
    peopleServed: '',
    preparationTime: '',
    availableUntil: '',
    pickupAddress: user?.address || '',
    description: '',
    image: '',
  });

  const fetchMyDonations = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/donations?donorId=${user._id}`);
      setDonations(data || []);
    } catch (err) {
      console.error('Error fetching donor donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyDonations();
    }
  }, [user]);

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    try {
      await API.post('/donations', {
        ...form,
        quantity: Number(form.quantity),
        peopleServed: Number(form.peopleServed),
      });
      showSuccess('Food donation created successfully! Status is now PENDING.');
      setForm({
        foodName: '',
        category: 'Cooked Food',
        quantity: '',
        unit: 'kg',
        peopleServed: '',
        preparationTime: '',
        availableUntil: '',
        pickupAddress: user?.address || '',
        description: '',
        image: '',
      });
      fetchMyDonations();
      setActiveSection('my-donations');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create food donation.');
    }
  };

  // KPIs
  const totalDonations = donations.length;
  const foodDonatedKg = donations.reduce((acc, d) => acc + (d.quantity || 0), 0);
  const peopleHelped = donations.filter((d) => d.status === 'DELIVERED').reduce((acc, d) => acc + (d.peopleServed || 0), 0);
  const activeDonationsCount = donations.filter((d) => ['PENDING', 'ACCEPTED', 'PICKUP_ASSIGNED', 'PICKED_UP'].includes(d.status)).length;

  const activeDonationsList = donations.filter((d) => ['PENDING', 'ACCEPTED', 'PICKUP_ASSIGNED', 'PICKED_UP'].includes(d.status));
  const historyList = donations.filter((d) => ['DELIVERED', 'EXPIRED', 'CANCELLED'].includes(d.status));

  return (
    <DashboardLayout activeSection={activeSection} onSelectSection={setActiveSection}>
      {/* 1. OVERVIEW DASHBOARD SECTION */}
      {activeSection === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Donations" value={totalDonations} icon={Package} color="blue" />
            <StatCard title="Food Donated" value={`${foodDonatedKg} kg`} icon={Utensils} color="emerald" />
            <StatCard title="People Helped" value={peopleHelped} icon={Heart} color="purple" />
            <StatCard title="Active Donations" value={activeDonationsCount} icon={Clock} color="amber" />
          </div>

          {/* Quick Create Action */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <h3 className="text-xl font-bold">Have Surplus Food to Share?</h3>
              <p className="text-emerald-100 text-xs mt-1">
                Help local shelters and NGOs feed hungry people in your community right now.
              </p>
            </div>
            <button
              onClick={() => setActiveSection('donate')}
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-sm transition-all whitespace-nowrap"
            >
              + Create New Donation
            </button>
          </div>

          {/* Active Donations Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Your Active Donations</h3>
              <button
                onClick={() => setActiveSection('active')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                View All Active ({activeDonationsCount})
              </button>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : activeDonationsList.length === 0 ? (
              <EmptyState
                title="No Active Donations"
                message="You currently have no active food donations."
                actionText="Donate Surplus Food Now"
                onAction={() => setActiveSection('donate')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeDonationsList.slice(0, 3).map((d) => (
                  <DonationCard key={d._id} donation={d} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. DONATE FOOD FORM SECTION */}
      {activeSection === 'donate' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Post Surplus Food Donation</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in accurate details so partner NGOs can pick up and distribute food safely.
            </p>
          </div>

          <form onSubmit={handleCreateDonation} className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Food Item Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., 40 Boxes Veg Biryani & Curry"
                value={form.foodName}
                onChange={(e) => setForm({ ...form, foodName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Food Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  {['Cooked Food', 'Rice', 'Vegetables', 'Fruits', 'Bakery', 'Packaged Food', 'Other'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g., 25"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit *</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  {['kg', 'plates', 'boxes', 'packets', 'items'].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">People Served *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g., 30"
                  value={form.peopleServed}
                  onChange={(e) => setForm({ ...form, peopleServed: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preparation Time</label>
                <input
                  type="datetime-local"
                  value={form.preparationTime}
                  onChange={(e) => setForm({ ...form, preparationTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available Until *</label>
                <input
                  type="datetime-local"
                  required
                  value={form.availableUntil}
                  onChange={(e) => setForm({ ...form, availableUntil: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Address *</label>
              <input
                type="text"
                required
                placeholder="123 Restaurant Street, Kitchen Entrance"
                value={form.pickupAddress}
                onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Special Description / Food Safety Notes</label>
              <textarea
                rows={3}
                placeholder="Hygienically packed, stored in warmers, contains vegetarian items only..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Food Donation</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. MY DONATIONS / ACTIVE / HISTORY SECTIONS */}
      {(activeSection === 'my-donations' || activeSection === 'active' || activeSection === 'history') && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 capitalize">
            {activeSection.replace('-', ' ')}
          </h3>

          {loading ? (
            <LoadingSpinner />
          ) : (activeSection === 'active' ? activeDonationsList : activeSection === 'history' ? historyList : donations).length === 0 ? (
            <EmptyState
              title="No Donations Found"
              message="No records found for this view."
              actionText="Donate Food"
              onAction={() => setActiveSection('donate')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeSection === 'active' ? activeDonationsList : activeSection === 'history' ? historyList : donations).map((d) => (
                <DonationCard key={d._id} donation={d} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PROFILE SECTION */}
      {activeSection === 'profile' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Donor Profile Information</h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div><strong className="text-slate-500">Full Name:</strong> {user?.name}</div>
            <div><strong className="text-slate-500">Organization Name:</strong> {user?.organizationName || 'N/A'}</div>
            <div><strong className="text-slate-500">Email:</strong> {user?.email}</div>
            <div><strong className="text-slate-500">Phone:</strong> {user?.phone}</div>
            <div><strong className="text-slate-500">Primary Address:</strong> {user?.address}</div>
            <div><strong className="text-slate-500">Account Role:</strong> {user?.role}</div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
