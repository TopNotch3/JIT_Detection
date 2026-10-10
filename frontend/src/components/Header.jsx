import React from 'react';
import { ShieldCheck, GitBranch, Terminal, FlaskConical, BarChart3, Activity } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, repositories, selectedRepo, setSelectedRepo, systemStatus }) {
  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">JIT-DP Radar</span>
                <span className="badge badge-info text-[10px] py-0.5 px-2">v0.2.0</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Structurally-Aware • Counterfactual-Robust
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {systemStatus?.status || 'Online'}
            </span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-muted)] font-mono">
              Temp: <strong className="text-cyan-400 font-semibold">{systemStatus?.calibrated_temperature ?? 1.38}τ</strong>
            </span>
          </div>
        </div>

        {/* Repository selector & Navigation tabs */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {repositories.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] px-2.5 py-1.5 rounded-md border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedRepo?.id || ''}
                onChange={(e) => {
                  const r = repositories.find((x) => x.id === parseInt(e.target.value));
                  if (r) setSelectedRepo(r);
                }}
                className="bg-transparent text-white text-xs outline-none cursor-pointer pr-2"
              >
                {repositories.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[var(--bg-surface)]">
                    {r.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <nav className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-subtle)]">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'commits', label: 'Commit Drill-down', icon: GitBranch },
              { id: 'live', label: 'Live Predictor', icon: Terminal },
              { id: 'lab', label: 'Counterfactual Lab', icon: FlaskConical },
              { id: 'research', label: 'Research & Ablations', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
