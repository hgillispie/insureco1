import React from "react";
import FeaturedStory from "../components/builder/FeaturedStory";
import "./FeaturedStoryPreview.scss";

export default function FeaturedStoryPreview() {
  return (
    <div className="featured-story-preview-page">
      <div className="featured-story-preview-header">
        <h1 className="featured-story-preview-heading">FeaturedStory — Component Preview</h1>
        <p className="featured-story-preview-subheading">
          This is a temporary preview route. The component is registered with Builder.io and can
          be added to any page via the visual editor.
        </p>
      </div>

      <section className="featured-story-preview-section">
        <h2 className="featured-story-preview-section-label">Default</h2>
        <FeaturedStory />
      </section>

      <section className="featured-story-preview-section">
        <h2 className="featured-story-preview-section-label">Custom content</h2>
        <FeaturedStory
          bannerLabel="EDITOR'S PICK"
          bannerTitle="Industry Spotlight"
          articleTitle="How AI Is Reshaping Insurance Risk Assessment in 2025"
          description="From predictive modeling to real-time telematics, artificial intelligence is fundamentally changing how insurers evaluate and price risk."
          readTime="8 min read"
          category="InsurTech"
          linkUrl="/blog/ai-risk-assessment"
          linkText="Read full story"
        />
      </section>

      <section className="featured-story-preview-section">
        <h2 className="featured-story-preview-section-label">No metadata</h2>
        <FeaturedStory
          bannerLabel="TRENDING"
          bannerTitle="Market Update"
          articleTitle="Q1 2025 Property Insurance Market Report: Rising Premiums and Shifting Risk Landscapes"
          description="A comprehensive look at the forces driving premium increases across residential and commercial property lines this quarter."
          readTime=""
          category=""
          linkText="Read the report"
        />
      </section>
    </div>
  );
}
