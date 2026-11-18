import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RepoOverview from './components/RepoOverview';
import CommitDetail from './components/CommitDetail';
import LivePredictor from './components/LivePredictor';
import CounterfactualLab from './components/CounterfactualLab';
import ResearchBenchmarks from './components/ResearchBenchmarks';
import ErrorBoundary from './components/ErrorBoundary';
import { fetchHealth, fetchRepositories, fetchRepositoryRisk } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [selectedCommitSha, setSelectedCommitSha] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const health = await fetchHealth().catch(() => ({
          status: 'booting',
          calibrated_temperature: 1.38,
        }));
        setSystemStatus(health);

        const repos = await fetchRepositories().catch(() => []);
        setRepositories(repos);
        if (repos.length > 0) setSelectedRepo(repos[0]);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!selectedRepo) return;
    setRiskData(null);
    fetchRepositoryRisk(selectedRepo.id, selectedRepo)
      .then((data) => setRiskData(data))
      .catch(() => setRiskData(null));
  }, [selectedRepo]);

  const handleTabChange = (tabId) => {
    if (tabId === 'commits') {
      setSelectedCommitSha(null);
    }
    setActiveTab(tabId);
  };

  const handleSelectCommit = (sha) => {
    setSelectedCommitSha(sha);
    setActiveTab('commits');
  };

  const handleAddRepo = (newRepo) => {
    setRepositories((prev) => {
      const exists = prev.some(
        (r) => r.full_name?.toLowerCase() === newRepo.full_name?.toLowerCase()
      );
      if (exists) return prev;
      const updated = [newRepo, ...prev];
      try {
        localStorage.setItem('jit_dp_monitored_repos', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setSelectedRepo(newRepo);
  };

  const handleCommitPredicted = () => {
    if (selectedRepo) {
      fetchRepositoryRisk(selectedRepo.id, selectedRepo).then((data) => setRiskData(data));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-blue-500/30 selection:text-blue-200">
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        repositories={repositories}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
        onAddRepo={handleAddRepo}
        systemStatus={systemStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-8 sm:py-10">
        {loading ? (
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-16 text-center shadow-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800/80 mb-4 border border-zinc-700/50">
              <span className="w-4 h-4 rounded-full bg-blue-400 animate-ping"></span>
            </div>
            <p className="text-sm font-medium text-zinc-300">
              Connecting to JIT-DP GNN pipeline &amp; loading repository models…
            </p>
            <p className="text-xs text-zinc-500 mt-1.5">
              PyTorch Geometric GATv2 · tree-sitter AST parser
            </p>
          </div>
        ) : (
          <ErrorBoundary key={activeTab}>
            {activeTab === 'overview' && (
              <RepoOverview riskData={riskData} onSelectCommit={handleSelectCommit} />
            )}
            {activeTab === 'commits' && (
              <CommitDetail
                commitSha={selectedCommitSha}
                onSelectCommit={(sha) => setSelectedCommitSha(sha)}
                onBack={() => setSelectedCommitSha(null)}
                selectedRepo={selectedRepo}
              />
            )}
            {activeTab === 'live' && (
              <LivePredictor
                onCommitPredicted={handleCommitPredicted}
                selectedRepo={selectedRepo}
              />
            )}
            {activeTab === 'lab' && <CounterfactualLab selectedRepo={selectedRepo} />}
            {activeTab === 'research' && <ResearchBenchmarks />}
          </ErrorBoundary>
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm py-6 px-6 sm:px-8 text-center text-xs text-zinc-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-zinc-300">SAGA-JIT</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">Structurally-Aware Graph Attention &amp; Counterfactual Robustness</span>
          </div>
          <div className="text-zinc-500">
            PyTorch Geometric GATv2 · tree-sitter AST Graph · Counterfactual Contrastive Regularization
          </div>
        </div>
      </footer>
    </div>
  );
}
