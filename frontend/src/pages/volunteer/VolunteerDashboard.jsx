import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import DonationCard from '../../components/donation/DonationCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Truck, PackageCheck, CheckCircle2, MapPin, Phone, Building2 } from 'lucide-react';
import StatusBadge from '../../components/donation/StatusBadge';

export default function VolunteerDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [availablePickups, setAvailablePickups] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch donations needing a volunteer (status ACCEPTED)
      const { data: available } = await API.get('/pickups/available');
      setAvailablePickups(available || []);

      // Fetch all donations assigned to or delivered by this volunteer
      const { data: all } = await API.get('/donations');
      const assigned = (all || []).filter((d) => d.volunteerId?._id === user._id || d.volunteerId === user._id);
      setMyPickups(assigned);
    } catch (err) {
      console.error('Error fetching volunteer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user]);

  const handleAcceptPickup = async (donation) => {
    try {
      await API.post(`/pickups/${donation._id}/accept`);
      showSuccess(`Pickup request accepted for "${donation.foodName}"! Status is now PICKUP_ASSIGNED.`);
      fetchData();
      setActiveSection('active-delivery');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to accept pickup.');
    }
  };

  const handleUpdateStatus = async (donationId, newStatus) => {
    try {
      await API.put(`/pickups/${donationId}/status`, { status: newStatus });
      showSuccess(`Status updated to ${newStatus}!`);
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update delivery status.');
    }
  };

  // KPIs
  const availableCount = availablePickups.length;
  const activeDeliveries = myPickups.filter((d) => ['PICKUP_ASSIGNED', 'PICKED_UP'].includes(d.status));
  const completedDeliveries = myPickups.filter((d) => d.status === 'DELIVERED');
  const mealsDeliveredCount = completedDeliveries.reduce((acc, d) => acc + (d.peopleServed || 0), 0);

  return (
    <DashboardLayout activeSection={activeSection} onSelectSection={setActiveSection}>
      {/* 1. OVERVIEW DASHBOARD */}
      {activeSection === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Available Pickups" value={availableCount} icon={Truck} color="amber" />
            <StatCard title="Active Deliveries" value={activeDeliveries.length} icon={PackageCheck} color="blue" />
            <StatCard title="Completed Deliveries" value={completedDeliveries.length} icon={CheckCircle2} color="emerald" />
            <StatCard title="Meals Delivered" value={mealsDeliveredCount} icon={Truck} color="purple" />
          </div>

          {/* Active Deliveries Pipeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Your Current Active Pickup / Delivery Tasks</h3>
            {loading ? (
              <LoadingSpinner />
            ) : activeDeliveries.length === 0 ? (
              <EmptyState
                title="No Active Pickups In Progress"
                message="You have no food deliveries currently in transit."
                actionText="Browse Available Pickup Requests"
                onAction={() => setActiveSection('pickups')}
              />
            ) : (
              <div className="space-y-4">
                {activeDeliveries.map((d) => (
                  <div key={d._id} className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <StatusBadge status={d.status} />
                        <h4 className="text-base font-bold text-slate-800">🍱 {d.foodName}</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        <p><strong className="text-slate-800">Donor Pickup:</strong> {d.pickupAddress}</p>
                        <p><strong className="text-slate-800">NGO Destination:</strong> {d.ngoId?.organizationName || d.ngoId?.name || 'NGO Shelter'}</p>
                        <p><strong className="text-slate-800">Quantity:</strong> {d.quantity} {d.unit} ({d.peopleServed} meals)</p>
                        <p><strong className="text-slate-800">Donor Phone:</strong> {d.donorId?.phone || 'Contact Info'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
                      {d.status === 'PICKUP_ASSIGNED' && (
                        <button
                          onClick={() => handleUpdateStatus(d._id, 'PICKED_UP')}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                        >
                          📦 Mark Collected (PICKED_UP)
                        </button>
                      )}
                      {d.status === 'PICKED_UP' && (
                        <button
                          onClick={() => handleUpdateStatus(d._id, 'DELIVERED')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          🎉 Mark Delivered (DELIVERED)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PICKUP REQUESTS SECTION */}
      {activeSection === 'pickups' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Available Pickup Requests</h3>
            <p className="text-xs text-slate-500">Donations accepted by NGOs needing immediate volunteer collection & transport</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : availablePickups.length === 0 ? (
            <EmptyState
              title="No Pickup Requests Available"
              message="There are currently no food pickups awaiting volunteer assignment."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePickups.map((d) => (
                <DonationCard
                  key={d._id}
                  donation={d}
                  actionText="Accept Pickup Task"
                  onAction={handleAcceptPickup}
                  actionVariant="amber"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ACTIVE DELIVERY & HISTORY SECTIONS */}
      {(activeSection === 'active-delivery' || activeSection === 'history') && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 capitalize">
            {activeSection === 'active-delivery' ? 'Active Deliveries' : 'Delivery History'}
          </h3>

          {loading ? (
            <LoadingSpinner />
          ) : (activeSection === 'active-delivery' ? activeDeliveries : completedDeliveries).length === 0 ? (
            <EmptyState
              title="No Delivery Tasks Found"
              message="No records match this view."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeSection === 'active-delivery' ? activeDeliveries : completedDeliveries).map((d) => (
                <DonationCard key={d._id} donation={d} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PROFILE */}
      {activeSection === 'profile' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Volunteer Profile Details</h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div><strong className="text-slate-500">Full Name:</strong> {user?.name}</div>
            <div><strong className="text-slate-500">Role:</strong> Volunteer Courier</div>
            <div><strong className="text-slate-500">Email:</strong> {user?.email}</div>
            <div><strong className="text-slate-500">Phone:</strong> {user?.phone}</div>
            <div><strong className="text-slate-500">Base Location:</strong> {user?.address}</div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
