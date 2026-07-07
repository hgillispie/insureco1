import React from "react";
import { Button } from "@carbon/react";
import { ArrowRight, Time, Document } from "@carbon/icons-react";
import "./FeaturedStory.scss";

/**
 * FeaturedStory - blog/article promo card registered with Builder.io (see
 * `src/builder-registry.js`) so editors can insert and configure it from the
 * visual editor.
 *
 * Layout: a colored banner (badge + heading) on top, with a title,
 * description, CTA button, and read-time/category meta below.
 *
 * @param {Object} props
 * @param {string} [props.badgeText] - Small pill label shown top-left of the banner (e.g. "FEATURED").
 * @param {string} [props.bannerHeading] - Large heading centered in the banner.
 * @param {string} [props.image] - Optional image URL. When provided, it replaces the solid
 *   banner background (with a blue scrim so the badge/heading stay readable). When omitted,
 *   the banner falls back to a solid brand-blue background.
 * @param {string} [props.title] - Article title shown in the card body.
 * @param {string} [props.description] - Short article summary/excerpt.
 * @param {string} [props.buttonText] - Label for the CTA button.
 * @param {string} [props.buttonUrl] - Destination URL for the CTA button.
 * @param {string} [props.readTime] - Estimated reading time shown next to a clock icon.
 * @param {string} [props.category] - Article category/tag shown next to a document icon.
 */
export default function FeaturedStory({
  badgeText = "FEATURED",
  bannerHeading = "Featured Story",
  image,
  title = "Transforming Enterprise Design Systems: A Journey Through Innovation and Collaboration",
  description = "Explore how modern design systems are revolutionizing the way enterprise teams collaborate, build, and scale digital experiences.",
  buttonText = "Read full story",
  buttonUrl = "#",
  readTime = "5 min read",
  category = "Design Systems",
}) {
  return (
    <div className="featured-story">
      <div
        className={`featured-story__banner ${
          image ? "featured-story__banner--image" : ""
        }`}
      >
        {/* Background image is optional; the `--image` modifier class adds the
            blue scrim (see FeaturedStory.scss) so the badge/heading text
            stays legible over photos of any brightness. */}
        {image && (
          // Decorative background image: alt is intentionally empty since the
          // banner heading already conveys the same information to screen readers.
          <img src={image} alt="" className="featured-story__banner-image" />
        )}
        {badgeText && <span className="featured-story__badge">{badgeText}</span>}
        {bannerHeading && (
          <h2 className="featured-story__banner-heading">{bannerHeading}</h2>
        )}
      </div>
      <div className="featured-story__body">
        {title && <h3 className="featured-story__title">{title}</h3>}
        {description && <p className="featured-story__description">{description}</p>}
        <div className="featured-story__footer">
          {/* Primary CTA - uses Carbon's Button so it automatically picks up
              the global --interactive-primary theming (see components.scss). */}
          <Button href={buttonUrl} renderIcon={ArrowRight} kind="primary">
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
    </div>
  );
}
