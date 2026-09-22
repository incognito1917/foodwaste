import React from 'react';
import StatusBadge from './StatusBadge';
import { getRemainingTime } from '../../utils/dateUtils';
import { MapPin, Users, Clock, Utensils, Sparkles, Building2, Package } from 'lucide-react';

export default function DonationCard({ donation, onAction, actionText, actionVariant = 'primary' }) {
  const { text: timeRemainingText, isExpired, urgent } = getRemainingTime(donation.availableUntil);
  const currentStatus = isExpired && donation.status !== 'DELIVERED' && donation.status !== 'CANCELLED' ? 'EXPIRED' : donation.status;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {/* Top Banner / Category */}
      <div className="p-5 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 mb-1.5">
              {donation.category}
            </span>
            <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              🍱 {donation.foodName}
            </h3>
          </div>
          <StatusBadge status={currentStatus} />
        </div>

        {/* Smart match indicator if available */}
        {donation.matchedReason && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Smart Match: {donation.matchedReason}</span>
          </div>
        )}

        {/* Donor Organization */}
        {donation.donorId && (
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">
              {donation.donorId.organizationName || donation.donorId.name}
            </span>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="text-slate-800 font-semibold">{donation.quantity}</strong> {donation.unit}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Serves <strong className="text-slate-800 font-semibold">{donation.peopleServed}</strong> people
            </span>
          </div>
        </div>

        {/* Location & Time Remaining */}
        <div className="space-y-1.5 pt-1 text-xs">
          <div className="flex items-start space-x-2 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{donation.pickupAddress}</span>
          </div>

          <div className={`flex items-center space-x-2 ${urgent ? 'text-red-600 font-semibold animate-pulse' : 'text-slate-600'}`}>
            <Clock className="w-4 h-4 shrink-0" />
            <span>Available: {timeRemainingText}</span>
          </div>
        </div>

        {donation.description && (
          <p className="text-xs text-slate-500 line-clamp-2 pt-1 border-t border-slate-100 italic">
            "{donation.description}"
          </p>
        )}
      </div>

      {/* Action Footer */}
      {onAction && actionText && !isExpired && (
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => onAction(donation)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2 ${
              actionVariant === 'primary'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : actionVariant === 'amber'
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
}
