import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPaymentCards } from "../api/auth";

const API = "http://localhost:8080";
const PRICES = { adult: 12.5, child: 9.0, senior: 10.0 };

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const {
    movieTitle = "",
    showtimeLabel = "",
    seats = [],
    tickets = { adult: 1, child: 0, senior: 0 },
    ticketSubtotal = 0,
    bookingFee = 0,
    tax = 0,
    subtotal = 0,
    email = "",
    showtimeId,
    seatIds = [],
  } = state;

  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState("");
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null); // null = enter new card
  const [cardsLoading, setCardsLoading] = useState(true);

  useEffect(() => {
    getPaymentCards()
      .then((cards) => {
        const list = cards || [];
        setSavedCards(list);
        if (list.length > 0) setSelectedCardId(list[0].id);
      })
      .catch(() => setSavedCards([]))
      .finally(() => setCardsLoading(false));
  }, []);

  const formatCard = (val) => val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ showtimeId, seatIds, tickets, totalPrice: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Booking failed. Please try again."); setSubmitting(false); return; }
      setConfirmed(data);
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  if (confirmed) {
    return (
      <div style={{ maxWidth: 520, margin: "60px auto", textAlign: "center", padding: "0 16px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#15803d", marginBottom: 8 }}>Booking Confirmed!</h1>
        <p style={{ color: "#374151", marginBottom: 4 }}>Booking ID: <strong>#{confirmed.bookingId}</strong></p>
        <p style={{ color: "#6b7280", marginBottom: 6 }}>Movie: <strong>{movieTitle}</strong></p>
        <p style={{ color: "#6b7280", marginBottom: 6 }}>Seats: <strong>{seats.join(", ")}</strong></p>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>A confirmation has been sent to <strong>{email}</strong>.</p>
        <button onClick={() => navigate("/")} style={{ padding: "10px 28px", background: "#1d4ed8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 15 }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Payment</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        {movieTitle && <strong>{movieTitle}</strong>}{showtimeLabel && ` · ${showtimeLabel}`}
      </p>

      {/* Progress — static, showing step 4 active */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
        {["Tickets", "Seats", "Summary", "Payment"].map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: i === 3 ? "#1d4ed8" : "#22c55e",
                color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14
              }}>
                {i < 3 ? "✓" : 4}
              </div>
              <span style={{ fontSize: 12, marginTop: 4, color: i === 3 ? "#1d4ed8" : "#6b7280", whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: 2, background: "#22c55e", margin: "0 8px", marginBottom: 20 }} />}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}>
        {/* Left: Order summary */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 20px", background: "white" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, borderBottom: "1px solid #f3f4f6", paddingBottom: 8 }}>Order Summary</h2>
          <div style={{ fontSize: 14, marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{movieTitle}</div>
            <div style={{ color: "#6b7280" }}>{showtimeLabel}</div>
          </div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>
            <strong>Seats:</strong> {seats.join(", ")}
          </div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>
            {tickets.adult > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}><span>{tickets.adult}× Adult <span style={{ color: "#9ca3af" }}>@ ${PRICES.adult.toFixed(2)} ea.</span></span><span>${(tickets.adult * PRICES.adult).toFixed(2)}</span></div>}
            {tickets.child > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}><span>{tickets.child}× Child <span style={{ color: "#9ca3af" }}>@ ${PRICES.child.toFixed(2)} ea.</span></span><span>${(tickets.child * PRICES.child).toFixed(2)}</span></div>}
            {tickets.senior > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}><span>{tickets.senior}× Senior <span style={{ color: "#9ca3af" }}>@ ${PRICES.senior.toFixed(2)} ea.</span></span><span>${(tickets.senior * PRICES.senior).toFixed(2)}</span></div>}
          </div>
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 8 }}>
            {ticketSubtotal > 0 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 2 }}>
                  <span>Tickets subtotal</span><span>${ticketSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 2 }}>
                  <span>Online booking fee</span><span>${bookingFee.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
              </>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15 }}>
              <span>Total</span><span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
          {email && <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>Confirmation → <strong>{email}</strong></div>}
        </div>

        {/* Right: Payment form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Payment</h2>

          {/* Saved cards selector */}
          {!cardsLoading && savedCards.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Saved Cards</div>
              {savedCards.map(c => (
                <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: `1px solid ${selectedCardId === c.id ? "#1d4ed8" : "#e5e7eb"}`, borderRadius: 8, cursor: "pointer", marginBottom: 6, background: selectedCardId === c.id ? "#eff6ff" : "white" }}>
                  <input
                    type="radio"
                    name="cardChoice"
                    checked={selectedCardId === c.id}
                    onChange={() => setSelectedCardId(c.id)}
                    style={{ accentColor: "#1d4ed8" }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.cardHolderName}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{c.cardNumber} · Expires {c.expiryDate}</div>
                  </div>
                </label>
              ))}
              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: `1px solid ${selectedCardId === null ? "#1d4ed8" : "#e5e7eb"}`, borderRadius: 8, cursor: "pointer", background: selectedCardId === null ? "#eff6ff" : "white" }}>
                <input
                  type="radio"
                  name="cardChoice"
                  checked={selectedCardId === null}
                  onChange={() => setSelectedCardId(null)}
                  style={{ accentColor: "#1d4ed8" }}
                />
                <span style={{ fontSize: 13, fontWeight: 600 }}>+ Enter a new card</span>
              </label>
            </div>
          )}

          {/* Manual card entry — shown when no saved card selected or no saved cards exist */}
          {(cardsLoading || savedCards.length === 0 || selectedCardId === null) && (
            <>
              {savedCards.length === 0 && !cardsLoading && (
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: -8 }}>This is a mockup — no real charges will be made.</div>
              )}

              {error && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "8px 12px", color: "#b91c1c", fontSize: 13 }}>{error}</div>}

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Cardholder Name <span style={{ color: "#ef4444" }}>*</span></label>
                <input
                  required
                  value={card.name}
                  onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                  placeholder="John Smith"
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Card Number <span style={{ color: "#ef4444" }}>*</span></label>
                <input
                  required
                  value={card.number}
                  onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, fontFamily: "monospace", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Expiry <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    required
                    value={card.expiry}
                    onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, fontFamily: "monospace", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>CVV <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    required
                    value={card.cvv}
                    onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    placeholder="123"
                    maxLength={4}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, fontFamily: "monospace", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Error shown when a saved card is selected */}
          {error && selectedCardId !== null && savedCards.length > 0 && (
            <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "8px 12px", color: "#b91c1c", fontSize: 13 }}>{error}</div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <button type="button" onClick={() => navigate(-1)} style={{ padding: "10px 20px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>← Back</button>
            <button type="submit" disabled={submitting} style={{ padding: "10px 24px", background: submitting ? "#d1d5db" : "#1d4ed8", color: "white", border: "none", borderRadius: 8, cursor: submitting ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 15 }}>
              {submitting ? "Processing…" : `Pay $${subtotal.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
