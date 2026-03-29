/**
 * Product and Category Analysis Component
 */

import React from 'react';
import { Ticket, mergeCategory, normalizeCategory } from '../types';

interface ProductAnalysisProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

interface CategoryAnalysis {
  category: string;
  total: number;
  open: number;
  openPercentage: number;
}

export const ProductAnalysis: React.FC<ProductAnalysisProps> = ({ tickets, isLoading }) => {
  const normalizeStatus = (status: string): string => (status || '').trim().toLowerCase();
  const isOpen = (ticket: Ticket): boolean => {
    const s = normalizeStatus(ticket.status);
    return s === 'open' || s === 'in progress';
  };

  /**
   * Check if category indicates a product-specific quality issue
   * Only product quality/defect and damaged product issues are product-related
   */
  const isProductQualityIssue = (category: string): boolean => {
    const lower = (category || '').toLowerCase();
    return lower.includes('quality') || 
           lower.includes('defect') || 
           lower.includes('damaged') ||
           lower.includes('authenticity');
  };

  // Product analysis - only count product quality/defect issues
  const productMap: Record<string, number> = {};
  tickets.forEach(t => {
    // Only count tickets with product-quality-related issues
    if (t.product && isProductQualityIssue(t.category)) {
      productMap[t.product] = (productMap[t.product] || 0) + 1;
    }
  });

  // Calculate statistical threshold for flagging anomalies
  const productCounts = Object.values(productMap);
  let flagThreshold = 3; // Default for small datasets
  
  if (productCounts.length > 0) {
    const mean = productCounts.reduce((a, b) => a + b, 0) / productCounts.length;
    const variance = productCounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / productCounts.length;
    const stdDev = Math.sqrt(variance);
    
    // Flag products at mean + 1 standard deviation (statistical anomaly detection)
    // Scales automatically: small datasets get lower threshold, large datasets get higher
    flagThreshold = Math.max(3, Math.ceil(mean + stdDev));
  }

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      flagged: count >= flagThreshold,
    }));

  const maxProductCount = topProducts[0]?.count || 1;

  // Category open rate analysis (with selective merging - excludes Wrong/Missing merge)
  const categoryMap: Record<string, CategoryAnalysis> = {};
  tickets.forEach(t => {
    // Merge only Delivery and Product Quality, NOT Wrong/Missing Item
    const cat = mergeCategory(normalizeCategory(t.category || 'Uncategorized'), false);
    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, total: 0, open: 0, openPercentage: 0 };
    }
    categoryMap[cat].total++;
    if (isOpen(t)) {
      categoryMap[cat].open++;
    }
  });

  const categoryAnalysis = Object.values(categoryMap)
    .map(c => ({
      ...c,
      openPercentage: c.total > 0 ? Math.round((c.open / c.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const MAX_PRODUCTS_WITHOUT_SCROLL = 8;
  const MAX_CATEGORIES_WITHOUT_SCROLL = 6;
  const showProductsScrollbar = topProducts.length > MAX_PRODUCTS_WITHOUT_SCROLL;
  const showCategoriesScrollbar = categoryAnalysis.length > MAX_CATEGORIES_WITHOUT_SCROLL;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-200 rounded-lg h-64 animate-pulse"></div>
        <div className="bg-slate-200 rounded-lg h-64 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Products with Most Complaints */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-2">🎯 Products with Quality Issues</h3>
        <p className="text-sm text-slate-600 mb-4">⚠ flagged = statistical anomaly (above average, batch defect risk)</p>

        {topProducts.length > 0 ? (
          <div className={`space-y-3 ${showProductsScrollbar ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {product.name}
                    {product.flagged && (
                      <span className="ml-1 text-red-500">⚠</span>
                    )}
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(product.count / maxProductCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm font-mono text-slate-600 min-w-fit">
                  {product.count}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No products with quality issues found. Excellent!</p>
        )}
      </div>

      {/* Open Rate by Category */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-2">📋 Open Rate by Category</h3>
        <p className="text-sm text-slate-600 mb-4">Which categories have the most unresolved tickets</p>

        {categoryAnalysis.length > 0 ? (
          <div className={`space-y-3 ${showCategoriesScrollbar ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
            {categoryAnalysis.map((cat, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {cat.category}
                  </div>
                </div>
                <div
                  className="text-sm font-mono font-bold whitespace-nowrap px-2 py-1 rounded"
                  style={{
                    color: cat.open > 0 ? '#e74c3c' : '#2ecc71',
                    backgroundColor: cat.open > 0 ? 'rgba(231,76,60,0.1)' : 'rgba(46,204,113,0.1)',
                  }}
                >
                  {cat.open > 0 ? `${cat.open}/${cat.total}` : `0/${cat.total} ✓`}
                  {cat.open > 0 && ` (${cat.openPercentage}%)`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No category data available</p>
        )}
      </div>
    </div>
  );
};

export default ProductAnalysis;