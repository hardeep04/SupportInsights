/**
 * Modernized AI Anomaly & Alert System
 */
import React from 'react';
import { ShieldAlert, Fingerprint, Tag, Banknote, Flame, ChevronRight, ShieldCheck } from 'lucide-react';
import { Ticket } from '../types';

interface AnomaliesComponentProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

interface Anomaly {
  icon: React.ReactNode;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
  idList?: string;
}

export const AnomaliesComponent: React.FC<AnomaliesComponentProps> = ({ tickets, isLoading }) => {
  const normalizeStatus = (status: string): string => (status || '').trim().toLowerCase();
  
  const isOpen = (ticket: Ticket): boolean => {
    const s = normalizeStatus(ticket.status);
    return s === 'open' || s === 'in progress';
  };

  const anomalies: Anomaly[] = [];

  // 1. Batch Defect Logic
  const productMap: Record<string, number> = {};
  tickets.forEach(t => { if (t.title) productMap[t.title] = (productMap[t.title] || 0) + 1; });

  Object.entries(productMap).forEach(([product, count]) => {
    if (count >= 3) {
      anomalies.push({
        icon: <Flame size={20} />,
        title: `Batch Defect Risk: ${product}`,
        description: `Potential manufacturing anomaly detected. ${count} concurrent complaints suggest a quality control breach.`,
        severity: 'critical',
      });
    }
  });

  // 2. Ghost Tickets (No Status)
  const noStatus = tickets.filter(t => !t.status || t.status.trim() === '');
  if (noStatus.length > 0) {
    anomalies.push({
      icon: <Fingerprint size={20} />,
      title: `System Blindspot: ${noStatus.length} Ghost Tickets`,
      description: `Tickets are bypassing standard workflows due to missing status parameters.`,
      idList: noStatus.map(t => t.id).join(', '),
      severity: 'critical',
    });
  }

  // 3. Uncategorized
  const uncategorized = tickets.filter(t => t.category === 'Uncategorized' || !t.category);
  if (uncategorized.length > 0) {
    anomalies.push({
      icon: <Tag size={20} />,
      title: `Routing Error: ${uncategorized.length} Uncategorized`,
      description: `Data silos forming. AI cannot accurately route these items without category metadata.`,
      severity: 'high',
    });
  }

  // 4. Refund Escalation
  const openRefunds = tickets.filter(t => (t.category?.toLowerCase().includes('refund')) && isOpen(t));
  if (openRefunds.length >= 2) {
    anomalies.push({
      icon: <Banknote size={20} />,
      title: `Financial Liability: Pending Refunds`,
      description: `${openRefunds.length} high-risk refund delays detected. Immediate escalation required to prevent chargeback penalties.`,
      severity: 'high',
    });
  }

  if (isLoading) {
    return <div className="h-64 w-full rounded-[2rem] bg-slate-100 animate-pulse border border-slate-200" />;
  }

  if (anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-[2.5rem] bg-white/40 border-2 border-dashed border-emerald-200 backdrop-blur-md">
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100 mb-4 animate-bounce">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-lg font-black text-emerald-900 uppercase tracking-tight">System Secure</h3>
        <p className="text-emerald-700/70 text-sm font-medium">No operational anomalies detected in current dataset.</p>
      </div>
    );
  }

 return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-rose-500" size={18} />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Top Issues</h3>
        </div>
        <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-md">
          {anomalies.length} ISSUES
        </span>
      </div>
      
      <div className="grid gap-3">
        {anomalies.map((anomaly, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-slate-100 hover:border-blue-200 transition-all group"
          >
            <div className={`p-2 rounded-xl ${anomaly.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
              {anomaly.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate">{anomaly.title}</h4>
              <p className="text-xs text-slate-500 truncate opacity-80">{anomaly.description}</p>
            </div>

            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomaliesComponent;