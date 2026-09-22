import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import DonationCard from '../../components/donation/DonationCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Utensils } from 'lucide-react';

export default function AvailableFood() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = ['All', 'Cooked Food', 'Rice', 'Vegetables', 'Fruits', 'Bakery', 'Packaged Food', 'Other'];

  const fetchAvailableFood = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/donations?status=PENDING');
      setDonations(data || []);
    } catch (err) {
      console.error('Error fetching available food:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableFood();
  }, []);

  const handleAcceptClick = (donation) => {
    if (!user) {
      navigate('/login?redirect=ngo');
    } else if (user.role === 'NGO') {
      navigate('/ngo/dashboard');
    } else {
      alert(`You are logged in as ${user.role}. Please log in with an NGO account to accept donations.`);
    }
  };

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.foodName.toLowerCase().includes(search.toLowerCase()) ||
      d.pickupAddress.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Available Surplus Food</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time active food listings ready for pickup and community redistribution.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by food name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Fetching active food donations..." />
      ) : filteredDonations.length === 0 ? (
        <EmptyState
          title="No Available Food Found"
          message="There are currently no active pending food donations matching your filter criteria. Check back soon!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((donation) => (
            <DonationCard
              key={donation._id}
              donation={donation}
              actionText={user?.role === 'NGO' ? 'Accept Donation' : 'Log In as NGO to Accept'}
              onAction={handleAcceptClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
