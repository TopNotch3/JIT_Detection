import { DEMO_DATA } from './demoData';

// If VITE_API_BASE_URL is provided, use it (trim trailing slashes)
// Otherwise default to '/api' which Vite proxies to http://localhost:8000 in dev
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

// Helper to check if a custom external backend URL is configured
const isCustomBackend = Boolean(import.meta.env.VITE_API_BASE_URL);

/**
 * Builds the URL for an endpoint.
 * Note: If using Vite proxy (/api), backend routes are at root (e.g., /health, /repositories).
 * If using a direct backend URL (e.g., https://backend.com), endpoints append directly.
 */
function getEndpointUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}

export async function fetchHealth() {
  try {
    const res = await fetch(getEndpointUrl('/health'));
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return await res.json();
  } catch {
    return DEMO_DATA.health;
  }
}

export async function fetchRepositories() {
  try {
    const res = await fetch(getEndpointUrl('/repositories'));
    if (!res.ok) throw new Error(`Failed to fetch repositories: ${res.status}`);
    return await res.json();
  } catch {
    return DEMO_DATA.repositories;
  }
}

export async function fetchRepositoryRisk(repoId) {
  try {
    const res = await fetch(getEndpointUrl(`/repositories/${repoId}/risk`));
    if (!res.ok) throw new Error(`Failed to fetch risk data for repo ${repoId}`);
    return await res.json();
  } catch {
    return DEMO_DATA.risk;
  }
}

export async function fetchCommits(limit = 50, repoId = null) {
  try {
    const query = repoId ? `?limit=${limit}&repo_id=${repoId}` : `?limit=${limit}`;
    const res = await fetch(getEndpointUrl(`/commits${query}`));
    if (!res.ok) throw new Error(`Failed to fetch commits: ${res.status}`);
    return await res.json();
  } catch {
    return DEMO_DATA.commits;
  }
}

export async function fetchCommitDetail(sha) {
  try {
    const res = await fetch(getEndpointUrl(`/commits/${sha}`));
    if (!res.ok) throw new Error(`Failed to fetch commit ${sha}`);
    return await res.json();
  } catch {
    return DEMO_DATA.commit_details[sha] || DEMO_DATA.commit_details['1a8e34f2'];
  }
}

export async function predictCommit(diff, message = '', commitSha = 'custom_sha', repoId = null) {
  try {
    const res = await fetch(getEndpointUrl('/predict'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diff,
        message,
        commit_sha: commitSha,
        repository_id: repoId,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Prediction failed');
    }
    return await res.json();
  } catch (err) {
    // If backend is unreachable in offline preview, provide a deterministic demonstrator response
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    const lines = diff.split('\n');
    const additions = lines.filter((l) => l.startsWith('+') && !l.startsWith('+++')).length;
    const deletions = lines.filter((l) => l.startsWith('-') && !l.startsWith('---')).length;
    const rawScore = Math.min(0.85, Math.max(0.15, 0.45 + additions * 0.02 - deletions * 0.01));
    const calibrated = rawScore;
    const category = calibrated >= 0.7 ? 'high' : calibrated >= 0.35 ? 'medium' : 'low';

    return {
      commit_sha: commitSha,
      raw_score: rawScore,
      calibrated_confidence: calibrated,
      risk_category: category,
      files_changed: 1,
      additions,
      deletions,
      model_version: '0.2.0-gatv2-cf-demo',
      calibrated_temperature: 1.38,
      explanation: [
        {
          file: 'modified_file.py',
          hunk_index: 0,
          start_line: 1,
          end_line: Math.max(5, lines.length),
          attention_weight: 0.5,
          importance_rank: 1,
          evidence_type: 'ast_hunk_attention',
          description: `Demonstrator simulated prediction for ${additions} added / ${deletions} deleted lines.`,
        },
      ],
    };
  }
}

export async function fetchExperiments() {
  try {
    const res = await fetch(getEndpointUrl('/experiments'));
    if (!res.ok) throw new Error('Failed to fetch experiments');
    return await res.json();
  } catch {
    return DEMO_DATA.experiments;
  }
}

export async function testCounterfactual(diff, recipe, seed = 42) {
  try {
    const res = await fetch(getEndpointUrl('/experiments/counterfactual-test'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diff, recipe, seed }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Counterfactual test failed');
    }
    return await res.json();
  } catch (err) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Demonstrator simulation for counterfactual lab
    const originalPred = 0.507;
    const perturbedPred = recipe === 'identifier_rename' ? 0.505 : recipe === 'comment_permutation' ? 0.507 : 0.512;
    const diffDelta = Math.abs(perturbedPred - originalPred);

    return {
      source_commit_sha: 'simulated_cf',
      recipe_applied: recipe,
      random_seed: seed,
      validity_status: 'valid_syntax',
      original_prediction: {
        raw_score: originalPred,
        calibrated_score: originalPred,
        risk_category: 'medium',
      },
      perturbed_prediction: {
        raw_score: perturbedPred,
        calibrated_score: perturbedPred,
        risk_category: 'medium',
      },
      delta_metric: diffDelta,
      counterfactual_robust: diffDelta < 0.05,
      syntactic_validity: true,
      ast_node_invariance_score: 0.98,
    };
  }
}
