import React from "react";
import { Button } from "@carbon/react";
import { ArrowRight, Time, Document } from "@carbon/icons-react";
import "./FeaturedStory.scss";

export default function FeaturedStory({
  badge = "FEATURED",
  heroTitle = "Featured Story",
  heroBackground = "#0F62FE",
  title = "Transforming Enterprise Design Systems: A Journey Through Innovation and Collaboration",
  description = "Explore how modern design systems are revolutionizing the way enterprise teams collaborate, build, and scale digital experiences.",
  buttonText = "Read full story",
  buttonUrl = "#",
  readTime = "5 min read",
  category = "Design Systems",
}) {
  return (
    <div className="featured-story-card">
      <div className="featured-story-hero" style={{ backgroundColor: heroBackground }}>
        {badge && (
          <span className="featured-story-badge">{badge}</span>
        )}
        <h2 className="featured-story-hero-title">{heroTitle}</h2>
      </div>

      <div className="featured-story-body">
        <h3 className="featured-story-title">{title}</h3>
        <p className="featured-story-description">{description}</p>

        <div className="featured-story-footer">
          <Button
            href={buttonUrl}
            renderIcon={ArrowRight}
            kind="primary"
            size="md"
            className="featured-story-cta"
          >
            {buttonText}
          </Button>

          <div className="featured-story-meta">
            {readTime && (
              <span className="featured-story-meta-item">
                <Time size={16} />
                <span>{readTime}</span>
              </span>
            )}
            {category && (
              <span className="featured-story-meta-item">
                <Document size={16} />
                <span>{category}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
