import React from "react";

export default function BlogHero({ title, subtitle, backgroundImage, alignment = "center" }) {
  return (
    <div
      style={{
        position: "relative",
        padding: "80px 24px",
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: backgroundImage ? undefined : "#262626",
        color: "#fff",
        textAlign: alignment,
      }}
    >
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />
      )}
      <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
        {title && <h1 style={{ fontSize: "2.5rem", marginBottom: 16 }}>{title}</h1>}
        {subtitle && <p style={{ fontSize: "1.25rem", opacity: 0.85 }}>{subtitle}</p>}
      </div>
    </div>
  );
}
