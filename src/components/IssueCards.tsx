/**
 * Issue Cards Component
 */

import { AlertCircle, AlertOctagon, AlertTriangle } from 'lucide-react';
import React from 'react';
import { IssueCategory } from '../types';

interface IssueCardsProps {
  issues: IssueCategory[];
  isLoading?: boolean;
}

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-50 border-red-200 text-red-700';
    case 'high':
      return 'bg-orange-50 border-amber-200 text-amber-700';
    case 'medium':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'low':
      return 'bg-green-50 border-green-200 text-green-700';
    default:
      return 'bg-slate-50 border-slate-200 text-slate-700';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <AlertOctagon className="w-5 h-5" />;
    case 'high':
      return <AlertTriangle className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getSeverityLabel = (severity: string): string => {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
};

export const IssueCards: React.FC<IssueCardsProps> = ({ issues, isLoading }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Top Issue Categories</h2>
        <p className="text-slate-600">Major support ticket categories by impact</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-40 animate-pulse bg-slate-100"></div>
          ))}
        </div>
      ) : issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue, index) => (
            <div
              key={index}
              className={`card border-2 ${getSeverityColor(issue.severity)} card-hover`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="mt-1">{getSeverityIcon(issue.severity)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{issue.name}</h3>
                    <p className="text-sm opacity-75">
                      {getSeverityLabel(issue.severity)} Severity
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">{issue.count}</span>
                  <span className="text-lg font-semibold">{issue.percentage.toFixed(1)}%</span>
                </div>

                <div className="w-full bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(issue.percentage * 3.33, 100)}%` }}
                  ></div>
                </div>

                <p className="text-xs opacity-75">of total tickets</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-slate-500 italic">
            No issues found. Upload a CSV to analyze your support tickets.
          </p>
        </div>
      )}
    </div>
  );
};

export default IssueCards;
