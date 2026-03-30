import BlogHero from "./components/builder/BlogHero";
import BlogCard from "./components/builder/BlogCard";
import BlogCardGrid from "./components/builder/BlogCardGrid";
import BlogAuthorBio from "./components/builder/BlogAuthorBio";
import BlogRichText from "./components/builder/BlogRichText";
import CallToAction from "./components/builder/CallToAction";
import FeaturedStory from "./components/builder/FeaturedStory";

/**
 * Custom components registered with Builder.io.
 * Pass this array to the `customComponents` prop on <Content /> or <Section />.
 */
const builderCustomComponents = [
  // {
  //   component: BlogHero,
  //   name: "BlogHero",
  //   inputs: [
  //     { name: "title", type: "string", defaultValue: "Blog Post Title" },
  //     { name: "subtitle", type: "string", defaultValue: "A short description of this post" },
  //     { name: "backgroundImage", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"] },
  //     {
  //       name: "alignment",
  //       type: "string",
  //       defaultValue: "center",
  //       enum: ["left", "center", "right"],
  //     },
  //   ],
  // },
  {
    component: BlogCard,
    name: "BlogCard",
    inputs: [
      { name: "title", type: "string", defaultValue: "Card Title" },
      { name: "description", type: "string", defaultValue: "A brief summary of the article." },
      { name: "image", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"] },
      { name: "author", type: "string" },
      { name: "date", type: "string" },
      { name: "linkUrl", type: "url" },
    ],
  },
  {
    component: BlogCardGrid,
    name: "BlogCardGrid",
    canHaveChildren: true,
    defaultChildren: [
      { "@type": "@builder.io/sdk:Element", component: { name: "BlogCard", options: {} } },
      { "@type": "@builder.io/sdk:Element", component: { name: "BlogCard", options: {} } },
      { "@type": "@builder.io/sdk:Element", component: { name: "BlogCard", options: {} } },
    ],
    inputs: [
      { name: "columns", type: "number", defaultValue: 3 },
      { name: "gap", type: "number", defaultValue: 24 },
    ],
  },
  // {
  //   component: BlogAuthorBio,
  //   name: "BlogAuthorBio",
  //   inputs: [
  //     { name: "name", type: "string", defaultValue: "Author Name" },
  //     { name: "avatar", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"] },
  //     { name: "role", type: "string", defaultValue: "Content Writer" },
  //     { name: "bio", type: "longText", defaultValue: "A short bio about the author." },
  //   ],
  // },
  {
    component: BlogRichText,
    name: "BlogRichText",
    inputs: [
      { name: "content", type: "richText", defaultValue: "<p>Start writing your blog content here...</p>" },
    ],
  },
  {
    component: CallToAction,
    name: "CallToAction",
    inputs: [
      { name: "heading", type: "string", defaultValue: "Ready to Get Started?" },
      { name: "body", type: "string", defaultValue: "Contact us today to learn more about our insurance solutions." },
      { name: "buttonText", type: "string", defaultValue: "Learn More" },
      { name: "buttonUrl", type: "url", defaultValue: "#" },
      {
        name: "variant",
        type: "string",
        defaultValue: "primary",
        enum: ["primary", "secondary"],
      },
    ],
  },
  {
    component: FeaturedStory,
    name: "FeaturedStory",
    inputs: [
      { name: "tag", type: "string", defaultValue: "FEATURED" },
      { name: "bannerHeading", type: "string", defaultValue: "Featured Story" },
      {
        name: "title",
        type: "string",
        defaultValue:
          "Transforming Enterprise Design Systems: A Journey Through Innovation and Collaboration",
      },
      {
        name: "description",
        type: "longText",
        defaultValue:
          "Explore how modern design systems are revolutionizing the way enterprise teams collaborate, build, and scale digital experiences.",
      },
      { name: "buttonText", type: "string", defaultValue: "Read full story" },
      { name: "buttonUrl", type: "url", defaultValue: "#" },
      { name: "readTime", type: "string", defaultValue: "5 min read" },
      { name: "category", type: "string", defaultValue: "Design Systems" },
    ],
  },
];

export default builderCustomComponents;
