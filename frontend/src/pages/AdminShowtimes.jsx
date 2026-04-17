import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "http://localhost:8080/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "20px" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a" },
  backBtn: { padding: "8px 16px", backgroundColor: "#666", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
  addBtn: { padding: "10px 20px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginTop: "16px" },
  th: { backgroundColor: "#1a1a1a", color: "#fff", padding: "12px 16px", textAlign: "left", fontSize: "14px" },
  td: { padding: "12px 16px", borderBottom: "1px solid #eee", fontSize: "14px" },
  deleteBtn: { padding: "5px 12px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { backgroundColor: "#fff", borderRadius: "8px", padding: "30px", width: "540px", maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { fontSize: "22px", fontWeight: "bold", marginBottom: "20px" },
  formGroup: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px", color: "#333" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px", boxSizing: "border-box" },
  inputError: { borderColor: "#e74c3c" },
  errorMsg: { color: "#e74c3c", fontSize: "12px", marginTop: "4px" },
  select: { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px", boxSizing: "border-box" },
  btnRow: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px" },
  cancelBtn: { padding: "10px 20px", backgroundColor: "#aaa", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  saveBtn: { padding: "10px 20px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  alertError: { backgroundColor: "#fde8e8", color: "#c0392b", padding: "12px", borderRadius: "5px", marginBottom: "16px", fontSize: "14px" },
  alertSuccess: { backgroundColor: "#d4edda", color: "#155724", padding: "12px", borderRadius: "5px", marginBottom: "16px", fontSize: "14px" },
  card: { backgroundColor: "#fff", borderRadius: "8px", padding: "20px", marginBottom: "24px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  sectionTitle: { fontSize: "16px", fontWeight: "bold", color: "#333", marginBottom: "12px" },
  conflictBanner: { backgroundColor: "#fff3cd", color: "#856404", padding: "12px", borderRadius: "5px", marginBottom: "16px", fontSize: "14px", border: "1px solid #ffc107" },
};

function formatDateTime(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

const initialForm = { movieId: "", showroomId: "", date: "", time: "" };

function validate(form) {
  const errors = {};
  if (!form.movieId) errors.movieId = "Please select a movie";
  if (!form.showroomId) errors.showroomId = "Please select a showroom";
  if (!form.date) errors.date = "Date is required";
  if (!form.time) errors.time = "Time is required";
  if (form.date) {
    const selected = new Date(form.date + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (selected < today) errors.date = "Date cannot be in the past";
  }
  return errors;
}

export default function AdminShowtimes() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [showrooms, setShowrooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterMovieId, setFilterMovieId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "ADMIN") navigate("/");
    else loadAll();
  }, [navigate]);

  async function loadAll() {
    setLoading(true);
    try {
      const [movRes, roomRes, stRes] = await Promise.all([
        fetch(`${API}/movies`),
        fetch(`${API}/showrooms`),
        fetch(`${API}/admin/showtimes`, { headers: getAuthHeaders() }),
      ]);
      setMovies(await movRes.json());
      setShowrooms(await roomRes.json());
      setShowtimes(await stRes.json());
    } catch {
      setAlert({ type: "error", msg: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setForm(initialForm);
    setErrors({});
    setAlert(null);
    setShowModal(true);
  }

  async function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    const startTime = `${form.date}T${form.time}:00`;
    try {
      const res = await fetch(`${API}/admin/showtimes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ movieId: Number(form.movieId), showroomId: Number(form.showroomId), startTime }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setErrors({ conflict: data.error || "Scheduling conflict detected!" });
        } else {
          throw new Error(data.error || "Failed to add showtime");
        }
        return;
      }
      setShowModal(false);
      setAlert({ type: "success", msg: "Showtime scheduled!" });
      loadAll();
    } catch (e) {
      setAlert({ type: "error", msg: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this showtime?")) return;
    try {
      const res = await fetch(`${API}/admin/showtimes/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to delete");
      setAlert({ type: "success", msg: "Showtime deleted." });
      loadAll();
    } catch (e) {
      setAlert({ type: "error", msg: e.message });
    }
  }

  const movieMap = Object.fromEntries(movies.map((m) => [m.id, m.title]));
  const roomMap = Object.fromEntries(showrooms.map((r) => [r.id, r.name]));

  const filteredShowtimes = filterMovieId
    ? showtimes.filter((s) => String(s.movieId) === String(filterMovieId))
    : showtimes;

  // Sort by start time
  const sortedShowtimes = [...filteredShowtimes].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Manage Showtimes</h1>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={styles.backBtn} onClick={() => navigate("/admin/dashboard")}>← Back</button>
              <button style={styles.addBtn} onClick={openAddModal}>+ Schedule Showtime</button>
            </div>
          </div>

          {alert && (
            <div style={alert.type === "error" ? styles.alertError : styles.alertSuccess}>{alert.msg}</div>
          )}

          {/* Showrooms info card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Available Showrooms</div>
            <div style={{ display: "flex", gap: "16px" }}>
              {showrooms.map((r) => (
                <div key={r.id} style={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd", borderRadius: "6px", padding: "12px 20px", textAlign: "center" }}>
                  <div style={{ fontWeight: "bold", fontSize: "15px" }}>{r.name}</div>
                  <div style={{ color: "#666", fontSize: "13px" }}>Capacity: {r.capacity}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ fontWeight: "600", fontSize: "14px" }}>Filter by movie:</label>
            <select
              style={{ ...styles.select, width: "260px" }}
              value={filterMovieId}
              onChange={(e) => setFilterMovieId(e.target.value)}
            >
              <option value="">All Movies</option>
              {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>

          {loading ? (
            <p>Loading…</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Movie</th>
                  <th style={styles.th}>Showroom</th>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedShowtimes.length === 0 ? (
                  <tr><td colSpan="4" style={{ ...styles.td, textAlign: "center", color: "#999" }}>No showtimes scheduled.</td></tr>
                ) : sortedShowtimes.map((s) => (
                  <tr key={s.id}>
                    <td style={styles.td}><strong>{s.movieTitle || movieMap[s.movieId] || `Movie #${s.movieId}`}</strong></td>
                    <td style={styles.td}>{roomMap[s.showroomId] || `Showroom ${s.showroomId}`}</td>
                    <td style={styles.td}>{formatDateTime(s.startTime)}</td>
                    <td style={styles.td}><button style={styles.deleteBtn} onClick={() => handleDelete(s.id)}>Delete</button></td>
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
            <h2 style={styles.modalTitle}>Schedule Showtime</h2>

            {errors.conflict && <div style={styles.conflictBanner}>⚠️ {errors.conflict}</div>}
            {alert && showModal && alert.type === "error" && (
              <div style={styles.alertError}>{alert.msg}</div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Movie *</label>
              <select
                style={{ ...styles.select, ...(errors.movieId ? styles.inputError : {}) }}
                value={form.movieId}
                onChange={(e) => { setForm({ ...form, movieId: e.target.value }); setErrors({ ...errors, movieId: null }); }}
              >
                <option value="">— Select a movie —</option>
                {movies.map((m) => <option key={m.id} value={m.id}>{m.title} ({m.status?.replace("_", " ")})</option>)}
              </select>
              {errors.movieId && <div style={styles.errorMsg}>{errors.movieId}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Showroom *</label>
              <select
                style={{ ...styles.select, ...(errors.showroomId ? styles.inputError : {}) }}
                value={form.showroomId}
                onChange={(e) => { setForm({ ...form, showroomId: e.target.value }); setErrors({ ...errors, showroomId: null }); }}
              >
                <option value="">— Select a showroom —</option>
                {showrooms.map((r) => <option key={r.id} value={r.id}>{r.name} (capacity: {r.capacity})</option>)}
              </select>
              {errors.showroomId && <div style={styles.errorMsg}>{errors.showroomId}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date *</label>
                <input
                  type="date"
                  style={{ ...styles.input, ...(errors.date ? styles.inputError : {}) }}
                  value={form.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => { setForm({ ...form, date: e.target.value }); setErrors({ ...errors, date: null, conflict: null }); }}
                />
                {errors.date && <div style={styles.errorMsg}>{errors.date}</div>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Time *</label>
                <input
                  type="time"
                  style={{ ...styles.input, ...(errors.time ? styles.inputError : {}) }}
                  value={form.time}
                  onChange={(e) => { setForm({ ...form, time: e.target.value }); setErrors({ ...errors, time: null, conflict: null }); }}
                />
                {errors.time && <div style={styles.errorMsg}>{errors.time}</div>}
              </div>
            </div>

            {/* Conflict preview: show existing showtimes for selected showroom+date */}
            {form.showroomId && form.date && (() => {
              const conflicts = showtimes.filter(
                (s) => String(s.showroomId) === String(form.showroomId) &&
                  s.startTime?.startsWith(form.date)
              );
              return conflicts.length > 0 ? (
                <div style={styles.conflictBanner}>
                  <strong>Existing showtimes in {roomMap[form.showroomId]} on {form.date}:</strong>
                  <ul style={{ margin: "6px 0 0 0", paddingLeft: "18px" }}>
                    {conflicts.map((c) => <li key={c.id}>{c.movieTitle} at {new Date(c.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</li>)}
                  </ul>
                </div>
              ) : null;
            })()}

            <div style={styles.btnRow}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Scheduling…" : "Schedule Showtime"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
