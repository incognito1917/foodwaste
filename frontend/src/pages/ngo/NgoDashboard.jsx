import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import DonationCard from '../../components/donation/DonationCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Utensils, HeartHandshake, PackageCheck, Users, CheckCircle, Sparkles } from 'lucide-react';

export default function NgoDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [availableFeed, setAvailableFeed] = useState([]);
  const [myAccepted, setMyAccepted] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch available food with smart matching ranking
      const { data: available } = await API.get('/donations/available');
      setAvailableFeed(available || []);

      // Fetch all donations accepted or received by this NGO
      const { data: all } = await API.get('/donations');
      const ngoItems = (all || []).filter((d) => d.ngoId?._id === user._id || d.ngoId === user._id);
      setMyAccepted(ngoItems);
    } catch (err) {
      console.error('Error fetching NGO data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user]);

  const handleAcceptDonation = async (donation) => {
    try {
      await API.post(`/donations/${donation._id}/accept`);
      showSuccess(`Donation "${donation.foodName}" accepted successfully! Status changed to ACCEPTED.`);
      fetchData();
      setActiveSection('my-requests');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to accept donation.');
    }
  };

  // KPIs
  const availableCount = availableFeed.length;
  const acceptedCount = myAccepted.filter((d) => ['ACCEPTED', 'PICKUP_ASSIGNED', 'PICKED_UP'].includes(d.status)).length;
  const foodReceivedKg = myAccepted.filter((d) => d.status === 'DELIVERED').reduce((acc, d) => acc + (d.quantity || 0), 0);
  const peopleHelped = myAccepted.filter((d) => d.status === 'DELIVERED').reduce((acc, d) => acc + (d.peopleServed || 0), 0);

  const myRequestsList = myAccepted.filter((d) => ['ACCEPTED', 'PICKUP_ASSIGNED', 'PICKED_UP'].includes(d.status));
  const historyList = myAccepted.filter((d) => d.status === 'DELIVERED');

  return (
    <DashboardLayout activeSection={activeSection} onSelectSection={setActiveSection}>
      {/* 1. OVERVIEW DASHBOARD */}
      {activeSection === 'dashboard' && (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Available Donations" value={availableCount} icon={Utensils} color="amber" />
            <StatCard title="Accepted Requests" value={acceptedCount} icon={HeartHandshake} color="blue" />
            <StatCard title="Food Received" value={`${foodReceivedKg} kg`} icon={PackageCheck} color="emerald" />
            <StatCard title="People Helped" value={peopleHelped} icon={Users} color="purple" />
          </div>

          {/* Smart Priority Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-xl font-bold">Smart Priority Feed Active</h3>
              </div>
              <p className="text-blue-100 text-xs">
                Donations are ranked automatically by proximity to your address and expiry urgency.
              </p>
            </div>
            <button
              onClick={() => setActiveSection('available')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shadow-sm transition-all whitespace-nowrap"
            >
              Browse Available Food Feed ({availableCount})
            </button>
          </div>

          {/* Available Food Feed Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Top Smart-Matched Food Donations</h3>
              <button
                onClick={() => setActiveSection('available')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                View All Available ({availableCount})
              </button>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : availableFeed.length === 0 ? (
              <EmptyState
                title="No Available Food Right Now"
                message="All current food donations have been accepted or no new listings exist."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableFeed.slice(0, 3).map((d) => (
                  <DonationCard
                    key={d._id}
                    donation={d}
                    actionText="Accept Donation"
                    onAction={handleAcceptDonation}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. AVAILABLE FOOD SECTION */}
      {activeSection === 'available' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Available Surplus Food Directory</h3>
              <p className="text-xs text-slate-500">Sorted by Smart Priority score (proximity & time remaining)</p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : availableFeed.length === 0 ? (
            <EmptyState
              title="No Available Food"
              message="No unassigned pending food donations exist at the moment."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableFeed.map((d) => (
                <DonationCard
                  key={d._id}
                  donation={d}
                  actionText="Accept Donation"
                  onAction={handleAcceptDonation}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. MY REQUESTS / HISTORY SECTIONS */}
      {(activeSection === 'my-requests' || activeSection === 'history') && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 capitalize">
            {activeSection === 'my-requests' ? 'Accepted Donations & Pending Delivery' : 'Distribution History'}
          </h3>

          {loading ? (
            <LoadingSpinner />
          ) : (activeSection === 'my-requests' ? myRequestsList : historyList).length === 0 ? (
            <EmptyState
              title="No Records Found"
              message="No donations match this list."
              actionText="Browse Available Food"
              onAction={() => setActiveSection('available')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeSection === 'my-requests' ? myRequestsList : historyList).map((d) => (
                <DonationCard key={d._id} donation={d} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PROFILE */}
      {activeSection === 'profile' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900">NGO Profile Details</h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div><strong className="text-slate-500">Organization Name:</strong> {user?.organizationName || user?.name}</div>
            <div><strong className="text-slate-500">Contact Representative:</strong> {user?.name}</div>
            <div><strong className="text-slate-500">Email:</strong> {user?.email}</div>
            <div><strong className="text-slate-500">Phone:</strong> {user?.phone}</div>
            <div><strong className="text-slate-500">Distribution Address:</strong> {user?.address}</div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
