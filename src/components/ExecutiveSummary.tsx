/**
 * Executive Summary Component
 */

import { AlertCircle, TrendingUp } from 'lucide-react';
import React from 'react';

interface ExecutiveSummaryProps {
  summary: string;
  isLoading?: boolean;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  summary,
  isLoading,
}) => {
  const summaryLines = summary.split('\n').filter(line => line.trim());

  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-amber-50 rounded-lg">
          <AlertCircle className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Summary</h2>
          <p className="text-slate-600">Read in 30 seconds for team updates</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 mt-6">
          {summaryLines.length > 0 ? (
            summaryLines.slice(0, 5).map((line, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-blue-100 rounded-full flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-slate-700 leading-relaxed">{line}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic">No summary available. Upload a CSV file to get started.</p>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Generated using AI-powered analysis • Updated {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
