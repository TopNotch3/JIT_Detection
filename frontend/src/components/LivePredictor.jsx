import React, { useState } from 'react';
import {
  Terminal,
  Send,
  Network,
  Layers,
  Sparkles,
} from 'lucide-react';
import { predictCommit } from '../services/api';

const SAMPLE_PRESETS = [
  {
    name: 'Critical Auth Token Bypass',
    message: 'fix: bypass validation if token is present without signature check',
    diff: `diff --git a/auth/guard.py b/auth/guard.py
--- a/auth/guard.py
+++ b/auth/guard.py
@@ -14,5 +14,3 @@ def verify_signature(token, key):
-    if not crypto.validate(token, key):
-        raise SecurityException("Invalid token signature")
+    if token is not None:
+        return True
     return True
`
  },
  {
    name: 'Loop Bounds Removal / Memory Fault',
    message: 'perf: remove bounds check inside high-throughput packet parser',
    diff: `diff --git a/network/parser.py b/network/parser.py
--- a/network/parser.py
+++ b/network/parser.py
@@ -25,5 +25,3 @@ def parse_frames(buffer, count):
     for i in range(count):
-        if i >= len(buffer):
-            break
         frames.append(buffer[i])
     return frames
`
  },
  {
    name: 'Safe Idempotency Check & Logging',
    message: 'feat: add idempotency guard to billing webhook and structured audit log',
    diff: `diff --git a/billing/guard.py b/billing/guard.py
--- a/billing/guard.py
+++ b/billing/guard.py
@@ -10,3 +10,6 @@ def process_payment(tx_id, payload):
+    if cache.has(tx_id):
+        logger.info("Skipping processed transaction", extra={"tx": tx_id})
+        return {"status": "already_processed"}
     return execute_payment(payload)
`
  }
];

export default function LivePredictor({ onCommitPredicted }) {
  const [diffText, setDiffText] = useState(SAMPLE_PRESETS[0].diff);
  const [message, setMessage] = useState(SAMPLE_PRESETS[0].message);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!diffText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await predictCommit(diffText, message, 'interactive_patch');
      setResult(res);
      if (onCommitPredicted) onCommitPredicted(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isHigh = result?.risk_category === 'high';
  const isMed  = result?.risk_category === 'medium';

  return (
    <div className="space-y-8">
      {/* Top Banner & Preset Selector */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-zinc-400" />
            Live Webhook &amp; Commit Diff Predictor
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Parses AST in real-time, builds diff graph, and executes calibrated GAT inference.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium mr-1">Presets:</span>
          {SAMPLE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDiffText(p.diff);
                setMessage(p.message);
                setResult(null);
              }}
              className="bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs py-1.5 px-3 rounded-lg border border-zinc-700/60 transition-all cursor-pointer font-medium"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left: Input Unified Diff Editor */}
        <div className="lg:col-span-7 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Commit Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. fix: sanitize user inputs"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Unified Git Diff</label>
            <textarea
              rows={14}
              value={diffText}
              onChange={(e) => setDiffText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500/50 rounded-xl p-4 text-xs font-mono text-zinc-200 outline-none leading-relaxed transition-colors resize-y"
              placeholder="diff --git a/... b/..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-zinc-500">
              tree-sitter multi-language parser ready
            </span>
            <button
              onClick={handlePredict}
              disabled={loading}
              className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-60 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Evaluating Graph…' : 'Predict Defect Risk'}</span>
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Right: Real-time Prediction Output */}
        <div className="lg:col-span-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-6 sm:p-7 flex flex-col justify-between shadow-sm min-h-[460px]">
          {result ? (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                    Prediction Output
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                      isHigh
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : isMed
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {result.risk_category} Risk
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-4xl font-extrabold text-white tabular-nums tracking-tight">
                    {(result.calibrated_confidence * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-zinc-400">
                    Calibrated (τ = 1.38)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-2">
                  <span>Raw Logit: {(result.raw_score * 100).toFixed(1)}%</span>
                  <span>•</span>
                  <span>Files: {result.files_changed}</span>
                </div>
              </div>

              {/* AST Graph Summary */}
              <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Network className="w-4 h-4 text-blue-400" />
                  <span>AST Diff Graph Generated</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400">
                  <div>Nodes: <strong className="text-white font-mono">{result.graph_summary.nodes}</strong></div>
                  <div>Edges: <strong className="text-white font-mono">{result.graph_summary.edges}</strong></div>
                </div>
              </div>

              {/* Top Attention Code Regions */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Attention Evidence</span>
                </div>

                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {(result.explanation || []).map((exp, i) => (
                    <div key={i} className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <code className="font-mono text-zinc-200 font-medium truncate max-w-[200px]">
                          {exp.file_path}
                        </code>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/60 tabular-nums">
                          {(exp.evidence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        Lines {exp.start_line}–{exp.end_line} ({exp.node_type})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-zinc-500 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Layers className="w-7 h-7 text-zinc-600 stroke-[1.5]" />
              </div>
              <p className="text-xs leading-relaxed max-w-xs">
                Paste or select a patch preset and click <strong className="text-zinc-300">Predict Defect Risk</strong> to run real-time AST parsing and GAT inference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
