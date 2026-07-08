import React from "react";
import "./FeaturedStory.scss";

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.3 3.7L13.1 7.5H1V8.5H13.1L9.3 12.3L10 13L15 8L10 3L9.3 3.7Z" fill="currentColor" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.3997 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.3997 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17054C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z"
      fill="currentColor"
    />
    <path d="M10.295 11L7.5 8.205V3.5H8.5V7.79L11 10.295L10.295 11Z" fill="currentColor" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.85 4.65L9.35 1.15C9.25 1.05 9.15 1 9 1H4C3.45 1 3 1.45 3 2V14C3 14.55 3.45 15 4 15H12C12.55 15 13 14.55 13 14V5C13 4.85 12.95 4.75 12.85 4.65ZM9 2.2L11.8 5H9V2.2ZM12 14H4V2H8V5C8 5.55 8.45 6 9 6H12V14Z"
      fill="currentColor"
    />
    <path d="M5 11H11V12H5V11ZM5 8H11V9H5V8Z" fill="currentColor" />
  </svg>
);

export default function FeaturedStory({
  badgeText = "FEATURED",
  bannerTitle = "Featured Story",
  title = "Transforming Enterprise Design Systems: A Journey Through Innovation and Collaboration",
  description = "Explore how modern design systems are revolutionizing the way enterprise teams collaborate, build, and scale digital experiences.",
  ctaText = "Read full story",
  ctaUrl = "#",
  readTime = "5 min read",
  category = "Design Systems",
}) {
  return (
    <div className="featured-story-card">
      <div className="featured-story-banner">
        <span className="featured-story-badge">{badgeText}</span>
        <h2 className="featured-story-banner-title">{bannerTitle}</h2>
      </div>
      <div className="featured-story-content">
        {title && <h3 className="featured-story-title">{title}</h3>}
        {description && <p className="featured-story-description">{description}</p>}
        <div className="featured-story-meta">
          <a className="featured-story-cta" href={ctaUrl}>
            {ctaText}
            <ArrowRightIcon />
          </a>
          {readTime && (
            <span className="featured-story-meta-item">
              <ClockIcon />
              {readTime}
            </span>
          )}
          {category && (
            <span className="featured-story-meta-item">
              <DocumentIcon />
              {category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
