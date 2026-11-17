import React, { useState, useEffect } from 'react';
import {
  GitCommit,
  Sparkles,
  FileCode,
  CheckCircle2,
  Flame,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Cpu,
  Search,
  GitBranch,
  Network,
} from 'lucide-react';
import { fetchCommitDetail, fetchCommits } from '../services/api';
import AstGraphViewer from './AstGraphViewer';

export default function CommitDetail({ commitSha, onSelectCommit, onBack, selectedRepo }) {
  // Commit List View State (when !commitSha)
  const [commitsList, setCommitsList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  // Single Commit Detail State (when commitSha is provided)
  const [commit, setCommit] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeInspectTab, setActiveInspectTab] = useState('graph'); // default to 'graph' for visual understanding!

  // Fetch commits list if no commit is selected
  useEffect(() => {
    if (commitSha) return;
    setListLoading(true);
    fetchCommits(50, selectedRepo?.id, selectedRepo)
      .then((data) => setCommitsList(data || []))
      .catch((err) => setError(err.message || 'Failed to load commits'))
      .finally(() => setListLoading(false));
  }, [commitSha, selectedRepo]);

  // Fetch commit details if a commit is selected
  useEffect(() => {
    if (!commitSha) {
      setCommit(null);
      return;
    }
    setDetailLoading(true);
    setError(null);
    fetchCommitDetail(commitSha, selectedRepo)
      .then((data) => {
        setCommit(data);
        if (data.code_regions && data.code_regions.length > 0) {
          setSelectedRegion(data.code_regions[0]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setDetailLoading(false));
  }, [commitSha, selectedRepo]);

  // ─────────────────────────────────────────────────────────────────────────
  // VIEW 1: Commit List View (when no commit is selected)
  // ─────────────────────────────────────────────────────────────────────────
  if (!commitSha) {
    const filteredCommits = commitsList.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk = riskFilter === 'all' || c.risk_category === riskFilter;
      return matchesSearch && matchesRisk;
    });

    const highCount = commitsList.filter((c) => c.risk_category === 'high').length;
    const medCount  = commitsList.filter((c) => c.risk_category === 'medium').length;
    const lowCount  = commitsList.filter((c) => c.risk_category === 'low').length;

    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-6 sm:p-7 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <GitBranch className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-white">
                Commit Drill-down &amp; Evidence Inspection
              </h2>
            </div>
            {selectedRepo && (
              <span className="text-xs text-zinc-300 bg-zinc-800/80 px-3.5 py-1.5 rounded-full border border-zinc-700/60 font-mono self-start sm:self-auto">
                {selectedRepo.full_name}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
            Select any monitored commit to inspect its syntax graph representation, multi-head AST attention evidence, influential code regions, and counterfactual robustness checks.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by commit message, SHA, or author..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500/50 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none font-sans transition-colors placeholder:text-zinc-600"
              />
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs self-start sm:self-auto">
              {[
                { id: 'all',    label: 'All',    count: commitsList.length },
                { id: 'high',   label: 'High',   count: highCount },
                { id: 'medium', label: 'Medium', count: medCount  },
                { id: 'low',    label: 'Low',    count: lowCount  },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRiskFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    riskFilter === tab.id
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {tab.label} <span className="text-[11px] text-zinc-500 ml-0.5">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Commits List */}
        {listLoading ? (
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-16 text-center text-zinc-400">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-400 animate-ping mr-3 align-middle"></span>
            Loading repository commits…
          </div>
        ) : filteredCommits.length === 0 ? (
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-16 text-center text-zinc-500 space-y-2">
            <p className="text-sm font-medium text-zinc-400">No commits found</p>
            <p className="text-xs text-zinc-600">Try adjusting your search query or risk filter.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredCommits.map((c) => {
              const risk = c.calibrated_score ?? 0;
              const isHigh = c.risk_category === 'high';
              const isMed  = c.risk_category === 'medium';

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCommit(c.sha)}
                  className="p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-850/60 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-150 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 group shadow-sm"
                >
                  {/* Left: Commit Details */}
                  <div className="space-y-2.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-zinc-300 bg-zinc-800 px-2.5 py-0.5 rounded-md font-medium border border-zinc-700/60">
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
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {c.message}
                    </h3>

                    {/* Author & Stats */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span>{c.author}</span>
                      <span className="text-zinc-600">·</span>
                      <span>Files: <strong className="text-zinc-300 font-medium">{c.files_changed}</strong></span>
                      <span className="text-zinc-600">·</span>
                      <span className="font-mono text-emerald-400/90 font-medium">+{c.additions}</span>
                      <span className="font-mono text-rose-400/90 font-medium">-{c.deletions}</span>
                    </div>
                  </div>

                  {/* Right: Score and Action */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800/80">
                    <div className="text-left md:text-right">
                      <div className="text-lg font-bold text-white tabular-nums">
                        {(risk * 100).toFixed(1)}%
                      </div>
                      <div className="text-[11px] text-zinc-500 font-medium">Calibrated Defect Risk</div>
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-800/80 group-hover:bg-blue-600/20 text-zinc-300 group-hover:text-blue-300 px-3.5 py-2 rounded-xl border border-zinc-700/60 group-hover:border-blue-500/40 text-xs font-medium transition-all shrink-0">
                      <span>Inspect AST</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VIEW 2: Single Commit Detail & AST Inspection (when commitSha is provided)
  // ─────────────────────────────────────────────────────────────────────────
  if (detailLoading) {
    return (
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-16 text-center text-zinc-400 shadow-sm">
        <span className="inline-block w-3 h-3 rounded-full bg-blue-400 animate-ping mr-3 align-middle"></span>
        Loading commit AST and risk evidence for{' '}
        <code className="font-mono text-zinc-300 font-semibold">{commitSha}</code>…
      </div>
    );
  }

  if (error || !commit) {
    return (
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-10 text-center space-y-4">
        <p className="text-rose-400 text-sm font-medium">{error || 'Commit not found'}</p>
        <button
          onClick={onBack}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          Back to All Commits
        </button>
      </div>
    );
  }

  const pred   = commit.prediction || {};
  const isHigh = pred.risk_category === 'high';
  const isMed  = pred.risk_category === 'medium';
  const diffGraph = commit.diff_graph || { nodes: [], edges: [] };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Commits</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Inference Architecture:</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-blue-400 border border-blue-500/30">
            {pred.model_version || 'GATv2-CF'}
          </span>
        </div>
      </div>

      {/* Commit Header & Risk Meter Card */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/90 p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800/70">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <GitCommit className="w-4 h-4 text-zinc-400" />
              <code className="font-mono text-xs font-semibold text-zinc-200 bg-zinc-800/80 border border-zinc-700/60 px-2.5 py-0.5 rounded-md">
                {commit.sha}
              </code>

              {/* Risk category pill */}
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-medium capitalize border ${
                  isHigh
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : isMed
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {pred.risk_category || 'low'} Risk
              </span>

              {/* Ground truth pill */}
              {commit.ground_truth_label !== null && (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-normal bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      commit.ground_truth_label === 1 ? 'bg-rose-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span>Truth: {commit.ground_truth_label === 1 ? 'Defect' : 'Clean'}</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {commit.message}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
              <span>Author: <strong className="text-zinc-200 font-medium">{commit.author}</strong></span>
              <span className="text-zinc-600">·</span>
              <span>Files Changed: <strong className="text-zinc-200 font-medium">{commit.files_changed}</strong></span>
              <span className="text-zinc-600">·</span>
              <span className="font-mono text-emerald-400/90 font-medium">+{commit.additions}</span>
              <span className="font-mono text-rose-400/90 font-medium">-{commit.deletions}</span>
            </div>
          </div>

          {/* Calibrated Confidence Box */}
          <div className="flex items-center gap-5 bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800 self-start lg:self-auto shrink-0 shadow-inner">
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 font-medium block">
                Calibrated Defect Risk
              </span>
              <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
                {((pred.calibrated_score ?? 0) * 100).toFixed(1)}%
              </div>
              <span className="text-[11px] text-zinc-500 font-normal block">
                Raw Logit: {pred.raw_score !== undefined ? (pred.raw_score * 100).toFixed(1) + '%' : 'N/A'}
              </span>
            </div>

            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              {isHigh ? (
                <Flame className="w-6 h-6 text-rose-400" />
              ) : isMed ? (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              )}
            </div>
          </div>
        </div>

        {/* Explainability Code Evidence & AST Graph Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-sm text-white">
                AST Model Attention Evidence &amp; Graph Topology
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">
                {diffGraph.nodes.length} AST Nodes · {diffGraph.edges.length} Edges
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 cols): Code Regions List */}
            <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pb-1">
                Influential AST Regions (GAT Attention)
              </div>
              {(commit.code_regions || []).map((region, idx) => {
                const isSelected = selectedRegion?.id === region.id;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedRegion(region)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500/50 shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <code className="font-mono text-zinc-200 font-semibold truncate max-w-[220px]">
                        {region.file_path}
                      </code>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700/60 tabular-nums">
                        {(region.evidence_score * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <code className="font-mono text-zinc-400">Node: {region.node_type}</code>
                      <span className="text-zinc-600">•</span>
                      <code className="font-mono text-zinc-400">Lines {region.start_line}–{region.end_line}</code>
                    </div>

                    <p className="text-xs text-zinc-400 italic leading-relaxed">
                      {region.explanation_note}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Column (7 cols): Interactive AST Graph / Unified Diff Switcher */}
            <div className="lg:col-span-7 bg-zinc-950/70 rounded-2xl border border-zinc-800/90 p-5 space-y-4 shadow-sm">
              {/* Inspection View Header & Segmented Tabs */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-xs font-semibold text-white flex items-center gap-2">
                  {activeInspectTab === 'graph' ? (
                    <>
                      <Network className="w-4 h-4 text-blue-400" />
                      Interactive AST Graph Topology
                    </>
                  ) : (
                    <>
                      <FileCode className="w-4 h-4 text-zinc-400" />
                      Unified Git Diff Inspection
                    </>
                  )}
                </span>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
                  <button
                    onClick={() => setActiveInspectTab('graph')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeInspectTab === 'graph'
                        ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/60'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Network className="w-3.5 h-3.5 text-blue-400" />
                    <span>AST Graph</span>
                    {diffGraph.nodes.length > 0 && (
                      <span className="text-[10px] text-zinc-400 font-mono ml-0.5">
                        ({diffGraph.nodes.length})
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveInspectTab('diff')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeInspectTab === 'diff'
                        ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/60'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Unified Diff</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: AST Graph Visualizer */}
              {activeInspectTab === 'graph' && (
                <AstGraphViewer
                  graph={diffGraph}
                  selectedNodeId={selectedRegion?.ast_node_id}
                  onSelectNode={(node) => {
                    const matched = (commit.code_regions || []).find(
                      (r) =>
                        r.file_path === node.file_path &&
                        !((node.end_line < r.start_line) || (node.start_line > r.end_line))
                    );
                    if (matched) setSelectedRegion(matched);
                  }}
                />
              )}

              {/* Tab 2: Unified Diff Viewer */}
              {activeInspectTab === 'diff' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Patch Content:</span>
                    {selectedRegion && (
                      <code className="font-mono text-[11px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        Focus: L{selectedRegion.start_line}–L{selectedRegion.end_line}
                      </code>
                    )}
                  </div>

                  <pre className="font-mono text-xs overflow-x-auto text-zinc-300 max-h-[380px] p-3 leading-relaxed bg-zinc-950 rounded-xl border border-zinc-900">
                    {commit.diff_content}
                  </pre>

                  {selectedRegion && (
                    <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-xs text-zinc-400">
                      <strong className="text-white">Active Evidence Focus:</strong>{' '}
                      Lines {selectedRegion.start_line}–{selectedRegion.end_line} ({selectedRegion.node_type}) with{' '}
                      <span className="text-blue-400 font-semibold">{(selectedRegion.evidence_score * 100).toFixed(0)}%</span> attention concentration.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Counterfactual Variants Section */}
        {commit.counterfactuals && commit.counterfactuals.length > 0 && (
          <div className="pt-6 border-t border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Generated Counterfactual Pairs ({commit.counterfactuals.length})</span>
              </div>
              <span className="text-xs text-zinc-500">
                Training &amp; Robustness Verification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {commit.counterfactuals.map((cf, i) => (
                <div key={i} className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <code className="font-mono font-semibold text-zinc-200">
                      {cf.recipe}
                    </code>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                      {cf.validation_status}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    Surface Similarity: <span className="text-zinc-300 font-medium">{(cf.similarity_score * 100).toFixed(1)}%</span>
                  </div>
                  <pre className="font-mono text-[11px] text-zinc-400 bg-zinc-950 p-2.5 rounded-lg max-h-24 overflow-y-auto leading-relaxed border border-zinc-900">
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
