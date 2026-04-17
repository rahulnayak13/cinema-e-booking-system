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

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 18 }}>
      <div>
        <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", position: "relative" }}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }}
          />
          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "28px",
              background: "rgba(0,0,0,0.3)",
              border: "none",
              borderRadius: "50%",
              width: "45px",
              height: "45px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isFavorite ? "#ff1744" : "#fff",
              transition: "all 0.3s",
            }}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
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
          {showtimes.length === 0 ? (
            <p style={{ color: "#999" }}>No showtimes scheduled.</p>
          ) : (
            showtimes.map((t) => {
              const dt = new Date(t.startTime);
              const label = dt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
              return (
                <button
                  key={t.id}
                  onClick={() => nav(`/booking?movieId=${movie.id}&showtimeId=${t.id}&showtime=${encodeURIComponent(t.startTime)}&showroomId=${t.showroomId}`)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  {label} · Screen {t.showroomId}
                </button>
              );
            })
          )}
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