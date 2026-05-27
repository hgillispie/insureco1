import React from "react";
import FeaturedStory from "../components/builder/FeaturedStory";
import "./FeaturedStoryPreview.scss";

export default function FeaturedStoryPreview() {
  return (
    <div className="featured-story-preview-page">
      <div className="featured-story-preview-header">
        <h1 className="featured-story-preview-heading">FeaturedStory — Builder Preview</h1>
        <p className="featured-story-preview-subheading">
          This component is registered with Builder Publish. Below are example configurations.
        </p>
      </div>

      <section className="featured-story-preview-section">
        <h2 className="featured-story-preview-section-label">Default</h2>
        <div className="featured-story-preview-card-wrapper">
          <FeaturedStory />
        </div>
      </section>

      <section className="featured-story-preview-section">
        <h2 className="featured-story-preview-section-label">Custom Banner Color</h2>
        <div className="featured-story-preview-card-wrapper">
          <FeaturedStory
            bannerColor="#198038"
            badge="NEW"
            bannerTitle="Green Edition"
            title="Building Sustainable Insurance Practices for the Modern World"
            description="Discover how InsureCo is leading the charge in eco-friendly insurance solutions that protect both people and the planet."
            ctaText="Explore now"
            readTime="3 min read"
            category="Sustainability"
          />
        </div>
      </section>

      <section className="featured-story-preview-section">
        <h2 className="featured-story-preview-section-label">Minimal (no badge, no meta)</h2>
        <div className="featured-story-preview-card-wrapper">
          <FeaturedStory
            badge=""
            bannerColor="#6929C4"
            bannerTitle="Industry Report"
            title="The State of Home Insurance in 2025"
            description="An in-depth analysis of market trends, consumer expectations, and emerging risks shaping the home insurance landscape."
            ctaText="Download report"
            readTime=""
            category=""
          />
        </div>
      </section>
    </div>
  );
}
