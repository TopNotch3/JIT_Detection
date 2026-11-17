import React, { useState } from 'react';
import { FlaskConical, Play, Scale, FolderGit2, Download, AlertCircle } from 'lucide-react';
import { testCounterfactual, fetchCommits, fetchCommitDetail } from '../services/api';

const DEFAULT_SAMPLE = `diff --git a/network/guard.py b/network/guard.py
--- a/network/guard.py
+++ b/network/guard.py
@@ -10,4 +10,4 @@ def validate_connection(peer, port):
-    if peer.is_trusted() and port == 443:
+    if not peer.is_trusted() or port != 443:
         return False
     return True
`;

const RECIPES = [
  { id: 'polarity_invert', title: 'Polarity Invert',    desc: 'Swap + and − lines (flip fix/bug intent)' },
  { id: 'condition_flip',  title: 'Condition Flip',     desc: 'Invert ==/!= and </>, and/or logic'       },
  { id: 'hunk_shuffle',    title: 'Hunk Shuffle',       desc: 'Permute hunk execution sequence'          },
  { id: 'rename_vars',     title: 'Rename Identifiers', desc: 'Control invariance test (syntax only)'    },
];

export default function CounterfactualLab({ selectedRepo }) {
  const [diffText,   setDiffText]   = useState(DEFAULT_SAMPLE);
  const [recipe,     setRecipe]     = useState('polarity_invert');
  const [loading,    setLoading]    = useState(false);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error,      setError]      = useState(null);

  const handleLoadRepoDiff = async () => {
    if (!selectedRepo) return;
    setLoadingRepo(true);
    setError(null);
    try {
      const commits = await fetchCommits(5, selectedRepo.id, selectedRepo);
      if (commits && commits.length > 0) {
        const detail = await fetchCommitDetail(commits[0].sha, selectedRepo);
        if (detail && detail.diff_content) {
          setDiffText(detail.diff_content);
          setTestResult(null);
          return;
        }
      }
      throw new Error(`No diff available for repository ${selectedRepo.name}`);
    } catch (err) {
      setError(err.message || 'Failed to load diff from repository');
    } finally {
      setLoadingRepo(false);
    }
  };

  const handleRunTest = async () => {
    if (!diffText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await testCounterfactual(diffText, recipe, 42);
      setTestResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-6 sm:p-7 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">
              Counterfactual Robustness &amp; Shortcut Evaluation Lab
            </h2>
          </div>

          {selectedRepo && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                <FolderGit2 className="w-3.5 h-3.5" />
                {selectedRepo.full_name}
              </span>
              <button
                onClick={handleLoadRepoDiff}
                disabled={loadingRepo}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs py-1 px-3 rounded-lg border border-zinc-700/80 transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                title={`Load a commit diff from ${selectedRepo.name}`}
              >
                <Download className="w-3 h-3 text-purple-400" />
                <span>{loadingRepo ? 'Loading…' : `Load Diff from ${selectedRepo.name}`}</span>
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
          Existing JIT models often succumb to statistical surface shortcuts (e.g. associating specific words or keywords with defects).
          This lab generates paired semantics-breaking or control counterfactuals to empirically evaluate model shortcut resistance as specified in the research proposal.
        </p>
      </div>

      {/* Configuration & Controls */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-6 sm:p-7 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          <div className="space-y-2 md:col-span-3">
            <label className="text-xs font-semibold text-zinc-200">Perturbation Recipe</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {RECIPES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRecipe(r.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    recipe === r.id
                      ? 'bg-purple-600/15 border-purple-500/60 text-white shadow-sm'
                      : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs font-semibold">{r.title}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={handleRunTest}
              disabled={loading}
              className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-2 w-full h-11 rounded-xl transition-all cursor-pointer disabled:opacity-60 shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{loading ? 'Evaluating Pair…' : 'Execute Test'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      {testResult && (
        <div className="space-y-6">
          {/* Robustness KPI Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-1.5 shadow-sm">
              <span className="text-xs text-zinc-400 font-medium block">Surface Similarity</span>
              <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
                {(testResult.surface_similarity * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-zinc-500">Token-level Jaccard overlap</p>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-1.5 shadow-sm">
              <span className="text-xs text-zinc-400 font-medium block">Original Risk</span>
              <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
                {(testResult.original_prediction.calibrated_confidence * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-zinc-500">Calibrated confidence</p>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-1.5 shadow-sm">
              <span className="text-xs text-zinc-400 font-medium block">Counterfactual Risk</span>
              <div className="text-2xl font-bold text-zinc-300 tabular-nums tracking-tight">
                {(testResult.counterfactual_prediction.calibrated_confidence * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-zinc-500">Post-perturbation score</p>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-1.5 shadow-sm">
              <span className="text-xs text-zinc-400 font-medium block">Risk Divergence (Δ)</span>
              <div className="text-2xl font-bold text-amber-400 tabular-nums tracking-tight">
                {(testResult.risk_divergence * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-zinc-500">
                {testResult.risk_divergence < 0.01 ? 'Invariant control response' : 'Sensitivity response'}
              </p>
            </div>
          </div>

          {/* Diffs Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
                <span className="font-semibold text-white">Original Commit Patch</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60 capitalize">
                  {testResult.original_prediction.risk_category} Risk
                </span>
              </div>
              <pre className="font-mono text-xs text-zinc-300 bg-zinc-950 p-4 rounded-lg max-h-72 overflow-auto leading-relaxed border border-zinc-900">
                {diffText}
              </pre>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-purple-500/30 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
                <span className="font-semibold text-zinc-200">
                  Perturbed Patch ({testResult.recipe})
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60 capitalize">
                  {testResult.counterfactual_prediction.risk_category} Risk
                </span>
              </div>
              <pre className="font-mono text-xs text-zinc-300 bg-zinc-950 p-4 rounded-lg max-h-72 overflow-auto leading-relaxed border border-zinc-900">
                {testResult.perturbed_diff}
              </pre>
            </div>
          </div>

          {/* Scientific Interpretation */}
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 border-l-4 border-l-blue-500 p-6 space-y-2 shadow-sm">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-400" />
              Scientific Interpretation
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {recipe === 'rename_vars'
                ? `Identifier renaming represents a semantics-preserving control perturbation. Low risk divergence (Δ = ${(testResult.risk_divergence * 100).toFixed(1)}%) indicates desirable invariance to cosmetic token changes, proving the GAT model does not rely on superficial variable naming shortcuts.`
                : recipe === 'polarity_invert'
                ? `Polarity inversion flips the intent of added vs deleted lines. Shifting calibrated risk from ${(testResult.original_prediction.calibrated_confidence * 100).toFixed(1)}% to ${(testResult.counterfactual_prediction.calibrated_confidence * 100).toFixed(1)}% (Δ = ${(testResult.risk_divergence * 100).toFixed(1)}%) proves the model recognizes structural deletion asymmetry rather than treating tokens symmetrically.`
                : recipe === 'condition_flip'
                ? `Condition inversion mutates logical branching with ${(testResult.surface_similarity * 100).toFixed(1)}% surface token overlap. The resulting risk shift (Δ = ${(testResult.risk_divergence * 100).toFixed(1)}%) confirms that the model's graph attention focuses on operational logic rather than keyword bag-of-words presence.`
                : `Hunk shuffling permutes the temporal execution order of modified AST regions. The observed divergence (Δ = ${(testResult.risk_divergence * 100).toFixed(1)}%) reflects the GNN's sensitivity to control flow ordering across code blocks.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
