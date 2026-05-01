import { useEffect, useMemo, useState } from "react";
import { fetchMovies, fetchPersonalisedRecommendations, fetchPopularRecommendations } from "../api/movies";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const FALLBACK_POSTER = "https://placehold.co/300x450/eeeeee/999999?text=No+Image";

function MovieCard({ m }) {
  return (
    <Link
      to={`/movies/${m.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        border: "1px solid #eee",
        borderRadius: 12,
        overflow: "hidden",
        display: "block",
        background: "white",
      }}
    >
      <div style={{ aspectRatio: "2/3", background: "#f5f5f5" }}>
        <img
          src={m.posterUrl || FALLBACK_POSTER}
          alt={m.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_POSTER; }}
        />
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontWeight: 700 }}>{m.title}</div>
        <div style={{ fontSize: 13, color: "#666" }}>
          {m.rating} · {(m.genres || []).slice(0, 2).join(", ")}
        </div>
      </div>
    </Link>
  );
}

function matchLabel(score) {
  if (score >= 80) return { text: "Top Pick", color: "#d97706" };
  if (score >= 60) return { text: "Great Match", color: "#16a34a" };
  if (score >= 35) return { text: "Good Match", color: "#2563eb" };
  return { text: "Worth Watching", color: "#6b7280" };
}

export default function Home() {
  const [statusTab, setStatusTab] = useState("CURRENTLY_RUNNING");
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [showDate, setShowDate] = useState("");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [recs, setRecs] = useState([]);
  const [recsTabLabel, setRecsTabLabel] = useState("Popular Picks");
  const [recsLoading, setRecsLoading] = useState(true);

  // Load recommendations once on mount — personalised if logged in, popular otherwise.
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const userEmail = stored ? JSON.parse(stored).email : null;

    const fetcher = userEmail
      ? fetchPersonalisedRecommendations(userEmail, 12)
      : fetchPopularRecommendations(12);

    fetcher
      .then((data) => {
        setRecs(data.recommendations || []);
        setRecsTabLabel(userEmail ? "For You" : "Popular Picks");
      })
      .catch(() => {
        // Recommendations are non-critical; silently skip on error.
      })
      .finally(() => setRecsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr("");

    fetchMovies({
      status: statusTab,
      ...(q.trim() ? { q: q.trim() } : {}),
      ...(genre ? { genre } : {}),
      ...(showDate ? { showDate } : {}),
    })
      .then((data) => {
        if (!cancelled) setMovies(data);
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message || "Failed to load movies");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [statusTab, q, genre, showDate]);

  const genreOptions = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => (m.genres || []).forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [movies]);

  return (
    <div>
      {/* ✅ Reusable Navbar */}
      <Navbar />

      <div style={{ padding: "24px" }}>
        <h1 style={{ marginBottom: 8 }}>Home</h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["CURRENTLY_RUNNING", "COMING_SOON", "RECOMMENDED"].map((tab) => {
            const label =
              tab === "CURRENTLY_RUNNING" ? "Currently Running"
              : tab === "COMING_SOON" ? "Coming Soon"
              : recsTabLabel;
            return (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: statusTab === tab ? "#eee" : "white",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search + Filters — hidden on the Recommendations tab */}
        <div
          style={{
            display: statusTab === "RECOMMENDED" ? "none" : "grid",
            gridTemplateColumns: "1fr 180px 180px",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title..."
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          >
            <option value="">All genres</option>
            {genreOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={showDate}
            onChange={(e) => setShowDate(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
        </div>

        {/* ── Recommendations tab content ──────────────────────────────── */}
        {statusTab === "RECOMMENDED" && (
          recsLoading ? (
            <p>Loading recommendations…</p>
          ) : recs.length === 0 ? (
            <p>No recommendations available yet.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))",
                gap: 14,
              }}
            >
              {recs.map((m) => {
                const badge = matchLabel(m.relevanceScore);
                return (
                  <Link
                    key={m.id}
                    to={`/movies/${m.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      border: "1px solid #eee",
                      borderRadius: 12,
                      overflow: "hidden",
                      display: "block",
                      background: "white",
                      position: "relative",
                    }}
                  >
                    <div style={{ aspectRatio: "2/3", background: "#f5f5f5" }}>
                      <img
                        src={m.posterUrl || FALLBACK_POSTER}
                        alt={m.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_POSTER; }}
                      />
                    </div>
                    {badge && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          background: badge.color,
                          color: "white",
                          borderRadius: 6,
                          padding: "3px 8px",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {badge.text}
                      </div>
                    )}
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700 }}>{m.title}</div>
                      <div style={{ fontSize: 13, color: "#666" }}>
                        {m.rating} · {(m.genres ? [...m.genres] : []).slice(0, 2).join(", ")}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        )}

        {/* ── Browse tab content (Currently Running / Coming Soon) ──────── */}
        {statusTab !== "RECOMMENDED" && (
          <>
        {/* Results */}
        {loading && <p>Loading movies…</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}

        {!loading && !err && movies.length === 0 && (
          <p>No movies found for your search/filter.</p>
        )}

        {!loading && !err && movies.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))",
              gap: 14,
            }}
          >
            {movies.map((m) => (
              <MovieCard key={m.id} m={m} />
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}