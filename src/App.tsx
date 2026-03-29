/**
 * Main Application Component
 * 
 * Cubelelo Support Insights Tool
 * Advanced AI-powered support ticket analysis using OpenRouter (Free)
 * 
 * Features:
 * - CSV file upload with drag-and-drop
 * - AI-powered ticket analysis
 * - Executive summary (30-second read)
 * - Top issue categories with severity levels
 * - Stuck tickets table with root cause analysis
 * - Key patterns and actionable recommendations
 * - Real-time loading and error states
 */

import { Download, Settings, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AnomaliesComponent from './components/AnomaliesComponent';
import CategoryCharts from './components/CategoryCharts';
import ExecutiveSummary from './components/ExecutiveSummary';
import FileUpload from './components/FileUpload';
import IssueCards from './components/IssueCards';
import KeyInsights from './components/KeyInsights';
import PlanOfAction from './components/PlanOfAction';
import ProductAnalysis from './components/ProductAnalysis';
import { ErrorAlert, LoadingSpinner, NoDataMessage } from './components/StateIndicators';
import StatsCards from './components/StatsCards';
import StuckTicketsTable from './components/StuckTicketsTable';
import { useCsvParser, useGeminiAnalysis } from './hooks';
import { SafeStorage } from './utils/safeStorage';

import './index.css';

type ModalTab = 'setup' | 'about' | 'data';

interface ApiKeyModalProps {
  isOpen: boolean;
  activeTab: ModalTab;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onSetApiKey: () => void;
  onClose: () => void;
  onTabChange: (tab: ModalTab) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  activeTab,
  apiKey,
  onApiKeyChange,
  onSetApiKey,
  onClose,
  onTabChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => onTabChange('setup')}
              className={`flex-1 px-4 py-3 font-semibold transition-colors ${
                activeTab === 'setup'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Setup API
            </button>
            <button
              onClick={() => onTabChange('data')}
              className={`flex-1 px-4 py-3 font-semibold transition-colors ${
                activeTab === 'data'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data
            </button>
            <button
              onClick={() => onTabChange('about')}
              className={`flex-1 px-4 py-3 font-semibold transition-colors ${
                activeTab === 'about'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'setup' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="sk-..."
                  className="input-field font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Get your API key from{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    OpenRouter
                  </a>
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={onSetApiKey}
                  disabled={!apiKey.trim()}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save API Key
                </button>
              </div>

              <button
                onClick={onClose}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          ) : activeTab === 'data' ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Data Management</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Your CSV data and analysis results are cached locally in your browser. Click below to clear all cached data.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  ⚠️ <strong>Warning:</strong> This will delete all cached tickets and analysis results. This action cannot be undone.
                </p>
              </div>

              <button
                onClick={() => {
                  SafeStorage.removeItem('_cache_tickets');
                  SafeStorage.removeItem('_cache_analysis');
                  window.location.reload();
                }}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Clear All Data
              </button>

              <button
                onClick={onClose}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">About This Tool</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Cubelelo Support Insights uses advanced AI to analyze your support tickets,
                  identify trends, and provide actionable recommendations for improving
                  support operations.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Features</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>✓ Executive summaries in 30 seconds</li>
                  <li>✓ Top issue categories analysis</li>
                  <li>✓ Stuck ticket identification</li>
                  <li>✓ Pattern recognition and insights</li>
                  <li>✓ AI-powered root cause analysis</li>
                  <li>✓ Automatic data caching across page refreshes</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Powered By</h4>
                <p className="text-sm text-slate-700">
                  OpenRouter (Free) • React 18 • Tailwind CSS
                </p>
              </div>

              <button
                onClick={onClose}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  // Initialize API key from environment variable (production) or localStorage (development)
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_OPENROUTER_API_KEY || SafeStorage.getItem('gemini-api-key') || ''
  );
  const [tempApiKey, setTempApiKey] = useState<string>(apiKey);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>('setup');

  const { analysis, status, error, analyzeTickets, setApiKey: setGeminiApiKey } =
    useGeminiAnalysis(apiKey);
  const { parsedData, parseError, isLoading: isParsingCsv, parseFile } = useCsvParser();

  // Persist parsed data to localStorage
  useEffect(() => {
    if (parsedData.length > 0) {
      SafeStorage.setJSON('_cache_tickets', parsedData);
    }
  }, [parsedData]);

  // Persist analysis results to localStorage
  useEffect(() => {
    if (analysis) {
      SafeStorage.setJSON('_cache_analysis', analysis);
    }
  }, [analysis]);

  // Initialize API key on mount or when it changes
  useEffect(() => {
    if (apiKey) {
      setGeminiApiKey(apiKey);
    }
  }, [apiKey, setGeminiApiKey]);

  const handleFileUpload = async (file: File) => {
    parseFile(file);
  };

  useEffect(() => {
    // After CSV is parsed, analyze with Gemini if API key is set
    if (parsedData.length > 0 && apiKey) {
      analyzeTickets(parsedData);
    } else if (parsedData.length > 0 && !apiKey) {
      setModalOpen(true);
    }
  }, [parsedData, apiKey, analyzeTickets]);

  const handleSetApiKey = () => {
    setApiKey(tempApiKey);
    SafeStorage.setItem('gemini-api-key', tempApiKey);
    setModalOpen(false);
    
    // Re-analyze if we have data
    if (parsedData.length > 0) {
      analyzeTickets(parsedData);
    }
  };

  const handleDownloadReport = () => {
    if (!analysis) return;

    const report = {
      generatedAt: new Date().toISOString(),
      totalTickets: parsedData.length,
      analysis,
    };

    const dataStr = JSON.stringify(report, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(dataStr)}`);
    element.setAttribute('download', `support-insights-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Cubelelo Support Insights</h1>
                <p className="text-sm text-slate-600">AI-Powered Support Ticket Analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {analysis && (
                <button
                  onClick={handleDownloadReport}
                  className="flex hidden items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium transition-colors"
                  title="Download analysis report"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              )}

              {parsedData.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure? This will clear all cached data.')) {
                      SafeStorage.removeItem('_cache_tickets');
                      SafeStorage.removeItem('_cache_analysis');
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
                  title="Clear all cached data"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}

              <button
                onClick={() => {
                  setModalTab('setup');
                  setModalOpen(true);
                }}
                className="flex hidden items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                title="Configure API settings"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          {apiKey && (
            <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg inline-block">
              ✓ OpenRouter API Connected
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload
            onFileSelect={handleFileUpload}
            isLoading={isParsingCsv}
            selectedFileName={parsedData.length > 0 ? `${parsedData.length} tickets loaded` : undefined}
          />
          
          {parseError && <ErrorAlert error={parseError} />}
        </div>

        {/* Analysis Status Messages */}
        {error && <ErrorAlert error={error.message} />}

        {/* Loading State */}
        {status === 'loading' && <LoadingSpinner />}

        {/* Results Display */}
        {status === 'success' && analysis ? (
          <div className="space-y-8">
            {/* Executive Summary */}
            <ExecutiveSummary summary={analysis.executiveSummary} />

            {/* Stats Cards - Key Metrics */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
              <StatsCards tickets={parsedData} />
            </div>

            {/* Anomalies Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Alerts & Anomalies</h2>
              <AnomaliesComponent tickets={parsedData} />
            </div>

            {/* Charts */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Category Analysis</h2>
              <CategoryCharts categories={analysis.topIssues} />
            </div>

            {/* Product & Category Open Rate */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Product & Category Breakdown</h2>
              <ProductAnalysis tickets={parsedData} />
            </div>

            {/* Issue Cards */}
            <div className="space-y-4">
              {/* <h2 className="text-2xl font-bold text-slate-900">Top Issue Categories</h2> */}
              <IssueCards issues={analysis.topIssues} />
            </div>

            {/* Stuck Tickets Table */}
            <StuckTicketsTable tickets={analysis.unresolvedTickets} />

            {/* Key Insights */}
            <KeyInsights patterns={analysis.keyPatterns} />

            {/* Plan of Action */}
            <PlanOfAction
              topIssues={analysis.topIssues}
              unresolvedTickets={analysis.unresolvedTickets}
              patterns={analysis.keyPatterns}
            />
          </div>
        ) : parsedData.length === 0 ? (
          <NoDataMessage />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Features</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>✓ AI-powered analysis</li>
                <li>✓ Pattern recognition</li>
                <li>✓ Anomaly detection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Tech Stack</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>React 18 + TypeScript</li>
                <li>OpenRouter API</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Performance</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>📊 Live analytics</li>
                <li>💾 Auto-cached results</li>
                <li>⚡ Real-time insights</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-6 pt-6">
            <p className="text-center text-xs text-slate-500">
              Support Insights Analytics Platform • Built for support teams
            </p>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={modalOpen}
        activeTab={modalTab}
        apiKey={tempApiKey}
        onApiKeyChange={setTempApiKey}
        onSetApiKey={handleSetApiKey}
        onClose={() => setModalOpen(false)}
        onTabChange={setModalTab}
      />
    </div>
  );
}

export default App;
