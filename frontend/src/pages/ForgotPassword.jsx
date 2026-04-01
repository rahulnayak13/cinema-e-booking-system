// src/pages/ForgotPassword.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetToken("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/forgot-password?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      if (data.debug_token) {
        setResetToken(data.debug_token);
        setMessage("Reset token generated! Click the link below to reset your password.");
      } else {
        setMessage(data.message || "If an account exists with this email, you will receive a reset link.");
        setEmail("");
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Forgot Password</h1>
          <p style={styles.description}>
            Enter your email address to reset your password.
          </p>

          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Email Address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your email"
                disabled={loading}
              />
            </label>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {resetToken && (
            <div style={styles.tokenContainer}>
              <p style={styles.tokenLabel}>Reset Link:</p>
              <a 
                href={`/reset-password?token=${resetToken}`}
                style={styles.tokenLink}
              >
                Click here to reset your password
              </a>
              <p style={styles.tokenHint}>
                Or copy this token: <code>{resetToken}</code>
              </p>
            </div>
          )}

          <div style={styles.backLink}>
            <a href="/login">← Back to Login</a>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
  },
  description: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "600",
    gap: "6px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#222",
    color: "white",
    cursor: "pointer",
  },
  error: {
    backgroundColor: "#fee",
    color: "crimson",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  success: {
    backgroundColor: "#efe",
    color: "green",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  tokenContainer: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    textAlign: "center",
  },
  tokenLabel: {
    margin: "0 0 8px 0",
    fontWeight: "bold",
    fontSize: "14px",
  },
  tokenLink: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "#10b981",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  tokenHint: {
    fontSize: "12px",
    color: "#666",
    wordBreak: "break-all",
    margin: "0",
  },
  backLink: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
};