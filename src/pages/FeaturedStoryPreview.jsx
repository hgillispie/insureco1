import React from "react";
import FeaturedStory from "../components/builder/FeaturedStory";

export default function FeaturedStoryPreview() {
  return (
    <div style={{ padding: "40px 24px", background: "var(--background-secondary)", minHeight: "100vh" }}>
      <h1 style={{ color: "var(--text-primary)", fontFamily: "var(--font-family-sans)", marginBottom: 8 }}>
        FeaturedStory — Builder Component Preview
      </h1>
      <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-family-sans)", marginBottom: 40 }}>
        This is a temporary preview route so you can see how the component looks before using it in Builder Publish.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 48, maxWidth: 760 }}>
        <section>
          <h2 style={{ color: "var(--text-secondary)", fontFamily: "var(--font-family-sans)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.32px", marginBottom: 16 }}>
            Default (Figma design)
          </h2>
          <FeaturedStory />
        </section>

        <section>
          <h2 style={{ color: "var(--text-secondary)", fontFamily: "var(--font-family-sans)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.32px", marginBottom: 16 }}>
            Custom Content Example
          </h2>
          <FeaturedStory
            label="NEW"
            heading="Company News"
            title="InsureCo Launches Next-Generation Claims Processing Platform"
            description="Our new AI-powered claims platform reduces processing time by 60%, delivering faster resolutions and a better experience for policyholders."
            readTime="3 min read"
            category="Product Updates"
            buttonText="Read announcement"
            linkUrl="#"
          />
        </section>
      </div>
    </div>
  );
}
