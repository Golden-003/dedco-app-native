import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf8f5",
        color: "#1e1813",
        fontFamily: "system-ui, sans-serif",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "96px",
          fontWeight: 700,
          color: "#bf793b",
          marginBottom: "16px",
          fontFamily: "Georgia, serif",
          lineHeight: 1,
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "#1e1813",
        }}
      >
        Page introuvable
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "#5b5048",
          marginBottom: "24px",
          maxWidth: "400px",
        }}
      >
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        style={{
          background: "#bf793b",
          color: "white",
          padding: "10px 20px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
