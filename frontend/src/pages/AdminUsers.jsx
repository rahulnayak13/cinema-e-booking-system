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
  container: { maxWidth: "1100px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a" },
  backBtn: { padding: "8px 16px", backgroundColor: "#666", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  th: { backgroundColor: "#1a1a1a", color: "#fff", padding: "12px 16px", textAlign: "left", fontSize: "14px" },
  td: { padding: "12px 16px", borderBottom: "1px solid #eee", fontSize: "14px", verticalAlign: "middle" },
  roleBadge: (role) => ({
    display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold",
    backgroundColor: role === "ADMIN" ? "#8e44ad" : "#2980b9", color: "#fff",
  }),
  statusBadge: (status) => ({
    display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold",
    backgroundColor: status === "active" ? "#27ae60" : status === "suspended" ? "#e74c3c" : "#95a5a6",
    color: "#fff",
  }),
  select: { padding: "5px 8px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px", cursor: "pointer" },
  alertError: { backgroundColor: "#fde8e8", color: "#c0392b", padding: "12px", borderRadius: "5px", marginBottom: "16px", fontSize: "14px" },
  alertSuccess: { backgroundColor: "#d4edda", color: "#155724", padding: "12px", borderRadius: "5px", marginBottom: "16px", fontSize: "14px" },
  searchInput: { padding: "9px 14px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px", width: "280px" },
  statsRow: { display: "flex", gap: "16px", marginBottom: "20px" },
  statCard: { backgroundColor: "#fff", borderRadius: "8px", padding: "16px 24px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", textAlign: "center" },
  statNum: { fontSize: "28px", fontWeight: "bold", color: "#e74c3c" },
  statLabel: { fontSize: "13px", color: "#666" },
};

const STATUS_OPTIONS = ["active", "inactive", "suspended"];

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "ADMIN") navigate("/");
    else {
      setCurrentUserId(user.id);
      loadUsers();
    }
  }, [navigate]);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/users`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch users");
      setUsers(await res.json());
    } catch (e) {
      setAlert({ type: "error", msg: e.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(userId, newStatus) {
    try {
      const res = await fetch(`${API}/admin/users/${userId}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setAlert({ type: "success", msg: "User status updated." });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (e) {
      setAlert({ type: "error", msg: e.message });
    }
  }

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(s) ||
      u.firstName?.toLowerCase().includes(s) ||
      u.lastName?.toLowerCase().includes(s)
    );
  });

  const totalCustomers = users.filter((u) => u.role === "CUSTOMER").length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const subscribedCount = users.filter((u) => u.promotionSubscribed).length;

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Manage Users</h1>
            <button style={styles.backBtn} onClick={() => navigate("/admin/dashboard")}>← Back</button>
          </div>

          {alert && (
            <div style={alert.type === "error" ? styles.alertError : styles.alertSuccess}>{alert.msg}</div>
          )}

          <div style={styles.statsRow}>
            <div style={styles.statCard}><div style={styles.statNum}>{users.length}</div><div style={styles.statLabel}>Total Users</div></div>
            <div style={styles.statCard}><div style={styles.statNum}>{totalCustomers}</div><div style={styles.statLabel}>Customers</div></div>
            <div style={styles.statCard}><div style={styles.statNum}>{activeCount}</div><div style={styles.statLabel}>Active</div></div>
            <div style={styles.statCard}><div style={styles.statNum}>{subscribedCount}</div><div style={styles.statLabel}>Promo Subscribed</div></div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <input
              style={styles.searchInput}
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Loading…</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Promo</th>
                  <th style={styles.th}>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td style={styles.td}>{u.firstName} {u.lastName}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.phone || "—"}</td>
                    <td style={styles.td}><span style={styles.roleBadge(u.role)}>{u.role}</span></td>
                    <td style={styles.td}><span style={styles.statusBadge(u.status)}>{u.status}</span></td>
                    <td style={styles.td}>{u.promotionSubscribed ? "✓" : "—"}</td>
                    <td style={styles.td}>
                      {u.id === currentUserId ? (
                        <span style={{ fontSize: "12px", color: "#999" }}>Current admin</span>
                      ) : (
                        <select
                          style={styles.select}
                          value={u.status}
                          onChange={(e) => handleStatusChange(u.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
