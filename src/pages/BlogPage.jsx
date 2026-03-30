import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Content, fetchOneEntry } from "@builder.io/sdk-react";
import builderCustomComponents from "../builder-registry";

/** Public key for the Builder space that contains the `blog` model (must match the editor). */
const BUILDER_API_KEY = "514d71aa0a614259b70936ed632e9938";

export default function BlogPage() {
  const { pathname } = useLocation();
  const [content, setContent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchOneEntry({
      model: "blog",
      apiKey: BUILDER_API_KEY,
      userAttributes: { urlPath: pathname },
      enrich: true,
    }).then((entry) => {
      if (!cancelled) setContent(entry ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <div>
      {/* Hardcoded Header
      <header
        style={{
          backgroundColor: "#161616",
          color: "#fff",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>InsureCo Blog</h1>
        <p style={{ fontSize: "1rem", opacity: 0.7, marginTop: 8 }}>
          Insights, tips, and news from the InsureCo team
        </p>
      </header> */}

      {/* Builder-managed body section */}
      <main>
        {content ? (
          <Content
            model="blog"
            apiKey={BUILDER_API_KEY}
            content={content}
            customComponents={builderCustomComponents}
          />
        ) : null}
      </main>

      {/* Hardcoded Footer */}
      <footer
        style={{
          backgroundColor: "#262626",
          color: "#c6c6c6",
          padding: "32px 24px",
          textAlign: "center",
          fontSize: "0.875rem",
        }}
      >
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} InsureCo. All rights reserved.</p>
        <p style={{ margin: "8px 0 0 0", opacity: 0.6 }}>
          InsureCo Insurance &middot; Privacy Policy &middot; Terms of Service
        </p>
      </footer>
    </div>
  );
}
