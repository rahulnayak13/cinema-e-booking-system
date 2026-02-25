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