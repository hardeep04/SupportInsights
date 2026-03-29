/**
 * Category Charts Component - matching HTML design
 */

import React from 'react';
import { IssueCategory } from '../types';

interface CategoryChartsProps {
  categories: IssueCategory[];
  isLoading?: boolean;
}

const COLORS = [
  '#ff6b35', '#7c5cfc', '#2ecc71', '#f1c40f', '#e74c3c', '#3498db', '#e67e22', '#9b59b6'
];

export const CategoryCharts: React.FC<CategoryChartsProps> = ({ categories, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-200 rounded-lg h-56 animate-pulse"></div>
        <div className="bg-slate-200 rounded-lg h-56 animate-pulse"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-6 text-center text-slate-500">
          No data available
        </div>
        <div className="bg-slate-50 rounded-lg p-6 text-center text-slate-500">
          No data available
        </div>
      </div>
    );
  }

  const total = categories.reduce((sum, c) => sum + c.count, 0);
  const MAX_CATEGORIES_WITHOUT_SCROLL = 6;
  const shouldShowScrollbar = categories.length > MAX_CATEGORIES_WITHOUT_SCROLL;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Doughnut Chart Visualization */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-2">Top Issue Categories</h3>
        <p className="text-sm text-slate-600 mb-4">Distribution of issue types</p>
        
        <div className="relative w-40 h-40 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {categories.map((cat, i) => {
              const prevSum = categories.slice(0, i).reduce((sum, c) => sum + (c.count / total) * 100, 0);
              const circumference = 2 * Math.PI * 30;
              const offset = (prevSum / 100) * circumference;
              const length = (cat.count / total) * circumference;
              
              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth="20"
                  strokeDasharray={`${length} ${circumference}`}
                  strokeDashoffset={-offset}
                  className="transition-all duration-700"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{total}</div>
              <div className="text-xs text-slate-600">tickets</div>
            </div>
          </div>
        </div>

        <div className={`mt-6 space-y-2 ${shouldShowScrollbar ? 'max-h-64 overflow-y-auto' : ''}`}>
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              ></div>
              <span className="text-slate-700 truncate">{cat.name}</span>
              <span className="text-slate-500 ml-auto flex-shrink-0">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown Bar Chart */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-2">Category Breakdown</h3>
        <p className="text-sm text-slate-600 mb-4">Volume and percentage share</p>

        <div className={`space-y-4 ${shouldShowScrollbar ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
          {categories.map((cat, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                <span className="text-xs text-slate-600">
                  {cat.count} ({cat.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: COLORS[i % COLORS.length],
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCharts;
