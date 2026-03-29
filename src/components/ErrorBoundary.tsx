/**
 * React Error Boundary
 * Catches React rendering errors and displays user-friendly error message
 */

import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-red-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h2.586a1 1 0 00.707-.293l-2.414-2.414a1 1 0 00-.707-.293h-3.172a2 2 0 00-2 2v2m6 0a2 2 0 01-2 2H9a2 2 0 01-2-2m6 0a2 2 0 00-2-2H9a2 2 0 00-2 2" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Oops!</h1>
            <p className="text-slate-600 text-center mb-4">
              The application encountered an error and couldn't load properly.
            </p>
            
            {this.state.error && (
              <details className="mb-4 p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
                <summary className="font-semibold cursor-pointer mb-2">Error Details (click to expand)</summary>
                <code className="block break-words whitespace-pre-wrap">{this.state.error.toString()}</code>
              </details>
            )}

            <div className="space-y-3 text-sm text-slate-700 mb-4">
              <h3 className="font-semibold">Try these steps:</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Refresh the page (F5 or Ctrl+R)</li>
                <li>Clear browser cache and cookies</li>
                <li>Try a different browser</li>
                <li>Check that localStorage is enabled</li>
                <li>Try disabling browser extensions</li>
              </ul>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
