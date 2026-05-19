import React from "react";
import { ArrowRight, Time, Tag } from "@carbon/icons-react";
import "./FeaturedStory.scss";

export default function FeaturedStory({
  bannerLabel = "FEATURED",
  bannerTitle = "Featured Story",
  articleTitle = "Transforming Enterprise Design Systems: A Journey Through Innovation and Collaboration",
  description = "Explore how modern design systems are revolutionizing the way enterprise teams collaborate, build, and scale digital experiences.",
  readTime = "5 min read",
  category = "Design Systems",
  linkUrl = "#",
  linkText = "Read full story",
}) {
  return (
    <div className="featured-story-card">
      <div className="featured-story-banner">
        <span className="featured-story-banner-label">{bannerLabel}</span>
        <h2 className="featured-story-banner-title">{bannerTitle}</h2>
      </div>

      <div className="featured-story-body">
        <h3 className="featured-story-article-title">{articleTitle}</h3>

        <hr className="featured-story-divider" />

        <p className="featured-story-description">{description}</p>

        <div className="featured-story-footer">
          <a href={linkUrl} className="featured-story-cta">
            {linkText}
            <ArrowRight size={16} className="featured-story-cta-icon" />
          </a>

          <div className="featured-story-meta">
            {readTime && (
              <span className="featured-story-meta-item">
                <Time size={16} />
                {readTime}
              </span>
            )}
            {category && (
              <span className="featured-story-meta-item">
                <Tag size={16} />
                {category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
