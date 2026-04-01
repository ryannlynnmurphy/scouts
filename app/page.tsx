import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1a1714",
        color: "#f8f0e3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        fontFamily: "Georgia, serif",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "4rem",
          fontWeight: 700,
          color: "#C9A96E",
          marginBottom: "16px",
          letterSpacing: "0.15em",
        }}
      >
        SCOUTS
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          color: "rgba(248, 240, 227, 0.7)",
          marginBottom: "8px",
          textAlign: "center",
          maxWidth: "480px",
        }}
      >
        An interactive narrative game based on the play by Ryann Murphy
      </p>
      <p
        style={{
          fontSize: "0.8rem",
          color: "rgba(248, 240, 227, 0.35)",
          marginBottom: "48px",
        }}
      >
        Content warning: homophobic language, bullying, toxic masculinity
      </p>
      <Link
        href="/play"
        style={{
          padding: "14px 48px",
          background: "transparent",
          border: "1px solid #C9A96E",
          color: "#C9A96E",
          fontFamily: "Georgia, serif",
          fontSize: "1.1rem",
          textDecoration: "none",
          letterSpacing: "0.1em",
          transition: "all 0.3s",
          borderRadius: "2px",
        }}
      >
        Begin
      </Link>
      <p
        style={{
          fontSize: "0.7rem",
          color: "rgba(248, 240, 227, 0.2)",
          marginTop: "80px",
          textAlign: "center",
        }}
      >
        Read at Juilliard. Tracking toward Off-Broadway.
      </p>
    </main>
  );
}
