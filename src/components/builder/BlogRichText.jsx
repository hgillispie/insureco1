import React from "react";

export default function BlogRichText({ content }) {
  if (!content) return null;

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "32px 24px",
        lineHeight: 1.7,
        fontSize: "1rem",
        color: "#161616",
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
