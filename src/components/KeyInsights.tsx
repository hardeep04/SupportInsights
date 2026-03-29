/**
 * Key Insights Component
 */

import { Lightbulb, Target, TrendingDown } from 'lucide-react';
import React from 'react';
import { KeyPattern } from '../types';

interface KeyInsightsProps {
  patterns: KeyPattern[];
  isLoading?: boolean;
}

export const KeyInsights: React.FC<KeyInsightsProps> = ({ patterns, isLoading }) => {
  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-purple-50 rounded-lg">
          <Lightbulb className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Key Patterns & Insights</h2>
          <p className="text-slate-600">Actionable trends in your support data</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : patterns.length > 0 ? (
        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className="border border-slate-300 rounded-lg p-4 bg-gradient-to-r from-slate-50 to-transparent hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <TrendingDown className="w-5 h-5 text-purple-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">{pattern.pattern}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">IMPACT</p>
                      <p className="text-sm text-slate-700">{pattern.impact}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-green-600" />
                        <p className="text-xs font-semibold text-slate-600">RECOMMENDATION</p>
                      </div>
                      <p className="text-sm text-slate-700">{pattern.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 italic">
            No patterns identified yet. Upload a CSV to discover insights.
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Pro Tip:</strong> Use these insights to optimize your support processes and reduce resolution times.
        </p>
      </div>
    </div>
  );
};

export default KeyInsights;
