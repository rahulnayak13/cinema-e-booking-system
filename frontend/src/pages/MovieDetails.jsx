import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMovieById } from "../api/movies";

export default function MovieDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr("");

    fetchMovieById(id)
      .then((data) => {
        if (!cancelled) setMovie(data);
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message || "Failed to load movie");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 18 }}>
      <div>
        <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }}
          />
        </div>
      </div>

      <div>
        <h1 style={{ marginBottom: 6 }}>{movie.title}</h1>
        <div style={{ color: "#666", marginBottom: 12 }}>
          {movie.rating} · {(movie.genres || []).join(", ")}
        </div>

        <p style={{ lineHeight: 1.5 }}>{movie.description}</p>

        <h2 style={{ marginTop: 18, marginBottom: 10 }}>Showtimes</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(movie.showtimes || []).map((t) => (
            <button
              key={t}
              onClick={() => nav(`/booking?movieId=${movie.id}&showtime=${encodeURIComponent(t)}`)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <h2 style={{ marginTop: 22, marginBottom: 10 }}>Trailer</h2>
        <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9" }}>
          <iframe
            title="Trailer"
            src={movie.trailerUrl}
            style={{ width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}