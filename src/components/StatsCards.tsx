/**
 * Stats Cards Component
 */

import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { Ticket } from '../types';

interface StatsCardsProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ tickets, isLoading }) => {
  const normalizeStatus = (status: string): string => (status || '').trim().toLowerCase();
  const isOpen = (ticket: Ticket): boolean => {
    const s = normalizeStatus(ticket.status);
    return s === 'open' || s === 'in progress';
  };
  const isHighPriority = (ticket: Ticket): boolean => {
    return (ticket.priority || '').trim().toLowerCase() === 'high';
  };

  const total = tickets.length;
  const open = tickets.filter(isOpen);
  const highPriorityOpen = open.filter(isHighPriority);
  const resolved = tickets.filter(t => !isOpen(t));

  const stats = [
    {
      label: 'Total Tickets',
      value: total,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: TrendingUp,
    },
    {
      label: 'Open / Unresolved',
      value: open.length,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: TrendingDown,
    },
    {
      label: 'High Priority Open',
      value: highPriorityOpen.length,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: TrendingUp,
    },
    {
      label: 'Resolved / Closed',
      value: resolved.length,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: TrendingUp,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-200 rounded-lg h-32 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} border-l-4 border-${stat.color.split('-')[1]}-600 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 uppercase">
                {stat.label}
              </span>
              <Icon className={`${stat.color} w-4 h-4`} />
            </div>
            <div className={`${stat.color} text-3xl font-bold`}>{stat.value}</div>
            {stat.label === 'Open / Unresolved' && total > 0 && (
              <div className="text-xs text-slate-600 mt-1">
                {((open.length / total) * 100).toFixed(1)}% open rate
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
