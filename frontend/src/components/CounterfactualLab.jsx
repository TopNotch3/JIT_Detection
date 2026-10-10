import React, { useState } from 'react';
import { FlaskConical, Play, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Scale } from 'lucide-react';
import { testCounterfactual } from '../services/api';

const DEFAULT_SAMPLE = `diff --git a/network/guard.py b/network/guard.py
--- a/network/guard.py
+++ b/network/guard.py
@@ -10,4 +10,4 @@ def validate_connection(peer, port):
-    if peer.is_trusted() and port == 443:
+    if not peer.is_trusted() or port != 443:
         return False
     return True
`;

export default function CounterfactualLab() {
  const [diffText, setDiffText] = useState(DEFAULT_SAMPLE);
  const [recipe, setRecipe] = useState('polarity_invert');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

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
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel p-5 space-y-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-white">
            Counterfactual Robustness & Shortcut Evaluation Lab
          </h2>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          Existing JIT models often succumb to statistical surface shortcuts (e.g. associating specific words with defects).
          This lab generates paired semantics-breaking or control counterfactuals to empirically evaluate model shortcut resistance as outlined in the research proposal.
        </p>
      </div>

      {/* Configuration & Controls */}
      <div className="glass-panel p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5 md:col-span-3">
            <label className="text-xs font-semibold text-white">Perturbation Recipe</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                { id: 'polarity_invert', title: 'Polarity Invert', desc: 'Swap + and - lines' },
                { id: 'condition_flip', title: 'Condition Flip', desc: 'Invert ==/!= and </>' },
                { id: 'hunk_shuffle', title: 'Hunk Shuffle', desc: 'Permute hunk sequence' },
                { id: 'rename_vars', title: 'Rename Identifiers', desc: 'Control invariance test' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRecipe(r.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    recipe === r.id
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-semibold">{r.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunTest}
              disabled={loading}
              className="btn btn-primary w-full text-xs flex items-center justify-center gap-2 h-10"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{loading ? 'Evaluating Pair...' : 'Execute Counterfactual Test'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded text-xs font-mono">
            {error}
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      {testResult && (
        <div className="space-y-6">
          {/* Robustness KPI Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4 space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] font-mono">Surface Similarity</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {(testResult.surface_similarity * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-[var(--text-secondary)]">Token-level Jaccard overlap</p>
            </div>

            <div className="glass-panel p-4 space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] font-mono">Original Risk</span>
              <div className="text-2xl font-bold font-mono text-white">
                {(testResult.original_prediction.calibrated_confidence * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">Calibrated confidence</p>
            </div>

            <div className="glass-panel p-4 space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] font-mono">Counterfactual Risk</span>
              <div className="text-2xl font-bold font-mono text-purple-300">
                {(testResult.counterfactual_prediction.calibrated_confidence * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">Post-perturbation score</p>
            </div>

            <div className="glass-panel p-4 space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] font-mono">Risk Divergence (Δ)</span>
              <div className="text-2xl font-bold font-mono text-amber-300">
                {(testResult.risk_divergence * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-[var(--text-secondary)]">Sensitivity response</p>
            </div>
          </div>

          {/* Diffs Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
                <span className="font-semibold text-white">Original Commit Patch</span>
                <span className="badge badge-info text-[10px] font-mono">
                  {testResult.original_prediction.risk_category} Risk
                </span>
              </div>
              <pre className="font-mono text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] p-3 rounded max-h-72 overflow-auto">
                {diffText}
              </pre>
            </div>

            <div className="glass-panel p-4 space-y-2 border-purple-500/20">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
                <span className="font-semibold text-purple-300">
                  Perturbed Patch ({testResult.recipe})
                </span>
                <span className="badge badge-purple text-[10px] font-mono">
                  {testResult.counterfactual_prediction.risk_category} Risk
                </span>
              </div>
              <pre className="font-mono text-xs text-purple-200 bg-[var(--bg-primary)] p-3 rounded max-h-72 overflow-auto">
                {testResult.perturbed_diff}
              </pre>
            </div>
          </div>

          {/* Scientific Interpretation */}
          <div className="glass-panel p-4 border-l-4 border-l-cyan-500 space-y-1">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              Scientific Interpretation
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {recipe === 'rename_vars'
                ? `Identifier renaming represents a semantics-preserving control perturbation. Low risk divergence (Δ = ${(testResult.risk_divergence * 100).toFixed(1)}%) indicates desirable invariance to cosmetic token changes.`
                : `Recipe '${recipe}' represents a semantics-breaking mutation while preserving ${(testResult.surface_similarity * 100).toFixed(1)}% surface similarity. Robust structural models shift their attention appropriately rather than collapsing into spurious token matches.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
