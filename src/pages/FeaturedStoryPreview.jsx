import React from "react";
import FeaturedStory from "../components/builder/FeaturedStory";
import "./FeaturedStoryPreview.scss";

export default function FeaturedStoryPreview() {
  return (
    <div className="featured-story-preview-page">
      <div className="featured-story-preview-header">
        <h1 className="featured-story-preview-heading">FeaturedStory — Builder Component Preview</h1>
        <p className="featured-story-preview-subtext">
          This page previews the <code>FeaturedStory</code> component registered with Builder Publish.
          In Builder, editors can customize all text, the hero background color, button link, and meta info.
        </p>
      </div>

      <section className="featured-story-preview-section">
        <h2 className="featured-story-preview-section-label">Default</h2>
        <FeaturedStory />
      </section>

      <section className="featured-story-preview-section">
        <h2 className="featured-story-preview-section-label">Custom Content</h2>
        <FeaturedStory
          badge="NEW"
          heroTitle="Spotlight Article"
          heroBackground="#198038"
          title="Building Accessible Interfaces at Scale: Lessons from the Field"
          description="Learn how leading teams are embedding accessibility into their design and engineering workflows from day one."
          buttonText="Read the article"
          buttonUrl="#"
          readTime="8 min read"
          category="Accessibility"
        />
      </section>
    </div>
  );
}
