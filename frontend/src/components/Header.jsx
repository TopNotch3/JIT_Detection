import React, { useState } from 'react';
import {
  GitBranch,
  Terminal,
  FlaskConical,
  BarChart3,
  Activity,
  ChevronDown,
  FolderGit2,
} from 'lucide-react';
import RepoSelectorModal from './RepoSelectorModal';
import SagaLogo from './SagaLogo';

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
  onAddRepo,
  systemStatus,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* ── Top Bar: Brand, Health, Repo Selector ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4 border-b border-zinc-800/50">
            {/* Brand */}
            <div className="flex items-center gap-3.5 min-w-0">
              <SagaLogo className="w-11 h-11" iconSize="w-7 h-7" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                    SAGA-JIT
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 font-normal leading-normal line-clamp-1 max-w-xl">
                  Structurally-Aware Graph Attention and Counterfactual-Robust Training for Just-In-Time Defect Prediction
                </p>
              </div>
            </div>

            {/* Status Chips & Repo Selector */}
            <div className="flex items-center gap-3.5 flex-wrap">
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

              {/* Repository Switcher & Manager Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer group shadow-sm"
                title="Switch repository or inspect any public GitHub repository"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400 transition-colors shrink-0" />
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors truncate max-w-[170px] sm:max-w-[220px]">
                    {selectedRepo?.full_name || 'Select Repository'}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans px-1.5 py-0.2 rounded bg-zinc-800/90 border border-zinc-700/60">
                    {selectedRepo?.default_branch || 'main'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors ml-0.5" />
              </button>
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

      {/* Repository Selector Modal */}
      <RepoSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        repositories={repositories}
        selectedRepo={selectedRepo}
        onSelectRepo={setSelectedRepo}
        onAddRepo={onAddRepo}
      />
    </>
  );
}
