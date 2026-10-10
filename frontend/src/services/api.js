const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchRepositories() {
  const res = await fetch(`${API_BASE}/repositories`);
  if (!res.ok) throw new Error('Failed to fetch repositories');
  return res.json();
}

export async function fetchRepositoryRisk(repoId) {
  const res = await fetch(`${API_BASE}/repositories/${repoId}/risk`);
  if (!res.ok) throw new Error(`Failed to fetch risk data for repo ${repoId}`);
  return res.json();
}

export async function fetchCommits(limit = 50) {
  const res = await fetch(`${API_BASE}/commits?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch commits');
  return res.json();
}

export async function fetchCommitDetail(sha) {
  const res = await fetch(`${API_BASE}/commits/${sha}`);
  if (!res.ok) throw new Error(`Failed to fetch commit ${sha}`);
  return res.json();
}

export async function predictCommit(diff, message = '', commitSha = 'custom_sha', repoId = null) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      diff,
      message,
      commit_sha: commitSha,
      repository_id: repoId
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Prediction failed');
  }
  return res.json();
}

export async function fetchExperiments() {
  const res = await fetch(`${API_BASE}/experiments`);
  if (!res.ok) throw new Error('Failed to fetch experiments');
  return res.json();
}

export async function testCounterfactual(diff, recipe, seed = 42) {
  const res = await fetch(`${API_BASE}/experiments/counterfactual-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ diff, recipe, seed })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Counterfactual test failed');
  }
  return res.json();
}
