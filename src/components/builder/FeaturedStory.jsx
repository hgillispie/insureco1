import React from "react";
import { Button, Tag } from "@carbon/react";
import { ArrowRight, Time, Document } from "@carbon/icons-react";
import "./FeaturedStory.scss";

export default function FeaturedStory({
  label = "FEATURED",
  heroHeading = "Featured Story",
  heroImage,
  title = "Transforming Enterprise Design Systems: A Journey Through Innovation and Collaboration",
  description = "Explore how modern design systems are revolutionizing the way enterprise teams collaborate, build, and scale digital experiences.",
  buttonText = "Read full story",
  buttonUrl = "#",
  readTime = "5 min read",
  category = "Design Systems",
}) {
  return (
    <article className="featured-story">
      <div className="featured-story__hero">
        {heroImage ? (
          <img
            src={heroImage}
            alt={title}
            className="featured-story__hero-image"
          />
        ) : (
          <div className="featured-story__hero-placeholder">
            <h2 className="featured-story__hero-heading">{heroHeading}</h2>
          </div>
        )}
        <Tag type="blue" size="sm" className="featured-story__label">
          {label}
        </Tag>
      </div>

      <div className="featured-story__content">
        <h3 className="featured-story__title">{title}</h3>

        <hr className="featured-story__divider" />

        <p className="featured-story__description">{description}</p>

        <div className="featured-story__footer">
          <Button
            kind="primary"
            size="md"
            renderIcon={ArrowRight}
            href={buttonUrl}
            className="featured-story__cta"
          >
            {buttonText}
          </Button>

          <div className="featured-story__meta">
            {readTime && (
              <span className="featured-story__meta-item">
                <Time size={16} />
                {readTime}
              </span>
            )}
            {category && (
              <span className="featured-story__meta-item">
                <Document size={16} />
                {category}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
