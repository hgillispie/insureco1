import React from "react";
import { Grid, Column } from "@carbon/react";
import FeaturedStory from "../components/builder/FeaturedStory";

export default function FeaturedStoryPreview() {
  return (
    <div style={{ padding: "var(--spacing-07) 0" }}>
      <Grid>
        <Column lg={12} md={8} sm={4}>
          <h2
            style={{
              color: "var(--text-primary)",
              marginBottom: "var(--spacing-06)",
              fontSize: "var(--heading-h2-size)",
              fontWeight: "var(--heading-h2-weight)",
            }}
          >
            FeaturedStory Component Preview
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "var(--spacing-07)",
              fontSize: "var(--body-medium-size)",
            }}
          >
            This is how the FeaturedStory component will appear as a
            drag-and-drop block in Builder.io. All text fields, the image, and
            the button URL are editable inputs.
          </p>
        </Column>

        <Column lg={10} md={8} sm={4}>
          <FeaturedStory />
        </Column>

        <Column lg={10} md={8} sm={4}>
          <h3
            style={{
              color: "var(--text-primary)",
              margin: "var(--spacing-09) 0 var(--spacing-06)",
              fontSize: "var(--heading-h4-size)",
              fontWeight: "var(--heading-h4-weight)",
            }}
          >
            With Custom Image
          </h3>
          <FeaturedStory
            heroImage="https://cdn.builder.io/api/v1/image/assets%2F24272629d2bd4d1a8956cce15af1b3dc%2Fbfe9f51d628f4b9e932ff8257af72723?format=webp&width=800&height=1200"
            label="INSURANCE"
            title="Comprehensive Coverage for Modern Businesses"
            description="Discover how InsureCo's tailored insurance solutions protect your assets, employees, and bottom line with industry-leading coverage plans."
            readTime="8 min read"
            category="Business Insurance"
          />
        </Column>
      </Grid>
    </div>
  );
}
