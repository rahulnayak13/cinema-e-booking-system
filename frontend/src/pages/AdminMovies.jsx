import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "http://localhost:8080/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

const FALLBACK_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='70' viewBox='0 0 50 70'%3E%3Crect width='50' height='70' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='%23999'%3E%F0%9F%8E%AC%3C/text%3E%3C/svg%3E";

const STATUS_OPTIONS = ["CURRENTLY_RUNNING", "COMING_SOON"];
const RATING_OPTIONS = ["G", "PG", "PG-13", "R", "NC-17"];
const GENRE_OPTIONS = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"];

const initialForm = {
  title: "",
  status: "",
  rating: "",
  description: "",
  posterUrl: "",
  trailerUrl: "",
  cast: "",
  director: "",
  producer: "",
  genres: [],
};

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "20px" },
  container: { maxWidth: "1100px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a" },
  backBtn: { padding: "8px 16px", backgroundColor: "#666", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
  addBtn: { padding: "10px 20px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  th: { backgroundColor: "#1a1a1a", color: "#fff", padding: "12px 16px", textAlign: "left", fontSize: "14px" },
  td: { padding: "12px 16px", borderBottom: "1px solid #eee", fontSize: "14px", verticalAlign: "middle" },
  badge: (status) => ({
    display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold",
    backgroundColor: status === "CURRENTLY_RUNNING" ? "#27ae60" : "#3498db",
    color: "#fff",
  }),
  editBtn: { padding: "5px 12px", backgroundColor: "#3498db", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "6px" },
  deleteBtn: { padding: "5px 12px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { backgroundColor: "#fff", borderRadius: "8px", padding: "30px", width: "580px", maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { fontSize: "22px", fontWeight: "bold", marginBottom: "20px", color: "#1a1a1a" },
  formGroup: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#333" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px", boxSizing: "border-box" },
  inputError: { borderColor: "#e74c3c" },
  errorMsg: { color: "#e74c3c", fontSize: "12px", marginTop: "4px" },
  select: { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px", boxSizing: "border-box", resize: "vertical", minHeight: "90px" },
  genreGrid: { display: "flex", flexWrap: "wrap", gap: "8px" },
  genreChip: (selected) => ({
    padding: "4px 12px", borderRadius: "16px", cursor: "pointer", fontSize: "13px", border: "1px solid #ccc",
    backgroundColor: selected ? "#e74c3c" : "#f5f5f5", color: selected ? "#fff" : "#333",
  }),
  btnRow: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px" },
  cancelBtn: { padding: "10px 20px", backgroundColor: "#aaa", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  saveBtn: { padding: "10px 20px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  alertError: { backgroundColor: "#fde8e8", color: "#c0392b", padding: "12px", borderRadius: "5px", marginBottom: "16px", fontSize: "14px" },
  alertSuccess: { backgroundColor: "#d4edda", color: "#155724", padding: "12px", borderRadius: "5px", marginBottom: "16px", fontSize: "14px" },
  posterThumb: { width: "50px", height: "70px", objectFit: "cover", borderRadius: "4px" },
  noImg: { width: "50px", height: "70px", backgroundColor: "#eee", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required";
  if (!form.status) errors.status = "Status is required";
  if (form.description && form.description.length > 2000) errors.description = "Max 2000 characters";
  if (form.posterUrl && !/^https?:\/\/.+/.test(form.posterUrl)) errors.posterUrl = "Must be a valid URL";
  if (form.trailerUrl && !/^https?:\/\/.+/.test(form.trailerUrl)) errors.trailerUrl = "Must be a valid URL";
  return errors;
}

export default function AdminMovies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "ADMIN") navigate("/");
    else loadMovies();
  }, [navigate]);

  async function loadMovies() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/movies`);
      const data = await res.json();
      setMovies(data);
    } catch {
      setAlert({ type: "error", msg: "Failed to load movies" });
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingMovie(null);
    setForm(initialForm);
    setErrors({});
    setAlert(null);
    setShowModal(true);
  }

  function openEditModal(movie) {
    setEditingMovie(movie);
    setForm({
      title: movie.title || "",
      status: movie.status || "",
      rating: movie.rating || "",
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
      trailerUrl: movie.trailerUrl || "",
      cast: movie.cast || "",
      director: movie.director || "",
      producer: movie.producer || "",
      genres: movie.genres || [],
    });
    setErrors({});
    setAlert(null);
    setShowModal(true);
  }

  function toggleGenre(genre) {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre) ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre],
    }));
  }

  async function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const method = editingMovie ? "PUT" : "POST";
      const url = editingMovie ? `${API}/movies/${editingMovie.id}` : `${API}/movies`;
      const payload = { ...form, status: form.status || null, rating: form.rating || null };
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }
      setShowModal(false);
      setAlert({ type: "success", msg: editingMovie ? "Movie updated!" : "Movie added!" });
      loadMovies();
    } catch (e) {
      setAlert({ type: "error", msg: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(movie) {
    if (!window.confirm(`Delete "${movie.title}"?`)) return;
    try {
      const res = await fetch(`${API}/movies/${movie.id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to delete");
      setAlert({ type: "success", msg: "Movie deleted." });
      loadMovies();
    } catch (e) {
      setAlert({ type: "error", msg: e.message });
    }
  }

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Manage Movies</h1>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={styles.backBtn} onClick={() => navigate("/admin/dashboard")}>← Back</button>
              <button style={styles.addBtn} onClick={openAddModal}>+ Add Movie</button>
            </div>
          </div>

          {alert && (
            <div style={alert.type === "error" ? styles.alertError : styles.alertSuccess}>
              {alert.msg}
            </div>
          )}

          {loading ? (
            <p>Loading movies…</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Poster</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Rating</th>
                  <th style={styles.th}>Genres</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m.id}>
                    <td style={styles.td}>
                      {m.posterUrl ? (
                        <img src={m.posterUrl} alt={m.title} style={styles.posterThumb} onError={(e) => { e.target.onerror=null; e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      ) : null}
                      <div style={{ ...styles.noImg, display: m.posterUrl ? 'none' : 'flex' }}>🎦</div>
                    </td>
                    <td style={styles.td}><strong>{m.title}</strong></td>
                    <td style={styles.td}><span style={styles.badge(m.status)}>{m.status?.replace("_", " ")}</span></td>
                    <td style={styles.td}>{m.rating || "—"}</td>
                    <td style={styles.td}>{m.genres?.join(", ") || "—"}</td>
                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => openEditModal(m)}>Edit</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(m)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>{editingMovie ? "Edit Movie" : "Add New Movie"}</h2>

            {alert && showModal && (
              <div style={alert.type === "error" ? styles.alertError : styles.alertSuccess}>{alert.msg}</div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Title *</label>
              <input
                style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: null }); }}
                placeholder="Movie title"
              />
              {errors.title && <div style={styles.errorMsg}>{errors.title}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status *</label>
                <select style={{ ...styles.select, ...(errors.status ? styles.inputError : {}) }} value={form.status} onChange={(e) => { setForm({ ...form, status: e.target.value }); setErrors({ ...errors, status: null }); }}>
                  <option value="">— Select status —</option>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
                {errors.status && <div style={styles.errorMsg}>{errors.status}</div>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Rating</label>
                <select style={styles.select} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                  <option value="">— Select rating —</option>
                  {RATING_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.textarea, ...(errors.description ? styles.inputError : {}) }}
                value={form.description}
                onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: null }); }}
                placeholder="Movie description (max 2000 chars)"
              />
              {errors.description && <div style={styles.errorMsg}>{errors.description}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Poster URL</label>
              <input
                style={{ ...styles.input, ...(errors.posterUrl ? styles.inputError : {}) }}
                value={form.posterUrl}
                onChange={(e) => { setForm({ ...form, posterUrl: e.target.value }); setErrors({ ...errors, posterUrl: null }); }}
                placeholder="https://..."
              />
              {errors.posterUrl && <div style={styles.errorMsg}>{errors.posterUrl}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Trailer URL</label>
              <input
                style={{ ...styles.input, ...(errors.trailerUrl ? styles.inputError : {}) }}
                value={form.trailerUrl}
                onChange={(e) => { setForm({ ...form, trailerUrl: e.target.value }); setErrors({ ...errors, trailerUrl: null }); }}
                placeholder="https://www.youtube.com/embed/..."
              />
              {errors.trailerUrl && <div style={styles.errorMsg}>{errors.trailerUrl}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Director</label>
                <input
                  style={styles.input}
                  value={form.director}
                  onChange={(e) => setForm({ ...form, director: e.target.value })}
                  placeholder="Director name"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Producer</label>
                <input
                  style={styles.input}
                  value={form.producer}
                  onChange={(e) => setForm({ ...form, producer: e.target.value })}
                  placeholder="Producer name"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cast</label>
                <input
                  style={styles.input}
                  value={form.cast}
                  onChange={(e) => setForm({ ...form, cast: e.target.value })}
                  placeholder="Actor1, Actor2, …"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Genres</label>
              <div style={styles.genreGrid}>
                {GENRE_OPTIONS.map((g) => (
                  <span key={g} style={styles.genreChip(form.genres.includes(g))} onClick={() => toggleGenre(g)}>{g}</span>
                ))}
              </div>
            </div>

            <div style={styles.btnRow}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving…" : editingMovie ? "Update Movie" : "Add Movie"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
