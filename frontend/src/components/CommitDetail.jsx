import React, { useState, useEffect } from 'react';
import { GitCommit, Sparkles, FileCode, CheckCircle2, Flame, Layers, ArrowLeft, Cpu } from 'lucide-react';
import { fetchCommitDetail } from '../services/api';

export default function CommitDetail({ commitSha, onBack }) {
  const [commit, setCommit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    if (!commitSha) return;
    setLoading(true);
    fetchCommitDetail(commitSha)
      .then((data) => {
        setCommit(data);
        if (data.code_regions && data.code_regions.length > 0) {
          setSelectedRegion(data.code_regions[0]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [commitSha]);

  if (loading) {
    return (
      <div className="glass-panel p-12 text-center text-[var(--text-muted)] font-mono animate-pulse-subtle">
        Loading commit AST and risk evidence for {commitSha}...
      </div>
    );
  }

  if (error || !commit) {
    return (
      <div className="glass-panel p-8 text-center space-y-3">
        <p className="text-rose-400 font-mono text-sm">{error || 'Commit not found'}</p>
        <button onClick={onBack} className="btn btn-secondary text-xs">
          Return to Overview
        </button>
      </div>
    );
  }

  const pred = commit.prediction || {};
  const isHigh = pred.risk_category === 'high';
  const isMed = pred.risk_category === 'medium';
  const badgeClass = isHigh ? 'badge-high' : isMed ? 'badge-medium' : 'badge-low';

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="btn btn-secondary text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Commits</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] font-mono">Model:</span>
          <span className="badge badge-purple text-[10px] font-mono">
            {pred.model_version || 'GATv2-CF'}
          </span>
        </div>
      </div>

      {/* Commit Header & Risk Meter Card */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[var(--border-subtle)] pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-semibold text-cyan-400">
                {commit.sha}
              </span>
              <span className={`badge ${badgeClass} text-[10px]`}>
                {pred.risk_category || 'low'}
              </span>
              {commit.ground_truth_label !== null && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--text-secondary)]">
                  Ground Truth: {commit.ground_truth_label === 1 ? 'Defect' : 'Clean'}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {commit.message}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] font-mono pt-1">
              <span>Author: <strong className="text-[var(--text-secondary)]">{commit.author}</strong></span>
              <span>•</span>
              <span>Files: {commit.files_changed}</span>
              <span>•</span>
              <span className="text-emerald-400">+{commit.additions}</span>
              <span className="text-rose-400">-{commit.deletions}</span>
            </div>
          </div>

          {/* Calibrated Confidence Box */}
          <div className="flex items-center gap-5 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)] self-start lg:self-auto">
            <div className="space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">
                Calibrated Defect Risk
              </span>
              <div className="text-3xl font-extrabold font-mono text-white">
                {((pred.calibrated_score ?? 0) * 100).toFixed(1)}%
              </div>
              <span className="text-[10px] text-cyan-400 font-mono block">
                Raw Logit: {pred.raw_score !== undefined ? (pred.raw_score * 100).toFixed(1) + '%' : 'N/A'}
              </span>
            </div>

            <div className="w-14 h-14 rounded-full border-4 border-[var(--border-subtle)] flex items-center justify-center relative">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  isHigh ? 'bg-rose-500/20 text-rose-400' : isMed ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {isHigh ? <Flame className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </div>

        {/* Explainability Code Evidence Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-sm text-white">
                AST Model Attention Evidence
              </h3>
            </div>
            <span className="text-xs text-[var(--text-muted)]">
              Ranked influential code regions
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Code Regions List */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {(commit.code_regions || []).map((region, idx) => {
                const isSelected = selectedRegion?.id === region.id;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedRegion(region)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500/50 shadow-sm'
                        : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-cyan-300 font-semibold truncate max-w-[200px]">
                        {region.file_path}
                      </span>
                      <span className="badge badge-info text-[10px] font-mono">
                        Weight: {(region.evidence_score * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-mono">
                      <span>Node: {region.node_type}</span>
                      <span>•</span>
                      <span>Lines {region.start_line}-{region.end_line}</span>
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)] italic">
                      {region.explanation_note}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Region Preview & Full Diff */}
            <div className="lg:col-span-7 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-subtle)] p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                  <span className="font-mono text-white flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    Unified Diff & Inspection
                  </span>
                  {selectedRegion && (
                    <span className="text-[11px] font-mono text-cyan-400">
                      Focus: L{selectedRegion.start_line}-L{selectedRegion.end_line}
                    </span>
                  )}
                </div>

                <pre className="font-mono text-xs overflow-x-auto text-[var(--text-secondary)] max-h-[340px] p-2 leading-relaxed">
                  {commit.diff_content}
                </pre>
              </div>

              {selectedRegion && (
                <div className="mt-4 p-2.5 bg-[var(--bg-surface)] rounded border border-white/5 text-xs text-[var(--text-secondary)]">
                  <strong className="text-white">Active Evidence Focus:</strong> Lines {selectedRegion.start_line}-{selectedRegion.end_line} ({selectedRegion.node_type}) with {(selectedRegion.evidence_score * 100).toFixed(0)}% attention concentration.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Counterfactual Variants Section */}
        {commit.counterfactuals && commit.counterfactuals.length > 0 && (
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white font-semibold">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Generated Counterfactual Pairs ({commit.counterfactuals.length})</span>
              </div>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Training & Robustness Verification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {commit.counterfactuals.map((cf, i) => (
                <div key={i} className="p-3 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-purple-300">
                      {cf.recipe}
                    </span>
                    <span className="badge badge-purple text-[9px]">
                      {cf.validation_status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">
                    Surface Similarity: {(cf.similarity_score * 100).toFixed(1)}%
                  </div>
                  <pre className="text-[10px] font-mono text-[var(--text-secondary)] bg-black/40 p-2 rounded max-h-24 overflow-y-auto">
                    {cf.generated_diff.slice(0, 200)}...
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
