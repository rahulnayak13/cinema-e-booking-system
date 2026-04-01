// src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Log the token when component loads
  useEffect(() => {
    console.log("Reset password page loaded");
    console.log("Token from URL:", token);
    console.log("Full URL:", window.location.href);
    
    if (!token) {
      setError("No reset token provided. Please use the link from your email.");
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate password length
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    if (!token) {
      setError("No reset token provided");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Sending reset request with token from URL:", token);
      
      const response = await fetch(
        `http://localhost:8080/api/auth/reset-password?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: formData.newPassword,
          }),
        }
      );
      
      const data = await response.json();
      console.log("Reset response:", response.status, data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }
      
      setMessage(data.message || "Password reset successful! Redirecting to login...");
      
      // Clear form
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      console.error("Reset error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // If no token, show error and link to forgot password
  if (!token && !loading) {
    return (
      <>
        <Navbar />
        <div style={styles.page}>
          <div style={styles.card}>
            <h1 style={styles.title}>Reset Password</h1>
            <div style={styles.error}>
              No reset token provided. Please use the link from your email.
            </div>
            <div style={styles.backLink}>
              <a href="/forgot-password" style={styles.link}>
                Request a new password reset
              </a>
            </div>
            <div style={styles.backLink}>
              <a href="/login" style={styles.link}>
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Reset Password</h1>
          <p style={styles.description}>
            Enter your new password below.
          </p>
          
          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              New Password
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength="8"
                style={styles.input}
                placeholder="Minimum 8 characters"
              />
            </label>
            
            <label style={styles.label}>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Confirm your new password"
              />
            </label>
            
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          
          <div style={styles.backLink}>
            <a href="/login" style={styles.link}>Back to Login</a>
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
  backLink: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "#222",
    textDecoration: "underline",
  },
};