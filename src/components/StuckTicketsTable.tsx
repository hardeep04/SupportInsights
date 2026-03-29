/**
 * Minimalist Professional Table
 * Focus: Alignment and Readability
 */
import React from 'react';
import { UnresolvedTicket } from '../types';

interface StuckTicketsTableProps {
  tickets: UnresolvedTicket[];
  isLoading?: boolean;
}

export const StuckTicketsTable: React.FC<StuckTicketsTableProps> = ({ tickets, isLoading }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200">
      {/* 1. Simple Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Stuck Tickets</h2>
        <p className="text-sm text-slate-500">Tickets with no activity for 3+ days</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">ID</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Staleness</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Reason for Delay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={3} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                </tr>
              ))
            ) : tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-blue-600 font-mono">
                      #{ticket.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${ticket.daysSinceUpdate > 5 ? 'bg-red-500' : 'bg-amber-400'}`} />
                      <span className="text-sm text-slate-600">{ticket.daysSinceUpdate} days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 line-clamp-1 max-w-md">
                      {ticket.reason}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-slate-400 italic">
                  No tickets requiring immediate attention.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StuckTicketsTable;