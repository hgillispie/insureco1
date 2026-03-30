import React from "react";

export default function BlogCardGrid({ columns = 3, gap = 24, children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        padding: "32px 24px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}
