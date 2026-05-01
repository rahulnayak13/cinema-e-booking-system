export async function fetchMovies(params = {}) {
  const qs = new URLSearchParams(params);
  const url = qs.toString() ? `/api/movies?${qs}` : "/api/movies";

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);

  return res.json();
}

export async function fetchMovieById(id) {
  const res = await fetch(`/api/movies/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch movie: ${res.status}`);

  return res.json();
}

/**
 * Fetch personalised recommendations for a logged-in user.
 * Only the user's own email is transmitted — no payment data or raw transactions.
 * The recommendation service is a separate internal component (not an external API).
 */
export async function fetchPersonalisedRecommendations(email, limit = 6) {
  const res = await fetch('/api/recommendations/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, limit, type: 'HYBRID' }),
  });
  if (!res.ok) throw new Error(`Recommendations failed: ${res.status}`);
  return res.json();
}

/** Fetch popular recommendations for anonymous visitors — no identifiers sent. */
export async function fetchPopularRecommendations(limit = 6) {
  const res = await fetch(`/api/recommendations/popular?limit=${limit}`);
  if (!res.ok) throw new Error(`Popular recommendations failed: ${res.status}`);
  return res.json();
}