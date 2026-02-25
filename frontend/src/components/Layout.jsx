import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div style={{ fontFamily: "system-ui" }}>
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold" }}>
          🎬 Cinema E-Booking
        </Link>

        <nav>
          <Link to="/" style={{ marginRight: 16 }}>
            Home
          </Link>
        </nav>
      </header>

      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}