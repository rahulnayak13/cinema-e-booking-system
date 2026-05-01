import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchMovieById } from "../api/movies";

const API = "http://localhost:8080";
const PRICES = { adult: 12.5, child: 9.0, senior: 10.0 };
const TAX_RATE = 0.08;             // 8% sales tax
const BOOKING_FEE_PER_TICKET = 1.50; // online booking fee per ticket

const STEP_LABELS = ["Tickets", "Seats", "Summary", "Payment"];

function StepIndicator({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
      {STEP_LABELS.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEP_LABELS.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i === step ? "#1d4ed8" : i < step ? "#22c55e" : "#e5e7eb",
              color: i <= step ? "white" : "#9ca3af",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14
            }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 12, marginTop: 4, color: i === step ? "#1d4ed8" : "#6b7280", whiteSpace: "nowrap" }}>
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < step ? "#22c55e" : "#e5e7eb", margin: "0 8px", marginBottom: 20 }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Counter({ label, price, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", border: "1px solid #e5e7eb", borderRadius: 12, background: "white" }}>
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div style={{ color: "#6b7280", fontSize: 14 }}>${price.toFixed(2)} each</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => onChange(Math.max(0, value - 1))} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontSize: 18, fontWeight: 700, lineHeight: 1 }}>−</button>
        <span style={{ fontWeight: 700, fontSize: 18, minWidth: 24, textAlign: "center" }}>{value}</span>
        <button onClick={() => onChange(value + 1)} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontSize: 18, fontWeight: 700, lineHeight: 1 }}>+</button>
      </div>
    </div>
  );
}

function SeatButton({ seat, selected, onClick }) {
  const bg = seat.booked ? "#ef4444" : selected ? "#1d4ed8" : "#f9fafb";
  const color = seat.booked || selected ? "white" : "#374151";
  const cursor = seat.booked ? "not-allowed" : "pointer";
  return (
    <button
      onClick={onClick}
      disabled={seat.booked}
      title={seat.booked ? `${seat.label} — Taken` : seat.label}
      style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${seat.booked ? "#ef4444" : selected ? "#1d4ed8" : "#d1d5db"}`, background: bg, color, cursor, fontSize: 11, fontWeight: 600 }}
    >
      {seat.label}
    </button>
  );
}

export default function Booking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const movieId = params.get("movieId");
  const showtimeId = params.get("showtimeId");
  const showtimeLabel = params.get("showtime") || "";
  const showroomId = params.get("showroomId");

  const [step, setStep] = useState(0);
  const [movie, setMovie] = useState(null);
  const [tickets, setTickets] = useState({ adult: 1, child: 0, senior: 0 });
  const [seats, setSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [selectedSeatIds, setSelectedSeatIds] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(null);
  const userRawInit = localStorage.getItem("user");
  const initEmail = userRawInit ? (() => { try { return JSON.parse(userRawInit).email || ""; } catch { return ""; } })() : "";
  const [confirmEmail, setConfirmEmail] = useState(initEmail);

  useEffect(() => {
    if (movieId) fetchMovieById(movieId).then(setMovie).catch(() => setMovie(null));
  }, [movieId]);

  const totalTickets = tickets.adult + tickets.child + tickets.senior;
  const subtotal = tickets.adult * PRICES.adult + tickets.child * PRICES.child + tickets.senior * PRICES.senior;
  const bookingFee = parseFloat((totalTickets * BOOKING_FEE_PER_TICKET).toFixed(2));
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const grandTotal = parseFloat((subtotal + bookingFee + tax).toFixed(2));

  // --- Step 1 → 2: load seat map ---
  const goToSeats = async () => {
    if (totalTickets === 0) { setError("Please select at least one ticket."); return; }
    setError("");
    setSeatsLoading(true);
    try {
      const res = await fetch(`${API}/api/showtimes/${showtimeId}/seats`);
      const data = await res.json();
      setSeats(data);
    } catch {
      setError("Failed to load seats. Please try again.");
      setSeatsLoading(false);
      return;
    }
    setSeatsLoading(false);
    setSelectedSeatIds(new Set());
    setStep(1);
  };

  const toggleSeat = (seat) => {
    if (seat.booked) return;
    setSelectedSeatIds((prev) => {
      const next = new Set(prev);
      if (next.has(seat.id)) {
        next.delete(seat.id);
      } else {
        if (next.size >= totalTickets) return prev;
        next.add(seat.id);
      }
      return next;
    });
  };

  // --- Step 2 → 3 ---
  const goToReview = () => {
    if (selectedSeatIds.size !== totalTickets) {
      setError(`Please select exactly ${totalTickets} seat${totalTickets > 1 ? "s" : ""}.`);
      return;
    }
    setError("");
    setStep(2);
  };

  // --- Step 3 → 4: proceed to payment ---
  const goToPayment = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("pendingBooking", JSON.stringify({ movieId, showtimeId, showtime: showtimeLabel, showroomId }));
      navigate(`/login?redirect=/booking?movieId=${movieId}&showtimeId=${showtimeId}&showtime=${encodeURIComponent(showtimeLabel)}&showroomId=${showroomId}`);
      return;
    }
    navigate("/payment", {
      state: {
        movieTitle: movie?.title,
        showtimeLabel: showtimeLabel.replace("T", " "),
        seats: selectedSeatObjects.map(s => s.label),
        tickets,
        ticketSubtotal: subtotal,
        bookingFee,
        tax,
        subtotal: grandTotal,
        email: confirmEmail,
        showtimeId: Number(showtimeId),
        seatIds: Array.from(selectedSeatIds),
      }
    });
  };

  // --- Step 3: submit booking ---
  const submitBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("pendingBooking", JSON.stringify({ movieId, showtimeId, showtime: showtimeLabel, showroomId }));
      navigate(`/login?redirect=/booking?movieId=${movieId}&showtimeId=${showtimeId}&showtime=${encodeURIComponent(showtimeLabel)}&showroomId=${showroomId}`);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ showtimeId: Number(showtimeId), seatIds: Array.from(selectedSeatIds), tickets, totalPrice: grandTotal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Booking failed."); setSubmitting(false); return; }
      setConfirmed(data);
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  if (confirmed) {
    return (
      <div style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#15803d", marginBottom: 8 }}>Booking Confirmed!</h1>
        <p style={{ color: "#374151", marginBottom: 4 }}>Booking ID: <strong>#{confirmed.bookingId}</strong></p>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>A confirmation will be sent to your registered email.</p>
        <button onClick={() => navigate("/")} style={{ padding: "10px 28px", background: "#1d4ed8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 15 }}>Back to Home</button>
      </div>
    );
  }

  const selectedSeatObjects = seats.filter(s => selectedSeatIds.has(s.id));
  const rows = [...new Set(seats.map(s => s.rowLabel))].sort();

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Book Tickets</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        {movie ? <strong>{movie.title}</strong> : "Loading..."} · {showtimeLabel.replace("T", " ")}
      </p>

      <StepIndicator step={step} />

      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", color: "#b91c1c", marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* ── STEP 1: Tickets ── */}
      {step === 0 && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Counter label="Adult" price={PRICES.adult} value={tickets.adult} onChange={(v) => setTickets(t => ({ ...t, adult: v }))} />
            <Counter label="Child" price={PRICES.child} value={tickets.child} onChange={(v) => setTickets(t => ({ ...t, child: v }))} />
            <Counter label="Senior" price={PRICES.senior} value={tickets.senior} onChange={(v) => setTickets(t => ({ ...t, senior: v }))} />
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 18 }}>Estimated Total: ${grandTotal.toFixed(2)}</span>
            <button onClick={goToSeats} disabled={seatsLoading || totalTickets === 0} style={{ padding: "10px 28px", background: totalTickets === 0 ? "#d1d5db" : "#1d4ed8", color: "white", border: "none", borderRadius: 8, cursor: totalTickets === 0 ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 15 }}>
              {seatsLoading ? "Loading seats…" : "Choose Seats →"}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Seat Map ── */}
      {step === 1 && (
        <div>
          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20, fontSize: 13, justifyContent: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ display: "inline-block", width: 16, height: 16, background: "#f9fafb", border: "1px solid #d1d5db", borderRadius: 4 }} />Available</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ display: "inline-block", width: 16, height: 16, background: "#1d4ed8", borderRadius: 4 }} />Selected</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ display: "inline-block", width: 16, height: 16, background: "#ef4444", borderRadius: 4 }} />Taken</span>
          </div>

          {/* Seat map — centered */}
          <div style={{ overflowX: "auto", paddingBottom: 8 }}>
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>

              {/* SCREEN bar — aligned to seat columns only */}
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 24, flexShrink: 0 }} />{/* spacer matches row label */}
                <div style={{
                  flex: 1,
                  padding: "7px 0",
                  background: "linear-gradient(180deg, #555 0%, #222 100%)",
                  color: "#fff",
                  borderRadius: "8px 8px 2px 2px",
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 4,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  minWidth: 300,
                }}>
                  S C R E E N
                </div>
              </div>

              {/* Perspective shadow under screen */}
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 24, flexShrink: 0 }} />
                <div style={{ flex: 1, height: 6, background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, transparent 100%)", borderRadius: "0 0 4px 4px", minWidth: 300 }} />
              </div>

              {/* Seat rows */}
              {rows.map(row => {
                const rowSeats = seats.filter(s => s.rowLabel === row).sort((a, b) => a.seatNumber - b.seatNumber);
                const half = Math.ceil(rowSeats.length / 2);
                const leftSeats = rowSeats.slice(0, half);
                const rightSeats = rowSeats.slice(half);
                return (
                  <div key={row} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ width: 24, fontWeight: 700, color: "#9ca3af", fontSize: 12, textAlign: "right", flexShrink: 0 }}>{row}</span>
                    {leftSeats.map(seat => (
                      <SeatButton key={seat.id} seat={seat} selected={selectedSeatIds.has(seat.id)} onClick={() => toggleSeat(seat)} />
                    ))}
                    {/* Center aisle */}
                    <div style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 1, height: 28, background: "#e5e7eb" }} />
                    </div>
                    {rightSeats.map(seat => (
                      <SeatButton key={seat.id} seat={seat} selected={selectedSeatIds.has(seat.id)} onClick={() => toggleSeat(seat)} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 16, color: "#6b7280", fontSize: 14 }}>
            Selected: {selectedSeatIds.size} / {totalTickets} · {selectedSeatObjects.map(s => s.label).join(", ") || "none"}
          </div>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => { setStep(0); setError(""); }} style={{ padding: "10px 22px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>← Back</button>
            <button onClick={goToReview} disabled={selectedSeatIds.size !== totalTickets} style={{ padding: "10px 28px", background: selectedSeatIds.size !== totalTickets ? "#d1d5db" : "#1d4ed8", color: "white", border: "none", borderRadius: 8, cursor: selectedSeatIds.size !== totalTickets ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 15 }}>
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Order Summary ── */}
      {step === 2 && (
        <div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px 22px", background: "white", marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, borderBottom: "1px solid #f3f4f6", paddingBottom: 10 }}>Order Summary</h2>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{movie?.title}</div>
              <div style={{ color: "#6b7280", fontSize: 14 }}>🕐 {showtimeLabel.replace("T", " ")}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Seats</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedSeatObjects.map(s => (
                  <span key={s.id} style={{ background: "#eff6ff", color: "#1d4ed8", borderRadius: 6, padding: "2px 10px", fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Tickets</div>
              {tickets.adult > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>{tickets.adult}× Adult <span style={{ color: "#9ca3af" }}>@ ${PRICES.adult.toFixed(2)} ea.</span></span><span>${(tickets.adult * PRICES.adult).toFixed(2)}</span></div>}
              {tickets.child > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>{tickets.child}× Child <span style={{ color: "#9ca3af" }}>@ ${PRICES.child.toFixed(2)} ea.</span></span><span>${(tickets.child * PRICES.child).toFixed(2)}</span></div>}
              {tickets.senior > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>{tickets.senior}× Senior <span style={{ color: "#9ca3af" }}>@ ${PRICES.senior.toFixed(2)} ea.</span></span><span>${(tickets.senior * PRICES.senior).toFixed(2)}</span></div>}
            </div>

            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
                <span>Tickets subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
                <span>Online booking fee ({totalTickets}× $1.50)</span><span>${bookingFee.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
                <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 17 }}>
                <span>Total</span><span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600, fontSize: 14, display: "block", marginBottom: 6 }}>Confirmation Email <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="email"
              value={confirmEmail}
              onChange={e => setConfirmEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Booking confirmation will be sent to this address.</div>
          </div>

          {!localStorage.getItem("token") && (
            <div style={{ padding: "10px 14px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, marginBottom: 20, fontSize: 14, color: "#92400e" }}>
              You must be logged in to complete the booking.
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => { setStep(1); setError(""); }} style={{ padding: "10px 22px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>← Back</button>
            <button onClick={goToPayment} style={{ padding: "10px 28px", background: "#1d4ed8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
              {localStorage.getItem("token") ? "Proceed to Payment →" : "Log In to Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}