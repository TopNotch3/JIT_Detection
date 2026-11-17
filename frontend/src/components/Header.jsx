import React from 'react';
import {
  ShieldCheck,
  GitBranch,
  Terminal,
  FlaskConical,
  BarChart3,
  Activity,
  ChevronDown,
} from 'lucide-react';

const TABS = [
  { id: 'overview',  label: 'Overview',           icon: BarChart3    },
  { id: 'commits',   label: 'Commit Drill-down',   icon: GitBranch    },
  { id: 'live',      label: 'Live Predictor',       icon: Terminal     },
  { id: 'lab',       label: 'Counterfactual Lab',   icon: FlaskConical },
  { id: 'research',  label: 'Research & Ablations', icon: Activity     },
];

export default function Header({
  activeTab,
  setActiveTab,
  repositories,
  selectedRepo,
  setSelectedRepo,
  systemStatus,
}) {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* ── Top Bar: Brand, Health, Repo Selector ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4 border-b border-zinc-800/50">
          {/* Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm shadow-blue-500/5 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-white tracking-tight leading-tight">
                  JIT-Defect Radar
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                  v0.2.0
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-normal">
                Structurally-Aware · Counterfactual-Robust Defect Intelligence
              </p>
            </div>
          </div>

          {/* Status Chips & Repo Selector */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* System Status Indicator */}
            <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="font-medium text-zinc-200">
                  {systemStatus?.status === 'healthy' ? 'Operational' : systemStatus?.status || 'Online'}
                </span>
              </div>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400 font-normal">
                Calibration: <strong className="text-zinc-200 font-semibold">{systemStatus?.calibrated_temperature ?? 1.38}τ</strong>
              </span>
            </div>

            {/* Repository Selector */}
            {repositories.length > 0 && (
              <div className="relative">
                <div className="flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer">
                  <GitBranch className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <select
                    value={selectedRepo?.id || ''}
                    onChange={(e) => {
                      const r = repositories.find((x) => x.id === parseInt(e.target.value));
                      if (r) setSelectedRepo(r);
                    }}
                    className="bg-transparent text-zinc-200 text-xs font-medium outline-none cursor-pointer pr-5 appearance-none"
                  >
                    {repositories.map((r) => (
                      <option key={r.id} value={r.id} className="bg-zinc-900 text-zinc-200">
                        {r.full_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Navigation Bar: Segmented Tab Bar ── */}
        <div className="py-2.5 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-1.5 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/80 shadow-black/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
