import React from "react";

export default function CallToAction({
  heading,
  body,
  buttonText = "Learn More",
  buttonUrl = "#",
  variant = "primary",
}) {
  const isPrimary = variant === "primary";

  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        backgroundColor: isPrimary ? "#0f62fe" : "#f4f4f4",
        color: isPrimary ? "#fff" : "#161616",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {heading && <h2 style={{ fontSize: "1.75rem", marginBottom: 12 }}>{heading}</h2>}
        {body && <p style={{ fontSize: "1rem", marginBottom: 24, opacity: 0.9 }}>{body}</p>}
        <a
          href={buttonUrl}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: isPrimary ? "#fff" : "#0f62fe",
            color: isPrimary ? "#0f62fe" : "#fff",
            textDecoration: "none",
            fontWeight: 600,
            borderRadius: 4,
          }}
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}
