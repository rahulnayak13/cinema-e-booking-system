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
  container: { maxWidth: "1000px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a" },
  backBtn: { padding: "8px 16px", backgroundColor: "#666", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
  addBtn: { padding: "10px 20px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
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
  textarea: { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px", boxSizing: "border-box", resize: "vertical", minHeight: "80px" },
  btnRow: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px" },
  cancelBtn: { padding: "10px 20px", backgroundColor: "#aaa", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  saveBtn: { padding: "10px 20px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  alertError: { backgroundColor: "#fde8e8", color: "#c0392b", padding: "12px", borderRadius: "5px", marginBottom: "16px", fontSize: "14px" },
  alertSuccess: { backgroundColor: "#d4edda", color: "#155724", padding: "12px", borderRadius: "5px", marginBottom: "16px", fontSize: "14px" },
  discountBadge: { display: "inline-block", backgroundColor: "#e74c3c", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold" },
  checkboxRow: { display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" },
  infoBox: { backgroundColor: "#e8f4fd", border: "1px solid #3498db", borderRadius: "5px", padding: "10px 14px", fontSize: "13px", color: "#1a6a9a", marginBottom: "16px" },
};

const initialForm = { title: "", description: "", discountPercent: "", startDate: "", endDate: "", promoCode: "" };

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required";
  if (!form.promoCode.trim()) errors.promoCode = "Promo code is required";
  else if (!/^[A-Z0-9_-]{2,20}$/.test(form.promoCode.trim())) errors.promoCode = "2-20 uppercase letters, numbers, - or _ only";
  if (!form.discountPercent) errors.discountPercent = "Discount is required";
  else {
    const v = parseFloat(form.discountPercent);
    if (isNaN(v) || v <= 0 || v > 100) errors.discountPercent = "Must be between 0.1 and 100";
  }
  if (!form.startDate) errors.startDate = "Start date is required";
  if (!form.endDate) errors.endDate = "End date is required";
  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    errors.endDate = "End date must be after start date";
  }
  return errors;
}

export default function AdminPromotions() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [sendEmail, setSendEmail] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "ADMIN") navigate("/");
    else loadPromotions();
  }, [navigate]);

  async function loadPromotions() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/promotions`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load promotions");
      setPromotions(await res.json());
    } catch (e) {
      setAlert({ type: "error", msg: e.message });
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setForm(initialForm);
    setSendEmail(false);
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
    try {
      const res = await fetch(`${API}/admin/promotions?sendEmail=${sendEmail}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          discountPercent: parseFloat(form.discountPercent),
          startDate: form.startDate,
          endDate: form.endDate,
          promoCode: form.promoCode.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create promotion");
      }
      setShowModal(false);
      setAlert({ type: "success", msg: sendEmail ? "Promotion created and email sent to subscribed users!" : "Promotion created!" });
      loadPromotions();
    } catch (e) {
      setAlert({ type: "error", msg: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this promotion?")) return;
    try {
      const res = await fetch(`${API}/admin/promotions/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to delete");
      setAlert({ type: "success", msg: "Promotion deleted." });
      loadPromotions();
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
            <h1 style={styles.title}>Manage Promotions</h1>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={styles.backBtn} onClick={() => navigate("/admin/dashboard")}>← Back</button>
              <button style={styles.addBtn} onClick={openAddModal}>+ Add Promotion</button>
            </div>
          </div>

          {alert && (
            <div style={alert.type === "error" ? styles.alertError : styles.alertSuccess}>{alert.msg}</div>
          )}

          {loading ? (
            <p>Loading…</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Promo Code</th>
                  <th style={styles.th}>Discount</th>
                  <th style={styles.th}>Valid From</th>
                  <th style={styles.th}>Valid To</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr><td colSpan="6" style={{ ...styles.td, textAlign: "center", color: "#999" }}>No promotions yet.</td></tr>
                ) : promotions.map((p) => (
                  <tr key={p.id}>
                    <td style={styles.td}><strong>{p.title}</strong></td>
                    <td style={styles.td}>{p.promoCode ? <code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: 4 }}>{p.promoCode}</code> : "—"}</td>
                    <td style={styles.td}><span style={styles.discountBadge}>{p.discountPercent}% OFF</span></td>
                    <td style={styles.td}>{p.startDate}</td>
                    <td style={styles.td}>{p.endDate}</td>
                    <td style={styles.td}>{p.description || "—"}</td>
                    <td style={styles.td}><button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button></td>
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
            <h2 style={styles.modalTitle}>Add Promotion</h2>

            {alert && showModal && alert.type === "error" && (
              <div style={styles.alertError}>{alert.msg}</div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Title *</label>
              <input
                style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: null }); }}
                placeholder="e.g. Summer Sale"
              />
              {errors.title && <div style={styles.errorMsg}>{errors.title}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Promo Code * <span style={{ color: "#999", fontWeight: 400 }}>(e.g. SUMMER20)</span></label>
              <input
                style={{ ...styles.input, ...(errors.promoCode ? styles.inputError : {}) }}
                value={form.promoCode}
                onChange={(e) => { setForm({ ...form, promoCode: e.target.value.toUpperCase() }); setErrors({ ...errors, promoCode: null }); }}
                placeholder="e.g. SUMMER20"
                maxLength={20}
              />
              {errors.promoCode && <div style={styles.errorMsg}>{errors.promoCode}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description of the promotion"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Discount Percent (%) *</label>
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                style={{ ...styles.input, ...(errors.discountPercent ? styles.inputError : {}) }}
                value={form.discountPercent}
                onChange={(e) => { setForm({ ...form, discountPercent: e.target.value }); setErrors({ ...errors, discountPercent: null }); }}
                placeholder="e.g. 20"
              />
              {errors.discountPercent && <div style={styles.errorMsg}>{errors.discountPercent}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date *</label>
                <input
                  type="date"
                  style={{ ...styles.input, ...(errors.startDate ? styles.inputError : {}) }}
                  value={form.startDate}
                  onChange={(e) => { setForm({ ...form, startDate: e.target.value }); setErrors({ ...errors, startDate: null, endDate: null }); }}
                />
                {errors.startDate && <div style={styles.errorMsg}>{errors.startDate}</div>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>End Date *</label>
                <input
                  type="date"
                  style={{ ...styles.input, ...(errors.endDate ? styles.inputError : {}) }}
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={(e) => { setForm({ ...form, endDate: e.target.value }); setErrors({ ...errors, endDate: null }); }}
                />
                {errors.endDate && <div style={styles.errorMsg}>{errors.endDate}</div>}
              </div>
            </div>

            <div style={styles.infoBox}>
              📧 Optionally send this promotion by email to all subscribed customers.
            </div>

            <div style={styles.checkboxRow}>
              <input
                type="checkbox"
                id="sendEmail"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <label htmlFor="sendEmail" style={{ fontSize: "14px", cursor: "pointer" }}>
                Send email to subscribed users
              </label>
            </div>

            <div style={styles.btnRow}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving…" : "Create Promotion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
