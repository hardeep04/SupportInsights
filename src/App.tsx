import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Microscope, 
  AlertCircle, Rocket, Database,
  Zap, Trash2
} from 'lucide-react';

// Core Logic & Hooks
import { useCsvParser, useGeminiAnalysis } from './hooks';
import { SafeStorage } from './utils/safeStorage';

// UI Components
import FileUpload from './components/FileUpload';
import ExecutiveSummary from './components/ExecutiveSummary';
import StatsCards from './components/StatsCards';
import AnomaliesComponent from './components/AnomaliesComponent';
import CategoryCharts from './components/CategoryCharts';
import ProductAnalysis from './components/ProductAnalysis';
import IssueCards from './components/IssueCards';
import StuckTicketsTable from './components/StuckTicketsTable';
import KeyInsights from './components/KeyInsights';
import PlanOfAction from './components/PlanOfAction';
import { ErrorAlert, NoDataMessage } from './components/StateIndicators';

import './index.css';
import logo from '../media/logo.png';

// --- Types ---
type MainViewTab = 'dashboard' | 'analysis' | 'stuck' | 'action';

// --- Styled Sub-Components ---

const NavPill = ({ active, onClick, icon, label, activeClass }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-[1.25rem] text-sm font-medium transition-all duration-300 ${
      active 
        ? `${activeClass} text-white shadow-[0_8px_25px_rgba(56,189,248,0.45)]` 
        : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
    }`}
  >
    {React.cloneElement(icon, { size: 18 })}
    <span>{label}</span>
  </button>
);

export const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-bg ${className}`}>
    {children}
  </div>
);

// --- Main Application ---

function App() {
  // State Management
  const [apiKey] = useState<string>(
    import.meta.env.VITE_OPENROUTER_API_KEY || SafeStorage.getItem('gemini-api-key') || ''
  );
  const [activeView, setActiveView] = useState<MainViewTab>('dashboard');

  const { analysis, status, analyzeTickets, setApiKey: setGeminiApiKey } = useGeminiAnalysis(apiKey);
  const { parsedData, parseError, isLoading: isParsingCsv, parseFile } = useCsvParser();

  // Persistence Logic
  useEffect(() => {
    if (parsedData.length > 0) SafeStorage.setJSON('_cache_tickets', parsedData);
    if (analysis) SafeStorage.setJSON('_cache_analysis', analysis);
  }, [parsedData, analysis]);

  useEffect(() => {
    if (apiKey) setGeminiApiKey(apiKey);
  }, [apiKey, setGeminiApiKey]);

  // Auto-analysis Trigger
  useEffect(() => {
    if (parsedData.length > 0 && apiKey && !analysis) {
      analyzeTickets(parsedData);
    }
  }, [parsedData, apiKey, analysis, analyzeTickets]);

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-cyan-100 selection:text-cyan-700 relative">
      
      {/* Light Themed Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-8%] left-[-15%] w-[45%] h-[45%] rounded-full bg-sky-300/30 blur-[140px]" />
        <div className="absolute top-[30%] right-[-5%] w-[36%] h-[36%] rounded-full bg-indigo-300/25 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-violet-300/25 blur-[110px]" />
      </div>

      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200 px-6">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-200/50 bg-white flex items-center justify-center">
              <img
                src={logo}
                alt="Cubelelo Insights Logo"
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                CUBELELO <span className="text-cyan-600 uppercase">Insights</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">AI Powered Support Insights Tool</p>
              </div>
            </div>
          </div>

          

          <div className="flex items-center gap-3">
            {/* Data Indicator - Consistent with StatsCards */}
            {parsedData.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <Database size={14} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase text-slate-600">
                  {parsedData.length.toLocaleString()} Tickets
                </span>
              </div>
            )}

            {/* Clear Button - Unified Shape & Feedback */}
            {parsedData.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure? This will clear all cached data.')) {
                    SafeStorage.removeItem('_cache_tickets');
                    SafeStorage.removeItem('_cache_analysis');
                    window.location.reload();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-slate-200 border-rose-200 text-rose-600 rounded-xl shadow-sm transition-all active:scale-95 group"
                title="Clear all cached data"
              >
                <Trash2 size={14} className="" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Clear</span>
              </button>
            )}

            {/* Settings Button - Matches Clear Button Dimensions */}
            {/* <button 
              onClick={() => {}}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-slate-500 hover:text-blue-600 transition-all active:scale-90 group"
            >
              <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
            </button> */}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-12">
        
        {/* Upload Interaction Area */}
        <section className="max-w-3xl mx-auto w-full">
          <GlassCard className="p-1">
            <FileUpload 
              onFileSelect={parseFile} 
              isLoading={isParsingCsv} 
              selectedFileName={parsedData.length > 0 ? `Dataset Loaded Successfully` : undefined} 
            />
          </GlassCard>
          {parseError && <div className="mt-4"><ErrorAlert error={parseError} /></div>}
        </section>

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-[6px] border-blue-100" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-[6px] border-t-blue-600 animate-spin" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-bounce" size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Processing with AI</h3>
              <p className="text-slate-500 text-sm italic">Identifying patterns and stuck tickets...</p>
            </div>
          </div>
        )}

        {status === 'success' && analysis ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            
            {/* View Switcher Navigation */}
            <div className="flex justify-center sticky top-24 z-40">
              <nav className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xl p-2 rounded-[1.5rem] border border-white shadow-2xl shadow-blue-900/10">
                <NavPill 
                  active={activeView === 'dashboard'} 
                  onClick={() => setActiveView('dashboard')} 
                  icon={<LayoutDashboard />} 
                  label="Overview" 
                  activeClass="bg-blue-600 text-white" 
                />
                <NavPill 
                  active={activeView === 'analysis'} 
                  onClick={() => setActiveView('analysis')} 
                  icon={<Microscope />} 
                  label="Deep Dive" 
                  activeClass="bg-indigo-600 text-white" 
                />
                <NavPill 
                  active={activeView === 'stuck'} 
                  onClick={() => setActiveView('stuck')} 
                  icon={<AlertCircle />} 
                  label="Bottlenecks" 
                  activeClass="bg-amber-500 text-white" 
                />
                <NavPill 
                  active={activeView === 'action'} 
                  onClick={() => setActiveView('action')} 
                  icon={<Rocket />} 
                  label="Action Plan" 
                  activeClass="bg-emerald-600 text-white" 
                />
              </nav>
            </div>

            {/* Render Active View */}
            <div className="min-h-[60vh]">
              {activeView === 'dashboard' && (
                <div className="grid grid-cols-12 gap-6 animate-in zoom-in-95 duration-500">
                  
                  {/* Top Row: Executive Summary (Wide) */}
                  <div className="col-span-12 lg:col-span-8">
                    <ExecutiveSummary summary={analysis.executiveSummary} />
                  </div>

                  {/* Top Row: Quick Stats (Vertical Stack) */}
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    <StatsCards tickets={parsedData} isCompact={true} />
                  </div>

                  {/* Bottom Row: Anomalies (Large) */}
                  <div className="col-span-12">
                    <div className="h-full rounded-[2.5rem] bg-white/40 border border-white p-8 backdrop-blur-md">
                      <AnomaliesComponent tickets={parsedData} />
                    </div>
                  </div>

                  {/* Bottom Row: Small Insight Card */}
                  {/* <div className="col-span-12 lg:col-span-5">
                    <div className="h-full rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white shadow-xl">
                      <Sparkles className="mb-4 opacity-80" />
                      <h3 className="text-xl font-bold mb-2">AI Optimization Tip</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Your "Refund Delay" category is trending 24% higher than last week. 
                        Check the "Action Plan" tab for automated response templates.
                      </p>
                      <button className="mt-6 px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                        View Detailed Plan
                      </button>
                    </div>
                  </div> */}
<div className="col-span-12 ">
<KeyInsights patterns={analysis.keyPatterns} />
                   
                  </div>
                </div>
              )}

              {activeView === 'analysis' && (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="grid grid-cols-1 gap-8">
                    <GlassCard className="p-8"><CategoryCharts categories={analysis.topIssues} /></GlassCard>
                    <GlassCard className="p-8"><ProductAnalysis tickets={parsedData} /></GlassCard>
                  </div>
                  <IssueCards issues={analysis.topIssues} />
                </div>
              )}

              {activeView === 'stuck' && (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-0.5 rounded-[2rem] shadow-lg">
                    <div className="bg-amber-50 rounded-[1.95rem] p-6 flex items-start gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-600"><AlertCircle /></div>
                      <div>
                        <h4 className="font-bold text-amber-900 text-lg">Critical Attention Required</h4>
                        <p className="text-amber-800/80 text-sm">AI has identified tickets with circular reasoning, high sentiment decay, or excessive response delays.</p>
                      </div>
                    </div>
                  </div>
                  <GlassCard className="p-2"><StuckTicketsTable tickets={analysis.unresolvedTickets} /></GlassCard>
                </div>
              )}

              {activeView === 'action' && (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                  
                  <PlanOfAction 
                    topIssues={analysis.topIssues} 
                    unresolvedTickets={analysis.unresolvedTickets} 
                    patterns={analysis.keyPatterns} 
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          !isParsingCsv && <NoDataMessage />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white/50 py-12 px-6">
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

      {/* Reuse your existing ApiKeyModal logic here with updated styling if needed */}
    </div>
  );
}

export default App;