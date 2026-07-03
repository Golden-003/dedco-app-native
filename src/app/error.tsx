"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur Dedcco:", error);
  }, [error]);

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
          fontSize: "72px",
          fontWeight: 700,
          color: "#bf793b",
          marginBottom: "16px",
          fontFamily: "Georgia, serif",
        }}
      >
        Oups
      </div>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "#1e1813",
        }}
      >
        Une erreur est survenue
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "#5b5048",
          marginBottom: "24px",
          maxWidth: "400px",
        }}
      >
        Nous nous excusons pour ce désagrément. Vous pouvez réessayer ou retourner
        à l'accueil.
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={reset}
          style={{
            background: "#bf793b",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            background: "transparent",
            color: "#bf793b",
            border: "2px solid #bf793b",
            padding: "8px 18px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
