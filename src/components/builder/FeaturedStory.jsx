import React from "react";
import { Button } from "@carbon/react";
import { ArrowRight, Time, Document } from "@carbon/icons-react";
import "./FeaturedStory.scss";

export default function FeaturedStory({
  badge = "FEATURED",
  bannerTitle = "Featured Story",
  bannerColor = "#0F62FE",
  title = "Transforming Enterprise Design Systems: A Journey Through Innovation and Collaboration",
  description = "Explore how modern design systems are revolutionizing the way enterprise teams collaborate, build, and scale digital experiences.",
  ctaText = "Read full story",
  ctaUrl = "#",
  readTime = "5 min read",
  category = "Design Systems",
}) {
  return (
    <article className="featured-story-card">
      <div className="featured-story-banner" style={{ backgroundColor: bannerColor }}>
        {badge && (
          <span className="featured-story-badge">{badge}</span>
        )}
        <h2 className="featured-story-banner-title">{bannerTitle}</h2>
      </div>

      <div className="featured-story-body">
        <h3 className="featured-story-title">{title}</h3>
        <p className="featured-story-description">{description}</p>

        <div className="featured-story-footer">
          <Button
            kind="danger"
            size="md"
            renderIcon={ArrowRight}
            href={ctaUrl}
            className="featured-story-cta"
          >
            {ctaText}
          </Button>

          <div className="featured-story-meta">
            {readTime && (
              <span className="featured-story-meta-item">
                <Time size={16} className="featured-story-meta-icon" />
                <span>{readTime}</span>
              </span>
            )}
            {category && (
              <span className="featured-story-meta-item">
                <Document size={16} className="featured-story-meta-icon" />
                <span>{category}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
