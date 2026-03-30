import React from "react";
import FeaturedStory from "../components/builder/FeaturedStory";
import "./FeaturedStoryPreview.scss";

export default function FeaturedStoryPreview() {
  return (
    <div className="featured-story-preview">
      <header className="featured-story-preview__header">
        <h1 className="featured-story-preview__heading">
          FeaturedStory Component Preview
        </h1>
        <p className="featured-story-preview__subheading">
          This is a temporary preview of the FeaturedStory Builder component.
          All inputs below are editable in the Builder visual editor.
        </p>
      </header>

      <section className="featured-story-preview__section">
        <h2 className="featured-story-preview__section-title">
          Default Configuration
        </h2>
        <FeaturedStory />
      </section>

      <section className="featured-story-preview__section">
        <h2 className="featured-story-preview__section-title">
          Custom Content
        </h2>
        <FeaturedStory
          tag="TRENDING"
          bannerHeading="Top Pick"
          title="How AI is Reshaping the Insurance Industry in 2025"
          description="From automated claims processing to predictive risk modeling, artificial intelligence is fundamentally changing how insurers operate and serve their customers."
          buttonText="Explore now"
          buttonUrl="#"
          readTime="8 min read"
          category="Technology"
        />
      </section>

      <section className="featured-story-preview__section">
        <h2 className="featured-story-preview__section-title">
          Minimal Content
        </h2>
        <FeaturedStory
          tag=""
          bannerHeading="Announcement"
          title="New Coverage Options Available"
          description="We've expanded our coverage portfolio to better serve your needs."
          buttonText="Learn more"
          readTime="2 min read"
          category=""
        />
      </section>
    </div>
  );
}
