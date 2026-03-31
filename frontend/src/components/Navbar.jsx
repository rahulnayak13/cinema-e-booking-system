import { Link } from "react-router-dom";

const navLinkStyle = {
  textDecoration: "none",
  color: "#222",
  fontWeight: 600,
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  background: "white",
};

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        padding: "24px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700 }}>Cinema E-Booking</div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/" style={navLinkStyle}>
          Home
        </Link>
        <Link to="/login" style={navLinkStyle}>
          Login
        </Link>
        <Link to="/register" style={navLinkStyle}>
          Register
        </Link>
        <Link to="/profile" style={navLinkStyle}>
          Profile
        </Link>
      </div>
    </div>
  );
}