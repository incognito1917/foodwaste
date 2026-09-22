import React from 'react';
import { Clock, CheckCircle, Truck, PackageCheck, AlertOctagon, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'PENDING',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
        };
      case 'ACCEPTED':
        return {
          label: 'ACCEPTED',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: CheckCircle,
        };
      case 'PICKUP_ASSIGNED':
        return {
          label: 'PICKUP ASSIGNED',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: Truck,
        };
      case 'PICKED_UP':
        return {
          label: 'PICKED UP',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Truck,
        };
      case 'DELIVERED':
        return {
          label: 'DELIVERED',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: PackageCheck,
        };
      case 'EXPIRED':
        return {
          label: 'EXPIRED',
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: AlertOctagon,
        };
      case 'CANCELLED':
        return {
          label: 'CANCELLED',
          bg: 'bg-slate-100 text-slate-600 border-slate-300',
          icon: XCircle,
        };
      default:
        return {
          label: status || 'UNKNOWN',
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          icon: Clock,
        };
    }
  };

  const { label, bg, icon: Icon } = getBadgeConfig();

  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bg}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </span>
  );
}
