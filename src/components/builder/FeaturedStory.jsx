import React from "react";
import { Button } from "@carbon/react";
import { ArrowRight, Time, Document } from "@carbon/icons-react";
import "./FeaturedStory.scss";

export default function FeaturedStory({
  tag = "FEATURED",
  bannerHeading = "Featured Story",
  title = "Transforming Enterprise Design Systems: A Journey Through Innovation and Collaboration",
  description = "Explore how modern design systems are revolutionizing the way enterprise teams collaborate, build, and scale digital experiences.",
  buttonText = "Read full story",
  buttonUrl = "#",
  readTime = "5 min read",
  category = "Design Systems",
}) {
  return (
    <article className="featured-story">
      <div className="featured-story__banner">
        {tag && <span className="featured-story__tag">{tag}</span>}
        {bannerHeading && (
          <h2 className="featured-story__banner-heading">{bannerHeading}</h2>
        )}
      </div>

      <div className="featured-story__content">
        {title && <h3 className="featured-story__title">{title}</h3>}

        <hr className="featured-story__divider" />

        {description && (
          <p className="featured-story__description">{description}</p>
        )}

        <div className="featured-story__footer">
          {buttonText && (
            <Button
              kind="primary"
              size="md"
              renderIcon={ArrowRight}
              href={buttonUrl}
              className="featured-story__cta"
            >
              {buttonText}
            </Button>
          )}

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
