import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Flame, ShieldAlert, ArrowUpRight, Filter, FileCode } from 'lucide-react';

export default function RepoOverview({ riskData, onSelectCommit }) {
  const [filter, setFilter] = useState('all');

  if (!riskData) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
        Loading repository risk profile...
      </div>
    );
  }

  const filteredCommits = (riskData.recent_commits || []).filter((c) => {
    if (filter === 'all') return true;
    return c.risk_category === filter;
  });

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Calibrated Risk */}
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium mb-1">
            <span>Average Calibrated Risk</span>
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white mt-2">
            {(riskData.average_calibrated_risk * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            Calibrated via temperature scaling (τ = 1.38)
          </p>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* High Risk Commits */}
        <div className="glass-panel p-5 relative overflow-hidden border-rose-500/20">
          <div className="flex items-center justify-between text-xs text-rose-400 font-medium mb-1">
            <span>High Defect Risk</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-rose-300 mt-2">
            {riskData.high_risk_commits}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {(((riskData.high_risk_commits) / Math.max(1, riskData.total_commits)) * 100).toFixed(0)}% of monitored changes
          </p>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Medium Risk Commits */}
        <div className="glass-panel p-5 relative overflow-hidden border-amber-500/20">
          <div className="flex items-center justify-between text-xs text-amber-400 font-medium mb-1">
            <span>Medium Defect Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-300 mt-2">
            {riskData.medium_risk_commits}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            Requires targeted code review
          </p>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Low Risk / Clean Commits */}
        <div className="glass-panel p-5 relative overflow-hidden border-emerald-500/20">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-medium mb-1">
            <span>Low Risk / Clean</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-300 mt-2">
            {riskData.low_risk_commits}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            Safe for expedited CI integration
          </p>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Grid: File Risk Heatmap & Commit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Risk Heatmap */}
        <div className="lg:col-span-5 glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-sm text-white">File Risk Heatmap</h3>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {riskData.file_risk_distribution?.length || 0} files
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {riskData.file_risk_distribution?.map((f, i) => {
              const score = f.max_evidence_score || 0;
              let barColor = 'bg-emerald-500';
              if (score >= 0.7) barColor = 'bg-rose-500';
              else if (score >= 0.4) barColor = 'bg-amber-500';

              return (
                <div key={i} className="p-3 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs text-white truncate max-w-[240px]" title={f.file_path}>
                      {f.file_path}
                    </span>
                    <span className="font-mono text-xs font-semibold text-white">
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Progress Risk Bar */}
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(5, score * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                    <span>{f.incident_count} modified AST hunk{f.incident_count > 1 ? 's' : ''}</span>
                    <div className="flex items-center gap-1">
                      {f.commits?.slice(0, 3).map((sha, idx) => (
                        <span key={idx} className="font-mono bg-white/5 px-1 py-0.5 rounded text-[10px] text-[var(--text-secondary)]">
                          {sha}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Commit Stream */}
        <div className="lg:col-span-7 glass-panel p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h3 className="font-semibold text-sm text-white">Recent Commit Stream</h3>
              <p className="text-xs text-[var(--text-muted)]">Live predictions & AST attention evidence</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-md border border-[var(--border-subtle)] text-xs">
              {['all', 'high', 'medium', 'low'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-all ${
                    filter === cat ? 'bg-blue-600 text-white font-medium' : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredCommits.map((c) => {
              const risk = c.calibrated_score ?? 0;
              let badgeClass = 'badge-low';
              if (c.risk_category === 'high') badgeClass = 'badge-high';
              else if (c.risk_category === 'medium') badgeClass = 'badge-medium';

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCommit(c.sha)}
                  className="p-3.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] rounded-lg border border-[var(--border-subtle)] hover:border-blue-500/30 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                        {c.sha.slice(0, 8)}
                      </span>
                      <span className={`badge ${badgeClass} text-[10px]`}>
                        {c.risk_category}
                      </span>
                      {c.ground_truth_label !== null && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[var(--text-muted)]">
                          Truth: {c.ground_truth_label === 1 ? 'Defect' : 'Clean'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white font-medium truncate" title={c.message}>
                      {c.message}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] font-mono">
                      <span>{c.author}</span>
                      <span>•</span>
                      <span className="text-emerald-400">+{c.additions}</span>
                      <span className="text-rose-400">-{c.deletions}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-white">
                        {(risk * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">Calibrated</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
