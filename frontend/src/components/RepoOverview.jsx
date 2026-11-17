import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  ShieldAlert,
  ArrowUpRight,
  FileCode,
  Layers,
  Cpu,
  Sliders,
  GitCommit,
} from 'lucide-react';

export default function RepoOverview({ riskData, onSelectCommit }) {
  const [filter, setFilter] = useState('all');

  if (!riskData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
        <span className="w-6 h-6 rounded-full border-2 border-zinc-600 border-t-blue-400 animate-spin mb-3"></span>
        <span className="text-sm font-medium">Loading repository risk profile…</span>
      </div>
    );
  }

  const allCommits = riskData.recent_commits || [];
  const highCount  = allCommits.filter((c) => c.risk_category === 'high').length;
  const medCount   = allCommits.filter((c) => c.risk_category === 'medium').length;
  const lowCount   = allCommits.filter((c) => c.risk_category === 'low').length;

  const filteredCommits = filter === 'all'
    ? allCommits
    : allCommits.filter((c) => c.risk_category === filter);

  return (
    <div className="space-y-8">
      {/* ── Top Metric KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Average Calibrated Risk */}
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800/90 p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-zinc-700/80 transition-all">
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-2xl"
            style={{ backgroundColor: '#3b82f6' }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Avg Calibrated Risk
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              {(riskData.average_calibrated_risk * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5 font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Temperature scaled (τ = 1.38)
            </p>
          </div>
        </div>

        {/* Metric 2: High Defect Risk */}
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800/90 p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-zinc-700/80 transition-all">
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-2xl"
            style={{ backgroundColor: '#f43f5e' }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              High Defect Risk
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              {riskData.high_risk_commits}
            </div>
            <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5 font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              {(((riskData.high_risk_commits) / Math.max(1, riskData.total_commits)) * 100).toFixed(0)}% of monitored commits
            </p>
          </div>
        </div>

        {/* Metric 3: Medium Defect Risk */}
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800/90 p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-zinc-700/80 transition-all">
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-2xl"
            style={{ backgroundColor: '#f59e0b' }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Medium Defect Risk
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              {riskData.medium_risk_commits}
            </div>
            <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5 font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Requires targeted inspection
            </p>
          </div>
        </div>

        {/* Metric 4: Low Risk / Clean */}
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800/90 p-6 relative overflow-hidden backdrop-blur-sm shadow-sm hover:border-zinc-700/80 transition-all">
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-2xl"
            style={{ backgroundColor: '#10b981' }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Low Risk / Clean
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              {riskData.low_risk_commits}
            </div>
            <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5 font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Eligible for expedited CI path
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

        {/* Left Column (5 cols): File Risk Heatmap */}
        <div className="lg:col-span-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/70 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">File Risk Heatmap</h3>
                <p className="text-xs text-zinc-500">AST evidence concentration</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
              {riskData.file_risk_distribution?.length || 0} files
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {riskData.file_risk_distribution?.map((f, i) => {
              const score = f.max_evidence_score || 0;
              const pathParts = f.file_path.split('/');
              const fileName  = pathParts.pop();
              const dirPath   = pathParts.join('/');

              return (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-zinc-950/60 hover:bg-zinc-850/50 border border-zinc-800/80 hover:border-zinc-700/70 transition-all duration-150 relative overflow-hidden group space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs truncate max-w-[280px]" title={f.file_path}>
                      {dirPath && <span className="text-zinc-500 font-normal">{dirPath}/</span>}
                      <span className="text-zinc-200 font-medium group-hover:text-blue-300 transition-colors">{fileName}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700/70 shrink-0 tabular-nums">
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
                    <span className="text-zinc-500 text-[11px]">
                      {f.incident_count} {f.incident_count === 1 ? 'modified AST hunk' : 'modified AST hunks'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {f.commits?.slice(0, 3).map((sha, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectCommit(sha)}
                          className="font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-2 py-0.5 rounded text-[11px] border border-zinc-700/50 transition-colors cursor-pointer"
                        >
                          {sha}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-800/60">
                    <div
                      className="h-full bg-blue-500/50 group-hover:bg-blue-400 transition-all duration-300"
                      style={{ width: `${Math.max(6, score * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Recent Commit Stream */}
        <div className="lg:col-span-7 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/70 mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-zinc-400" />
                Recent Commit Stream
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Live predictions &amp; AST attention evidence
              </p>
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800/90 text-xs self-start sm:self-auto">
              {[
                { id: 'all',    label: 'All',    count: allCommits.length },
                { id: 'high',   label: 'High',   count: highCount },
                { id: 'medium', label: 'Medium', count: medCount  },
                { id: 'low',    label: 'Low',    count: lowCount  },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    filter === tab.id
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {tab.label} <span className="text-[11px] text-zinc-500 ml-0.5">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Commit Rows */}
          <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredCommits.map((c) => {
              const risk = c.calibrated_score ?? 0;
              const isHigh = c.risk_category === 'high';
              const isMed  = c.risk_category === 'medium';

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCommit(c.sha)}
                  className="p-4 sm:p-5 rounded-xl bg-zinc-950/60 hover:bg-zinc-850/50 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-150 cursor-pointer flex items-center justify-between gap-5 group"
                >
                  {/* Left: Commit Information */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded font-medium border border-zinc-700/60">
                        {c.sha.slice(0, 8)}
                      </span>

                      {/* Risk Category Pill */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                          isHigh
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : isMed
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {c.risk_category} Risk
                      </span>

                      {/* Ground Truth Pill */}
                      {c.ground_truth_label !== null && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-normal bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.ground_truth_label === 1 ? 'bg-rose-400' : 'bg-emerald-400'
                            }`}
                          />
                          <span>Truth: {c.ground_truth_label === 1 ? 'Defect' : 'Clean'}</span>
                        </span>
                      )}
                    </div>

                    {/* Commit Message */}
                    <p className="text-sm text-zinc-100 font-medium leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {c.message}
                    </p>

                    {/* Author & Diff Stats */}
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span>{c.author}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="font-mono text-emerald-400/90 font-medium">+{c.additions}</span>
                      <span className="font-mono text-rose-400/90 font-medium">-{c.deletions}</span>
                    </div>
                  </div>

                  {/* Right: Score & Arrow */}
                  <div className="shrink-0 flex items-center gap-3.5 text-right">
                    <div>
                      <div className="text-base sm:text-lg font-bold text-white tabular-nums">
                        {(risk * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium">Calibrated</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/80 group-hover:bg-blue-600/20 border border-zinc-700/60 group-hover:border-blue-500/40 flex items-center justify-center transition-all">
                      <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Architecture & Pipeline Status Footer ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/70 p-5 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">AST Graph Ingestion</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              tree-sitter extracts pre/post syntax trees. Bipartite edges link modified hunks to syntactic contexts.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/70 p-5 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">GATv2 Neural Prediction</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Multi-head attention scores code regions dynamically while contrastive counterfactual regularizers block shortcut tokens.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/70 p-5 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">Temperature Scaling Calibration</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Platt scaling calibrates probabilities to real-world empirical defect rates (ECE: 0.068, τ = 1.38).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
