import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "30px",
    borderRadius: "5px",
    marginBottom: "30px",
    textAlign: "center",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "32px",
  },
  subtitle: {
    margin: "0",
    fontSize: "16px",
    opacity: "0.8",
  },
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  menuCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "25px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  menuCardHover: {
    backgroundColor: "#f9f9f9",
    borderColor: "#e74c3c",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    transform: "translateY(-2px)",
  },
  menuIcon: {
    fontSize: "40px",
    marginBottom: "15px",
    display: "block",
  },
  menuTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
  },
  menuDesc: {
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.5",
  },
  comingSoon: {
    backgroundColor: "#f0f0f0",
    color: "#999",
    cursor: "not-allowed",
    opacity: "0.6",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "3px",
    fontSize: "11px",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verify admin role
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);

  const menuItems = [
    {
      id: "movies",
      icon: "🎬",
      title: "Manage Movies",
      description: "Add, edit, or remove movies from the system",
      path: "/admin/movies",
    },
    {
      id: "promotions",
      icon: "🎉",
      title: "Manage Promotions",
      description: "Create and manage promotional campaigns",
      path: "/admin/promotions",
    },
    {
      id: "users",
      icon: "👥",
      title: "Manage Users",
      description: "View and manage customer accounts",
      path: "/admin/users",
    },
    {
      id: "showtimes",
      icon: "🕐",
      title: "Manage Showtimes",
      description: "Configure movie showtimes and schedules",
      path: "/admin/showtimes",
    },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Manage cinema operations and content</p>
          </div>

          <div style={styles.menuGrid}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                style={styles.menuCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.menuCardHover.backgroundColor;
                  e.currentTarget.style.borderColor = styles.menuCardHover.borderColor;
                  e.currentTarget.style.boxShadow = styles.menuCardHover.boxShadow;
                  e.currentTarget.style.transform = styles.menuCardHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.menuCard.backgroundColor;
                  e.currentTarget.style.borderColor = "#ddd";
                  e.currentTarget.style.boxShadow = styles.menuCard.boxShadow;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={() => handleMenuClick(item.path)}
              >
                <span style={styles.menuIcon}>{item.icon}</span>
                <div style={styles.menuTitle}>{item.title}</div>
                <div style={styles.menuDesc}>{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
