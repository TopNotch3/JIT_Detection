import React, { useState } from 'react';
import {
  GitBranch,
  Search,
  Plus,
  Check,
  X,
  ExternalLink,
  FolderGit2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  parseGitHubRepoInput,
  fetchGitHubRepoMetadata,
} from '../services/githubService';

export default function RepoSelectorModal({
  isOpen,
  onClose,
  repositories,
  selectedRepo,
  onSelectRepo,
  onAddRepo,
}) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const handleAddCustomRepo = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const parsed = parseGitHubRepoInput(inputValue);
    if (!parsed) {
      setError('Please enter a valid format: "owner/repo" or "https://github.com/owner/repo"');
      return;
    }

    // Check if already in list
    const existing = repositories.find(
      (r) => r.full_name?.toLowerCase() === parsed.fullName.toLowerCase()
    );
    if (existing) {
      onSelectRepo(existing);
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const metadata = await fetchGitHubRepoMetadata(parsed.owner, parsed.name);
      onAddRepo(metadata);
      onSelectRepo(metadata);
      setInputValue('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to inspect GitHub repository');
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repositories.filter(
    (r) =>
      r.full_name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Select GitHub Repository</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Switch monitored repository or inspect any public GitHub repository.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Add Any GitHub Repo Input Form */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Inspect Any Public GitHub Repository</span>
            </label>

            <form onSubmit={handleAddCustomRepo} className="flex gap-2.5">
              <div className="relative flex-1">
                <FolderGit2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. pallets/flask, facebook/react, or https://github.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none font-mono transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Fetching…</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add &amp; Inspect</span>
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Suggestions Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-zinc-500">
              <span>Quick try:</span>
              {['pallets/flask', 'tiangolo/fastapi', 'psf/requests', 'facebook/react'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInputValue(suggestion)}
                  className="px-2 py-0.5 rounded-md bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-mono transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800/80"></div>

          {/* Monitored Repositories & Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300">
                Available Repositories ({repositories.length})
              </span>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter repositories…"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredRepos.map((repo) => {
                const isSelected = selectedRepo?.full_name === repo.full_name;

                return (
                  <div
                    key={repo.id || repo.full_name}
                    onClick={() => {
                      onSelectRepo(repo);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 group ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500/50 shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-white truncate group-hover:text-blue-400 transition-colors">
                          {repo.full_name}
                        </span>
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30">
                            <Check className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {repo.default_branch || 'main'}
                          </span>
                        )}
                      </div>

                      {repo.description && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                          {repo.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/60 pt-2.5">
                      <span className="flex items-center gap-1">
                        {repo.is_benchmark ? (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium text-[10px]">
                            Benchmark Dataset
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium text-[10px]">
                            Live GitHub
                          </span>
                        )}
                      </span>

                      <a
                        href={`https://github.com/${repo.full_name}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
