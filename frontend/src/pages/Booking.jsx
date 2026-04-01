import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMovieById } from "../api/movies";

const PRICES = { ADULT: 12.5, CHILD: 9.0, SENIOR: 10.0 };

function Seat({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        border: "1px solid #ddd",
        background: selected ? "#e5e7eb" : "white",
        cursor: "pointer",
        fontSize: 12,
      }}
      title={label}
    >
      {label}
    </button>
  );
}

export default function Booking() {
  const [params] = useSearchParams();
  const movieId = params.get("movieId");
  const showtime = params.get("showtime") || "";

  const [movie, setMovie] = useState(null);

  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [senior, setSenior] = useState(0);

  const [selectedSeats, setSelectedSeats] = useState(new Set());

  useEffect(() => {
    if (!movieId) return;
    fetchMovieById(movieId).then(setMovie).catch(() => setMovie(null));
  }, [movieId]);

  const total =
    adult * PRICES.ADULT + child * PRICES.CHILD + senior * PRICES.SENIOR;

  const rows = ["A", "B", "C", "D", "E"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  const toggleSeat = (label) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div>
      <h1>Booking (Prototype)</h1>

      <div style={{ marginTop: 10, padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
        <div style={{ fontWeight: 700 }}>{movie ? movie.title : "Loading movie..."}</div>
        <div style={{ color: "#666" }}>Showtime: {showtime}</div>
      </div>

      <h2 style={{ marginTop: 18 }}>Tickets</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <label>
          Adult (${PRICES.ADULT})
          <input type="number" min="0" value={adult} onChange={(e) => setAdult(+e.target.value)} />
        </label>
        <label>
          Child (${PRICES.CHILD})
          <input type="number" min="0" value={child} onChange={(e) => setChild(+e.target.value)} />
        </label>
        <label>
          Senior (${PRICES.SENIOR})
          <input type="number" min="0" value={senior} onChange={(e) => setSenior(+e.target.value)} />
        </label>
      </div>

      <div style={{ marginTop: 10, fontWeight: 700 }}>Total: ${total.toFixed(2)}</div>

      <h2 style={{ marginTop: 18 }}>Select Seats</h2>
      <div style={{ marginBottom: 8, color: "#666" }}>Screen</div>
      <div style={{ height: 6, background: "#eee", borderRadius: 999, marginBottom: 12 }} />

      <div style={{ display: "grid", gap: 8 }}>
        {rows.map((r) => (
          <div key={r} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 22, color: "#666" }}>{r}</div>
            {cols.map((c) => {
              const label = `${r}${c}`;
              return (
                <Seat
                  key={label}
                  label={label}
                  selected={selectedSeats.has(label)}
                  onClick={() => toggleSeat(label)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, color: "#666" }}>
        Selected seats: {Array.from(selectedSeats).sort().join(", ") || "None"}
      </div>
    </div>
  );
}