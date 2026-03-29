/**
 * Stuck Tickets Table Component
 */

import { AlertTriangle, Clock } from 'lucide-react';
import React from 'react';
import { UnresolvedTicket } from '../types';

interface StuckTicketsTableProps {
  tickets: UnresolvedTicket[];
  isLoading?: boolean;
}

export const StuckTicketsTable: React.FC<StuckTicketsTableProps> = ({
  tickets,
  isLoading,
}) => {
  const getStalenessBadge = (days: number): string => {
    if (days > 7) return 'bg-red-50 text-red-700';
    if (days > 3) return 'bg-orange-50 text-orange-700';
    return 'bg-yellow-50 text-yellow-700';
  };

  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-red-50 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Stuck Tickets</h2>
          <p className="text-slate-600">Unresolved tickets requiring attention</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : tickets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Ticket ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Days Stale
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Reason for Delay
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {tickets.slice(0, 15).map((ticket, index) => ( */}
              {tickets.map((ticket, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {ticket.id}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className={`font-semibold px-2 py-1 rounded text-xs ${getStalenessBadge(ticket.daysSinceUpdate)}`}>
                        {ticket.daysSinceUpdate}d
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-700 max-w-md">
                      {ticket.reason}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* {tickets.length > 15 && (
            <div className="mt-4 text-center text-sm text-slate-600">
              Showing 15 of {tickets.length} stuck tickets
            </div>
          )} */}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 italic">
            No stuck tickets found. Great job staying on top of support!
          </p>
        </div>
      )}
    </div>
  );
};

export default StuckTicketsTable;
