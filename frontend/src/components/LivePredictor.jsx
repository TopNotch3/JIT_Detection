import React, { useState } from 'react';
import { Terminal, Send, CheckCircle2, Flame, AlertTriangle, Network, Layers, Sparkles } from 'lucide-react';
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
  const isMed = result?.risk_category === 'medium';
  const badgeClass = isHigh ? 'badge-high' : isMed ? 'badge-medium' : 'badge-low';

  return (
    <div className="space-y-6">
      {/* Top Banner & Preset Selector */}
      <div className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Live Webhook & Commit Diff Predictor
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Parses AST in real-time, builds diff graph, and executes calibrated GAT inference.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">Presets:</span>
          {SAMPLE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDiffText(p.diff);
                setMessage(p.message);
                setResult(null);
              }}
              className="btn btn-secondary text-[11px] py-1 px-2.5"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Unified Diff Editor */}
        <div className="lg:col-span-7 glass-panel p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">Commit Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. fix: sanitize user inputs"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-cyan-400 rounded-md px-3 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">Unified Git Diff</label>
            <textarea
              rows={14}
              value={diffText}
              onChange={(e) => setDiffText(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] focus:border-cyan-400 rounded-md p-3 text-xs font-mono text-[var(--text-secondary)] outline-none leading-relaxed"
              placeholder="diff --git a/... b/..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              tree-sitter multi-language parser ready
            </span>
            <button
              onClick={handlePredict}
              disabled={loading}
              className="btn btn-primary text-xs flex items-center gap-2 px-5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Evaluating Graph...' : 'Predict Defect Risk'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded text-xs font-mono">
              {error}
            </div>
          )}
        </div>

        {/* Right: Real-time Prediction Output */}
        <div className="lg:col-span-5 glass-panel p-5 flex flex-col justify-between">
          {result ? (
            <div className="space-y-5">
              <div className="border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Prediction Output
                  </span>
                  <span className={`badge ${badgeClass} text-[10px]`}>
                    {result.risk_category} Risk
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-4xl font-extrabold font-mono text-white">
                    {(result.calibrated_confidence * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-cyan-400 font-mono">
                    Calibrated (τ = 1.38)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono mt-2">
                  <span>Raw Model Score: {(result.raw_score * 100).toFixed(1)}%</span>
                  <span>•</span>
                  <span>Files: {result.files_changed}</span>
                </div>
              </div>

              {/* AST Graph Summary */}
              <div className="bg-[var(--bg-surface)] p-3.5 rounded-lg border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span>AST Diff Graph Generated</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[var(--text-secondary)]">
                  <div>Nodes: <strong className="text-white">{result.graph_summary.nodes}</strong></div>
                  <div>Edges: <strong className="text-white">{result.graph_summary.edges}</strong></div>
                </div>
              </div>

              {/* Top Attention Code Regions */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Attention Evidence</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(result.explanation || []).map((exp, i) => (
                    <div key={i} className="p-2.5 bg-[var(--bg-surface)] rounded border border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-cyan-300 font-medium truncate max-w-[180px]">
                          {exp.file_path}
                        </span>
                        <span className="badge badge-info text-[9px] font-mono">
                          {(exp.evidence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Lines {exp.start_line}-{exp.end_line} ({exp.node_type})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-[var(--text-muted)]">
              <Layers className="w-10 h-10 stroke-[1.5] text-[var(--border-subtle)]" />
              <p className="text-xs">
                Paste or choose a patch preset and click <strong>Predict Defect Risk</strong> to run real-time AST parsing and GAT inference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
