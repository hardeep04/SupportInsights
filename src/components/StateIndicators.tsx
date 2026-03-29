/**
 * Loading and Error Components
 */

import { AlertCircle, X } from 'lucide-react';
import React from 'react';
import { AnalysisError } from '../types';

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Analyzing your support tickets...',
}) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-slate-900 font-semibold">{message}</p>
        <p className="text-slate-500 text-sm mt-2">This usually takes 10-30 seconds...</p>
      </div>
    </div>
  );
};

interface ErrorAlertProps {
  error: AnalysisError | string;
  onDismiss?: () => void;
  isAlert?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onDismiss,
  isAlert = false,
}) => {
  const errorMessage =
    typeof error === 'string'
      ? error
      : `${error.message} (${error.code})`;

  const containerClass = isAlert
    ? 'fixed top-4 right-4 max-w-md z-50'
    : 'mt-4 w-full';

  return (
    <div
      className={`${containerClass} bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg shadow-lg`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-900">Error Analysis</h3>
          <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const NoDataMessage: React.FC = () => (
  <div className="card text-center py-16">
    <div className="mb-4 flex justify-center">
      <div className="p-4 bg-slate-100 rounded-full">
        <AlertCircle className="w-8 h-8 text-slate-400" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Data Available</h3>
    <p className="text-slate-600">
      Upload a CSV file with your support tickets to get started with AI-powered analysis.
    </p>
  </div>
);

export default { LoadingSpinner, ErrorAlert, NoDataMessage };
