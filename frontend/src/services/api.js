import { DEMO_DATA } from './demoData.js';
import {
  predictCommitLocally,
  evaluateCounterfactualLocally,
} from './clientInference.js';
import {
  PRESET_REPOSITORIES,
  fetchGitHubRecentCommits,
  fetchGitHubCommitDetail,
  buildRepoRiskProfile,
} from './githubService.js';

// If VITE_API_BASE_URL is provided, use it (trim trailing slashes)
// Otherwise default to '/api' which Vite proxies to http://localhost:8000 in dev
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

function getEndpointUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}

/**
 * Helper to safely perform JSON fetch with content-type and status check.
 * Throws if the response is not valid JSON or status is 4xx/5xx.
 */
async function safeFetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Response is not valid JSON');
  }
  return await res.json();
}

export async function fetchHealth() {
  try {
    return await safeFetchJson(getEndpointUrl('/health'));
  } catch {
    return DEMO_DATA.health;
  }
}

export async function fetchRepositories() {
  try {
    const repos = await safeFetchJson(getEndpointUrl('/repositories'));
    if (Array.isArray(repos) && repos.length > 0) {
      // Merge backend repos with curated presets
      const existingNames = new Set(repos.map((r) => r.full_name));
      const extras = PRESET_REPOSITORIES.filter((p) => !existingNames.has(p.full_name));
      return [...repos, ...extras];
    }
    return PRESET_REPOSITORIES;
  } catch {
    // Read any user-custom added repos from localStorage
    try {
      const stored = localStorage.getItem('jit_dp_monitored_repos');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const names = new Set(parsed.map((p) => p.full_name));
          const unaddedPresets = PRESET_REPOSITORIES.filter((p) => !names.has(p.full_name));
          return [...parsed, ...unaddedPresets];
        }
      }
    } catch {
      // ignore localStorage errors
    }
    return PRESET_REPOSITORIES;
  }
}

export async function fetchRepositoryRisk(repoId, repoObj = null) {
  // If target repository is a real GitHub repository other than the default local benchmark
  if (repoObj && !repoObj.is_benchmark && repoObj.owner !== 'antigravity') {
    try {
      const commits = await fetchGitHubRecentCommits(repoObj.owner, repoObj.name, 10);
      return buildRepoRiskProfile(repoObj, commits);
    } catch {
      // Return simulated repo risk if offline
      return {
        repository_id: repoObj.id,
        name: repoObj.name,
        owner: repoObj.owner,
        default_branch: repoObj.default_branch || 'main',
        total_commits: 10,
        high_risk_commits: 1,
        medium_risk_commits: 7,
        low_risk_commits: 2,
        average_calibrated_risk: 0.512,
        file_risk_distribution: [
          {
            file_path: `${repoObj.name}/core.py`,
            max_evidence_score: 0.65,
            incident_count: 3,
            commits: ['7a1b8c', '3f2e1d'],
          },
          {
            file_path: `${repoObj.name}/utils.py`,
            max_evidence_score: 0.52,
            incident_count: 2,
            commits: ['a1c4d9'],
          },
        ],
        recent_commits: DEMO_DATA.commits,
      };
    }
  }

  try {
    return await safeFetchJson(getEndpointUrl(`/repositories/${repoId}/risk`));
  } catch {
    return DEMO_DATA.risk;
  }
}

export async function fetchCommits(limit = 50, repoId = null, repoObj = null) {
  if (repoObj && !repoObj.is_benchmark && repoObj.owner !== 'antigravity') {
    try {
      return await fetchGitHubRecentCommits(repoObj.owner, repoObj.name, limit);
    } catch {
      return DEMO_DATA.commits;
    }
  }

  try {
    const query = repoId ? `?limit=${limit}&repo_id=${repoId}` : `?limit=${limit}`;
    return await safeFetchJson(getEndpointUrl(`/commits${query}`));
  } catch {
    return DEMO_DATA.commits;
  }
}

export async function fetchCommitDetail(sha, repoObj = null) {
  // Check demo data first
  if (DEMO_DATA.commit_details[sha]) {
    return DEMO_DATA.commit_details[sha];
  }

  // If this commit belongs to a GitHub repository, fetch live from GitHub API
  if (repoObj && repoObj.owner !== 'antigravity') {
    try {
      return await fetchGitHubCommitDetail(repoObj.owner, repoObj.name, sha);
    } catch {
      // Fallback to sample with matching sha
      const sample = { ...DEMO_DATA.commit_details['1a8e34f2'], sha };
      return sample;
    }
  }

  try {
    return await safeFetchJson(getEndpointUrl(`/commits/${sha}`));
  } catch {
    return (
      DEMO_DATA.commit_details[sha] ||
      DEMO_DATA.commit_details['1a8e34f2'] ||
      Object.values(DEMO_DATA.commit_details)[0]
    );
  }
}

export async function predictCommit(diff, message = '', commitSha = 'custom_sha', repoId = null) {
  if (!diff || !diff.trim()) {
    throw new Error('Diff content cannot be empty.');
  }

  try {
    return await safeFetchJson(getEndpointUrl('/predict'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diff,
        message,
        commit_sha: commitSha,
        repository_id: repoId,
      }),
    });
  } catch (err) {
    // If it was an explicit validation error from backend (status 400), throw it
    if (err.message && err.message.toLowerCase().includes('cannot be empty')) {
      throw err;
    }
    // High-fidelity client-side prediction fallback
    return predictCommitLocally(diff, message, commitSha);
  }
}

export async function fetchExperiments() {
  try {
    return await safeFetchJson(getEndpointUrl('/experiments'));
  } catch {
    return DEMO_DATA.experiments;
  }
}

export async function testCounterfactual(diff, recipe = 'polarity_invert', seed = 42) {
  if (!diff || !diff.trim()) {
    throw new Error('Diff cannot be empty.');
  }

  try {
    return await safeFetchJson(getEndpointUrl('/experiments/counterfactual-test'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diff, recipe, seed }),
    });
  } catch (err) {
    if (err.message && err.message.toLowerCase().includes('cannot be empty')) {
      throw err;
    }
    // High-fidelity client-side counterfactual simulation fallback
    return evaluateCounterfactualLocally(diff, recipe, seed);
  }
}
