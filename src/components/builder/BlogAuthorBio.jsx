import React from "react";

export default function BlogAuthorBio({ name, avatar, bio, role }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 24,
        backgroundColor: "#f4f4f4",
        borderRadius: 4,
        maxWidth: 800,
        margin: "32px auto",
      }}
    >
      {avatar && (
        <img
          src={avatar}
          alt={name || "Author"}
          style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
        />
      )}
      <div>
        {name && <p style={{ fontWeight: 600, margin: "0 0 4px 0" }}>{name}</p>}
        {role && <p style={{ fontSize: "0.875rem", color: "#525252", margin: "0 0 8px 0" }}>{role}</p>}
        {bio && <p style={{ fontSize: "0.875rem", margin: 0 }}>{bio}</p>}
      </div>
    </div>
  );
}
