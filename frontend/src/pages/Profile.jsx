import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  changePassword,
  getProfile,
  updateProfile,
  getAddress,
  saveAddress,
  deleteAddress,
  getPaymentCards,
  addPaymentCard,
  deletePaymentCard,
  getFavorites,
} from "../api/auth";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);
  const [paymentCards, setPaymentCards] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    promotionSubscribed: false,
  });

  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [cardData, setCardData] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadAllData();
  }, [navigate]);

  const loadAllData = async () => {
    try {
      const [profileData, addressData, cardsData, favoritesData] = await Promise.all([
        getProfile(),
        getAddress().catch(() => null),
        getPaymentCards().catch(() => []),
        getFavorites().catch(() => []),
      ]);

      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phone: profileData.phone || "",
        promotionSubscribed: profileData.promotionSubscribed || false,
      });

      setAddress(addressData && Object.keys(addressData).length > 0 ? addressData : null);
      if (addressData && Object.keys(addressData).length > 0) {
        setAddressData(addressData);
      }

      setPaymentCards(cardsData || []);
      setFavorites(favoritesData || []);
    } catch (err) {
      setError("Failed to load data");
      if (err.message.includes("401")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await updateProfile(formData);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      loadAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await saveAddress(addressData);
      setSuccess("Address saved successfully");
      setAddress(addressData);
      loadAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAddress = async () => {
    if (!window.confirm("Delete this address?")) return;
    setError("");
    setSuccess("");
    try {
      await deleteAddress();
      setSuccess("Address deleted");
      setAddress(null);
      setAddressData({ street: "", city: "", state: "", zipCode: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await addPaymentCard(cardData);
      setSuccess("Payment card added successfully");
      setCardData({ cardHolderName: "", cardNumber: "", expiryDate: "" });
      loadAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Delete this payment card?")) return;
    setError("");
    setSuccess("");
    try {
      await deletePaymentCard(cardId);
      setSuccess("Card deleted");
      loadAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess(result.message || "Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.page}>
          <div style={styles.card}>
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1>My Profile</h1>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab("info")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "info" ? styles.tabActive : {}),
              }}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("address")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "address" ? styles.tabActive : {}),
              }}
            >
              Address
            </button>
            <button
              onClick={() => setActiveTab("cards")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "cards" ? styles.tabActive : {}),
              }}
            >
              Payment Cards
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "favorites" ? styles.tabActive : {}),
              }}
            >
              Favorites ({favorites.length})
            </button>
          </div>

          <div style={styles.card}>
            {activeTab === "info" && (
              <div>
                {!isEditing ? (
                  <div>
                    <div style={styles.row}>
                      <strong>First Name:</strong> <span>{profile?.firstName}</span>
                    </div>
                    <div style={styles.row}>
                      <strong>Last Name:</strong> <span>{profile?.lastName}</span>
                    </div>
                    <div style={styles.row}>
                      <strong>Email:</strong> <span>{profile?.email}</span>
                    </div>
                    <div style={styles.row}>
                      <strong>Phone:</strong> <span>{profile?.phone || "Not provided"}</span>
                    </div>
                    <div style={styles.row}>
                      <strong>Promotion Emails:</strong> <span>{profile?.promotionSubscribed ? "✅ Subscribed" : "❌ Not subscribed"}</span>
                    </div>
                    <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} style={styles.form}>
                    <label style={styles.label}>
                      First Name <span style={{ color: "red" }}>*</span>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        style={styles.input}
                      />
                    </label>

                    <label style={styles.label}>
                      Last Name <span style={{ color: "red" }}>*</span>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        style={styles.input}
                      />
                    </label>

                    <label style={styles.label}>
                      Phone
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer", fontWeight: 500 }}>
                      <input
                        type="checkbox"
                        name="promotionSubscribed"
                        checked={formData.promotionSubscribed}
                        onChange={(e) => setFormData((prev) => ({ ...prev, promotionSubscribed: e.target.checked }))}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                      />
                      Subscribe to promotion emails
                    </label>

                    <div style={styles.buttonGroup}>
                      <button type="submit" style={styles.saveButton}>
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        style={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <hr style={styles.sectionDivider} />
                <form onSubmit={handlePasswordSubmit} style={styles.form}>
                  <h3>Change Password</h3>

                  <label style={styles.label}>
                    Current Password <span style={{ color: "red" }}>*</span>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      style={styles.input}
                    />
                  </label>

                  <label style={styles.label}>
                    New Password <span style={{ color: "red" }}>*</span>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      style={styles.input}
                    />
                  </label>

                  <label style={styles.label}>
                    Confirm New Password <span style={{ color: "red" }}>*</span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      style={styles.input}
                    />
                  </label>

                  <button type="submit" style={styles.saveButton}>
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {activeTab === "address" && (
              <div>
                {address && (
                  <div>
                    <h3>Current Address</h3>
                    <div style={styles.row}>
                      <strong>Street:</strong> <span>{address.street}</span>
                    </div>
                    <div style={styles.row}>
                      <strong>City:</strong> <span>{address.city}</span>
                    </div>
                    <div style={styles.row}>
                      <strong>State:</strong> <span>{address.state}</span>
                    </div>
                    <div style={styles.row}>
                      <strong>Zip Code:</strong> <span>{address.zipCode}</span>
                    </div>
                    <button
                      onClick={handleDeleteAddress}
                      style={styles.deleteButton}
                    >
                      Delete Address
                    </button>
                    <hr />
                  </div>
                )}

                <form onSubmit={handleSaveAddress} style={styles.form}>
                  <h3>{address ? "Update Address" : "Add Address"}</h3>

                  <label style={styles.label}>
                    Street <span style={{ color: "red" }}>*</span>
                    <input
                      type="text"
                      name="street"
                      value={addressData.street}
                      onChange={handleAddressChange}
                      required
                      style={styles.input}
                    />
                  </label>

                  <label style={styles.label}>
                    City <span style={{ color: "red" }}>*</span>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      required
                      style={styles.input}
                    />
                  </label>

                  <label style={styles.label}>
                    State <span style={{ color: "red" }}>*</span>
                    <input
                      type="text"
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      required
                      style={styles.input}
                    />
                  </label>

                  <label style={styles.label}>
                    Zip Code <span style={{ color: "red" }}>*</span>
                    <input
                      type="text"
                      name="zipCode"
                      value={addressData.zipCode}
                      onChange={handleAddressChange}
                      required
                      style={styles.input}
                    />
                  </label>

                  <button type="submit" style={styles.saveButton}>
                    Save Address
                  </button>
                </form>
              </div>
            )}

            {activeTab === "cards" && (
              <div>
                <h3>Payment Cards (Max 3)</h3>
                {paymentCards.length > 0 && (
                  <div>
                    {paymentCards.map((card) => (
                      <div key={card.id} style={styles.cardItem}>
                        <strong>{card.cardHolderName}</strong> - {card.cardNumber}
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Expires: {card.expiryDate}
                        </div>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <hr />
                  </div>
                )}

                {paymentCards.length < 3 && (
                  <form onSubmit={handleAddCard} style={styles.form}>
                    <h4>{paymentCards.length > 0 ? "Add Another Card" : "Add Payment Card"}</h4>

                    <label style={styles.label}>
                      Cardholder Name <span style={{ color: "red" }}>*</span>
                      <input
                        type="text"
                        name="cardHolderName"
                        value={cardData.cardHolderName}
                        onChange={handleCardChange}
                        required
                        style={styles.input}
                      />
                    </label>

                    <label style={styles.label}>
                      Card Number <span style={{ color: "red" }}>*</span>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234567890123456"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        required
                        style={styles.input}
                      />
                    </label>

                    <label style={styles.label}>
                      Expiry Date (MM/YY) <span style={{ color: "red" }}>*</span>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="12/25"
                        value={cardData.expiryDate}
                        onChange={handleCardChange}
                        required
                        style={styles.input}
                      />
                    </label>

                    <button type="submit" style={styles.saveButton}>
                      Add Card
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <h3>My Favorite Movies</h3>
                {favorites.length > 0 ? (
                  <div style={styles.favoritesList}>
                    {favorites.map((movie) => (
                      <div key={movie.id} style={styles.favoriteItem}>
                        <img src={movie.posterUrl} alt={movie.title} loading="lazy" style={styles.poster} />
                        <h4>{movie.title}</h4>
                        <p style={{ fontSize: "12px" }}>{movie.rating}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No favorites yet. Add movies from the browse page!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    padding: "20px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "2px solid #ddd",
    flexWrap: "wrap",
  },
  tabButton: {
    padding: "10px 20px",
    border: "none",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    borderRadius: "4px 4px 0 0",
  },
  tabActive: {
    backgroundColor: "#222",
    color: "white",
  },
  row: {
    marginBottom: "12px",
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-between",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "600",
    gap: "6px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  sectionDivider: {
    margin: "24px 0",
    border: 0,
    borderTop: "1px solid #ddd",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  editButton: {
    padding: "8px 16px",
    backgroundColor: "#222",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "8px 16px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 16px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "8px 16px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    backgroundColor: "#fee",
    color: "crimson",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  success: {
    backgroundColor: "#efe",
    color: "green",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  cardItem: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "10px",
    border: "1px solid #ddd",
  },
  favoritesList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },
  favoriteItem: {
    textAlign: "center",
  },
  poster: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "4px",
    marginBottom: "8px",
  },
};
