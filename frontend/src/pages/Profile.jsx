import Navbar from "../components/Navbar";
<Navbar />
export default function Profile() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Profile</h1>

        <div style={styles.row}>
          <strong>First Name:</strong> <span>Sample</span>
        </div>
        <div style={styles.row}>
          <strong>Last Name:</strong> <span>User</span>
        </div>
        <div style={styles.row}>
          <strong>Email:</strong> <span>user@example.com</span>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <h2 style={styles.sectionTitle}>Favorite Movies</h2>
        <ul style={styles.list}>
          <li>Neon Heist</li>
          <li>Lunar Letters</li>
        </ul>
      </div>
    </div>
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
    maxWidth: "500px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    marginBottom: "10px",
  },
  row: {
    marginBottom: "12px",
    fontSize: "16px",
  },
  list: {
    paddingLeft: "20px",
  },
};