import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Currently Playing</h2>
        <p>(Movie cards will go here)</p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Coming Soon</h2>
        <p>(Movie cards will go here)</p>
      </section>

      <div style={{ marginTop: 40 }}>
        <Link to="/movies/1">Go to Sample Movie</Link>
      </div>
    </div>
  );
}