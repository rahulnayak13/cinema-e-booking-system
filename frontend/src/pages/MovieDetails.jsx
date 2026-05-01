import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMovieById } from "../api/movies";
import { addFavorite, removeFavorite, checkIfFavorite } from "../api/auth";

export default function MovieDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

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

    fetch(`/api/movies/${id}/showtimes`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setShowtimes(data); })
      .catch(() => {});

    // Check if user is logged in and if movie is a favorite
    const token = localStorage.getItem("token");
    if (token) {
      checkIfFavorite(id)
        .then((res) => {
          if (!cancelled) setIsFavorite(res.isFavorite);
        })
        .catch(() => {
          // Not logged in or error
        });
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite(id);
        setIsFavorite(true);
      }
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#666" }}>Loading…</div>;
  if (err) return <div style={{ padding: 40, textAlign: "center", color: "crimson" }}>{err}</div>;
  if (!movie) return <div style={{ padding: 40, textAlign: "center" }}>Movie not found.</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>

      {/* ── Hero Row ── */}
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", marginBottom: 36 }}>

        {/* Poster */}
        <div style={{ flexShrink: 0, width: 220, borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", position: "relative" }}>
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", aspectRatio: "2/3", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, color: "#ccc" }}>🎬</div>
          )}
          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={{
              position: "absolute", top: 10, right: 10,
              fontSize: 22, background: "rgba(0,0,0,0.45)", border: "none",
              borderRadius: "50%", width: 40, height: 40, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isFavorite ? "#ff1744" : "#fff", transition: "all 0.2s",
            }}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>{movie.title}</h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {movie.rating && (
              <span style={{ background: "#1a1a1a", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 13, fontWeight: 600 }}>{movie.rating}</span>
            )}
            {(movie.genres || []).map((g) => (
              <span key={g} style={{ background: "#f0f0f0", color: "#444", borderRadius: 6, padding: "3px 10px", fontSize: 13 }}>{g}</span>
            ))}
          </div>

          {movie.description && (
            <p style={{ lineHeight: 1.7, color: "#333", fontSize: 15, marginBottom: 16, maxWidth: 600 }}>{movie.description}</p>
          )}

          {(movie.director || movie.producer || movie.cast || movie.reviews) && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
              {movie.director && (
                <div><span style={{ fontWeight: 700, color: "#555", minWidth: 72, display: "inline-block" }}>Director</span> {movie.director}</div>
              )}
              {movie.producer && (
                <div><span style={{ fontWeight: 700, color: "#555", minWidth: 72, display: "inline-block" }}>Producer</span> {movie.producer}</div>
              )}
              {movie.cast && (
                <div><span style={{ fontWeight: 700, color: "#555", minWidth: 72, display: "inline-block" }}>Cast</span> {movie.cast}</div>
              )}
              {movie.reviews && (
                <div><span style={{ fontWeight: 700, color: "#555", minWidth: 72, display: "inline-block" }}>Reviews</span> {movie.reviews}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Showtimes ── */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, borderBottom: "2px solid #f0f0f0", paddingBottom: 8 }}>Showtimes</h2>
        {showtimes.length === 0 ? (
          <p style={{ color: "#999", fontSize: 14 }}>No showtimes scheduled.</p>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {showtimes.map((t) => {
              const dt = new Date(t.startTime);
              const label = dt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
              return (
                <button
                  key={t.id}
                  onClick={() => nav(`/booking?movieId=${movie.id}&showtimeId=${t.id}&showtime=${encodeURIComponent(t.startTime)}&showroomId=${t.showroomId}`)}
                  style={{
                    padding: "10px 16px", borderRadius: 10, border: "1px solid #ddd",
                    background: "white", cursor: "pointer", fontSize: 14, fontWeight: 500,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.background = "#f5f5f5"; e.target.style.borderColor = "#aaa"; }}
                  onMouseLeave={(e) => { e.target.style.background = "white"; e.target.style.borderColor = "#ddd"; }}
                >
                  {label} · Screen {t.showroomId}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Trailer ── */}
      {movie.trailerUrl && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, borderBottom: "2px solid #f0f0f0", paddingBottom: 8 }}>Trailer</h2>
          <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "16/9", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <iframe
              title="Trailer"
              src={movie.trailerUrl}
              style={{ width: "100%", height: "100%", border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}