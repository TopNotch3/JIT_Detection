import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RepoOverview from './components/RepoOverview';
import CommitDetail from './components/CommitDetail';
import LivePredictor from './components/LivePredictor';
import CounterfactualLab from './components/CounterfactualLab';
import ResearchBenchmarks from './components/ResearchBenchmarks';
import { fetchHealth, fetchRepositories, fetchRepositoryRisk } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [selectedCommitSha, setSelectedCommitSha] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    async function init() {
      try {
        const health = await fetchHealth().catch(() => ({ status: 'booting', calibrated_temperature: 1.38 }));
        setSystemStatus(health);

        const repos = await fetchRepositories().catch(() => []);
        setRepositories(repos);
        if (repos.length > 0) {
          setSelectedRepo(repos[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Fetch repository risk profile when selected repo changes
  useEffect(() => {
    if (!selectedRepo) return;
    fetchRepositoryRisk(selectedRepo.id)
      .then((data) => setRiskData(data))
      .catch((err) => console.error(err));
  }, [selectedRepo]);

  const handleSelectCommit = (sha) => {
    setSelectedCommitSha(sha);
    setActiveTab('commits');
  };

  const handleCommitPredicted = (result) => {
    if (selectedRepo) {
      fetchRepositoryRisk(selectedRepo.id).then((data) => setRiskData(data));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        repositories={repositories}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
        systemStatus={systemStatus}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {loading ? (
          <div className="glass-panel p-16 text-center text-[var(--text-muted)] font-mono animate-pulse-subtle">
            Connecting to JIT-DP GNN pipeline & loading repository models...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <RepoOverview
                riskData={riskData}
                onSelectCommit={handleSelectCommit}
              />
            )}

            {activeTab === 'commits' && (
              <CommitDetail
                commitSha={selectedCommitSha || (riskData?.recent_commits?.[0]?.sha ?? '')}
                onBack={() => setActiveTab('overview')}
              />
            )}

            {activeTab === 'live' && (
              <LivePredictor onCommitPredicted={handleCommitPredicted} />
            )}

            {activeTab === 'lab' && <CounterfactualLab />}

            {activeTab === 'research' && <ResearchBenchmarks />}
          </>
        )}
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-4 px-6 text-center text-xs text-[var(--text-muted)] font-mono">
        Structurally-Aware, Counterfactual-Robust JIT-DP • PyTorch Geometric GATv2 • tree-sitter AST
      </footer>
    </div>
  );
}
