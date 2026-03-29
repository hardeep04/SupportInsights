/**
 * Modernized AI Stats Dashboard Component
 * Added 'isCompact' support for Bento Grid layouts
 */
import { Target, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import React from 'react';
import { Ticket } from '../types';

interface StatsCardsProps {
  tickets: Ticket[];
  isLoading?: boolean;
  isCompact?: boolean; // <-- Added this property
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  tickets, 
  isLoading, 
  isCompact = false // Default to false
}) => {
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
      label: 'Total Volume',
      value: total,
      trend: 'Dataset',
      icon: <Target size={isCompact ? 16 : 18} />,
      bgIcon: 'bg-blue-600',
      shadowIcon: 'shadow-blue-200',
    },
    {
      label: 'Active Queue',
      value: open.length,
      trend: `${total > 0 ? ((open.length / total) * 100).toFixed(0) : 0}%`,
      icon: <Zap size={isCompact ? 16 : 18} />,
      bgIcon: 'bg-amber-500',
      shadowIcon: 'shadow-amber-200',
    },
    {
      label: 'Critical',
      value: highPriorityOpen.length,
      trend: 'High',
      icon: <AlertTriangle size={isCompact ? 16 : 18} />,
      bgIcon: 'bg-rose-500',
      shadowIcon: 'shadow-rose-200',
    },
    {
      label: 'Resolved',
      value: resolved.length,
      trend: 'Closed',
      icon: <CheckCircle2 size={isCompact ? 16 : 18} />,
      bgIcon: 'bg-emerald-500',
      shadowIcon: 'shadow-emerald-200',
    },
  ];

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 rounded-3xl bg-white/50 border border-white animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden rounded-[2rem] border border-white bg-white/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg
            ${isCompact ? 'p-4 flex items-center gap-4' : 'p-6 flex flex-col gap-4 shadow-xl shadow-slate-200/50 hover:-translate-y-1'}`}
        >
          {/* Icon Container */}
          <div className={`flex-shrink-0 p-2.5 rounded-xl text-white shadow-lg ${stat.bgIcon} ${stat.shadowIcon}`}>
            {stat.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                {stat.label}
              </p>
              {isCompact && (
                <span className="text-[11px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-100 text-slate-400">
                    {stat.trend}
                </span>
              )}
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className={`font-black tracking-tighter text-slate-900 ${isCompact ? 'text-xl' : 'text-3xl'}`}>
                {stat.value.toLocaleString()}
              </span>
              {!isCompact && (
                 <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-white border border-slate-100 text-slate-400">
                    {stat.trend}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;