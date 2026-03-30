import React from "react";

export default function BlogCard({ title, description, image, author, date, linkUrl }) {
  const card = (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "#fff",
        transition: "box-shadow 0.2s",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {image && (
        <img
          src={image}
          alt={title || ""}
          style={{ width: "100%", height: 200, objectFit: "cover" }}
        />
      )}
      <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
        {title && (
          <h3 style={{ fontSize: "1.25rem", marginBottom: 8, marginTop: 0 }}>{title}</h3>
        )}
        {description && (
          <p style={{ fontSize: "0.875rem", color: "#525252", flex: 1 }}>{description}</p>
        )}
        <div style={{ fontSize: "0.75rem", color: "#8d8d8d", marginTop: 12 }}>
          {author && <span>{author}</span>}
          {author && date && <span> &middot; </span>}
          {date && <span>{date}</span>}
        </div>
      </div>
    </div>
  );

  if (linkUrl) {
    return (
      <a href={linkUrl} style={{ textDecoration: "none", color: "inherit" }}>
        {card}
      </a>
    );
  }

  return card;
}
