import { useParams } from "react-router-dom";

export default function MovieDetails() {
  const { id } = useParams();

  return (
    <div>
      <h1>Movie Details</h1>
      <p>Movie ID: {id}</p>

      <section style={{ marginTop: 24 }}>
        <h2>Description</h2>
        <p>(Movie description will go here)</p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Showtimes</h2>
        <button style={{ marginRight: 8 }}>2:00 PM</button>
        <button style={{ marginRight: 8 }}>5:00 PM</button>
        <button>8:00 PM</button>
      </section>
    </div>
  );
}