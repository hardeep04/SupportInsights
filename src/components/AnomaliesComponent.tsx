/**
 * Anomalies and Alerts Component
 */

import React from 'react';
import { Ticket } from '../types';

interface AnomaliesComponentProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

interface Anomaly {
  icon: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
}

export const AnomaliesComponent: React.FC<AnomaliesComponentProps> = ({ tickets, isLoading }) => {
  const normalizeStatus = (status: string): string => (status || '').trim().toLowerCase();
  const normalizeCat = (cat: string): string => {
    if (!cat || cat.trim() === '') return 'Uncategorised';
    const s = cat.trim().toLowerCase();
    if (s.includes('delivery') || s.includes('shipping')) return 'Delivery / Shipping';
    if (s.includes('refund')) return 'Refund Delay';
    if (s.includes('replacement')) return 'Replacement Delay';
    if (s.includes('quality') || s.includes('defect') || s.includes('authenticity')) return 'Product Quality / Defect';
    if (s.includes('wrong') || s.includes('missing')) return 'Wrong / Missing Item';
    if (s.includes('damaged')) return 'Damaged Product';
    if (s.includes('packaging')) return 'Packaging Issue';
    return cat.trim().replace(/\b\w/g, x => x.toUpperCase());
  };

  const isOpen = (ticket: Ticket): boolean => {
    const s = normalizeStatus(ticket.status);
    return s === 'open' || s === 'in progress';
  };

  const anomalies: Anomaly[] = [];

  // Check for batch defects (3+ complaints on same product)
  const productMap: Record<string, number> = {};
  tickets.forEach(t => {
    if (t.title) {
      productMap[t.title] = (productMap[t.title] || 0) + 1;
    }
  });

  Object.entries(productMap).forEach(([product, count]) => {
    if (count >= 3) {
      anomalies.push({
        icon: '🚨',
        title: `Batch Defect Risk: ${product}`,
        description: `${count} complaints on this SKU. Possible manufacturing or QC issue — recommend urgent inspection.`,
        severity: 'critical',
      });
    }
  });

  // Check for tickets with no status
  const noStatus = tickets.filter(t => !t.status || t.status.trim() === '');
  if (noStatus.length > 0) {
    anomalies.push({
      icon: '🕳',
      title: `${noStatus.length} Tickets Have No Status`,
      description: `${noStatus.map(t => t.id).join(', ')} — invisible to the resolution workflow. Assign status immediately.`,
      severity: 'critical',
    });
  }

  // Check for uncategorized tickets
  const uncategorized = tickets.filter(t => t.category === 'Uncategorized' || !t.category);
  if (uncategorized.length > 0) {
    anomalies.push({
      icon: '🏷',
      title: `${uncategorized.length} Tickets Have No Category`,
      description: `${uncategorized.map(t => t.id).slice(0, 3).join(', ')}${uncategorized.length > 3 ? '...' : ''} — cannot be routed correctly.`,
      severity: 'high',
    });
  }

  // Check for unresolved refunds
  const openRefunds = tickets
    .filter(t => normalizeCat(t.category) === 'Refund Delay' && isOpen(t));
  if (openRefunds.length >= 2) {
    anomalies.push({
      icon: '💸',
      title: `${openRefunds.length} Refund Tickets Unresolved`,
      description: `${openRefunds.map(t => t.id).join(', ')} — risk of chargebacks. Escalate to Finance today.`,
      severity: 'high',
    });
  }

  // Check for high-priority open tickets
  const highPriorityOpen = tickets.filter(
    t => isOpen(t) && (t.priority || '').trim().toLowerCase() === 'high'
  );
  if (highPriorityOpen.length >= 3) {
    anomalies.push({
      icon: '🔴',
      title: `${highPriorityOpen.length} High-Priority Tickets Unresolved`,
      description: 'Leaving these open signals overload or unclear escalation paths. Action required today.',
      severity: 'high',
    });
  }

  const getSeverityColor = (
    severity: 'critical' | 'high' | 'medium'
  ): { bg: string; border: string; text: string; pulse: string } => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          pulse: 'animate-pulse border-red-400',
        };
      case 'high':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-700',
          pulse: '',
        };
      default:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          pulse: '',
        };
    }
  };

  if (isLoading) {
    return <div className="bg-slate-200 rounded-lg h-32 animate-pulse"></div>;
  }

  if (anomalies.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-medium">✅ No critical anomalies detected</p>
        <p className="text-sm text-green-600 mt-1">Your support queue is operating normally.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {anomalies.map((anomaly, i) => {
        const colors = getSeverityColor(anomaly.severity);
        return (
          <div
            key={i}
            className={`${colors.bg} border-2 ${colors.border} ${colors.pulse} rounded-lg p-4 flex items-start gap-3`}
          >
            <div className="text-2xl flex-shrink-0">{anomaly.icon}</div>
            <div className="flex-1">
              <div className={`font-semibold ${colors.text}`}>🔴 ALERT — {anomaly.title}</div>
              <div className={`text-sm ${colors.text} opacity-90 mt-1`}>{anomaly.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnomaliesComponent;
