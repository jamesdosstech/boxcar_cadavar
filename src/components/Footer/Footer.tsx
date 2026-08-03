import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        padding: "1.5rem 1rem",
        textAlign: "center",
        fontSize: "0.85rem",
        opacity: 0.75,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        marginTop: "2rem",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.25rem",
          flexWrap: "wrap",
          marginBottom: "0.5rem",
        }}
      >
        <Link to="/terms">Terms of Service</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/refund-policy">Refund &amp; Returns</Link>
      </nav>
      <p>© {year} Doosetrain. All rights reserved.</p>
    </footer>
  );
}
