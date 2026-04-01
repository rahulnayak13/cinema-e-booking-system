import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const navLinkStyle = {
  textDecoration: "none",
  color: "#222",
  fontWeight: 600,
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check login status on component mount and when localStorage changes
  useEffect(() => {
    checkLoginStatus();
    
    // Listen for storage changes (in case token is updated in another tab)
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    console.log("Checking login status:", { token: !!token, userStr });
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserRole(user.role);
      } catch (e) {
        console.error("Failed to parse user data", e);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Update state
    setIsLoggedIn(false);
    setUserRole(null);
    
    // Redirect to login
    navigate("/login");
  };

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
      <div style={{ fontSize: 24, fontWeight: 700 }}>
        <Link to="/" style={{ textDecoration: "none", color: "#222" }}>
          Cinema E-Booking
        </Link>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/" style={navLinkStyle}>
          Home
        </Link>
        
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={navLinkStyle}>
              Login
            </Link>
            <Link to="/register" style={navLinkStyle}>
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={navLinkStyle}>
              Profile
            </Link>
            {userRole === "ADMIN" && (
              <Link to="/admin" style={navLinkStyle}>
                Admin
              </Link>
            )}
            <button onClick={handleLogout} style={navLinkStyle}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}