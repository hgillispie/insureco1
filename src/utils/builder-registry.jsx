import { Builder } from '@builder.io/sdk';

/**
 * Register design tokens with Builder.io
 * This makes our design system tokens available in the Builder visual editor
 *
 * Token values use CSS variables defined in:
 * - src/styles/tokens/colors.scss
 * - src/styles/tokens/elevation.scss
 * - src/styles/tokens/spacing.scss
 * - src/styles/tokens/typography.scss
 * - src/styles/tokens/sizing.scss
 * - src/styles/tokens/radius.scss
 * - src/styles/tokens/motion.scss
 * - src/styles/tokens/layout.scss
 */

Builder.register('editor.settings', {
  styleStrictMode: true,
  allowOverridingTokens: false,
  designTokens: {
    // Color Tokens
    colors: [
      // Brand Red Colors
      { name: 'Brand Red 10', value: 'var(--color-brand-red-10, #fff1f1)' },
      { name: 'Brand Red 20', value: 'var(--color-brand-red-20, #ffd7d9)' },
      { name: 'Brand Red 30', value: 'var(--color-brand-red-30, #ffb3b8)' },
      { name: 'Brand Red 40', value: 'var(--color-brand-red-40, #ff8389)' },
      { name: 'Brand Red 50', value: 'var(--color-brand-red-50, #fa4d56)' },
      { name: 'Brand Red 60', value: 'var(--color-brand-red-60, #da1e28)' },
      { name: 'Brand Red 70', value: 'var(--color-brand-red-70, #a2191f)' },
      { name: 'Brand Red 80', value: 'var(--color-brand-red-80, #750e13)' },
      { name: 'Brand Red 90', value: 'var(--color-brand-red-90, #520408)' },
      { name: 'Brand Red 100', value: 'var(--color-brand-red-100, #2d0709)' },

      // Brand Blue Colors
      { name: 'Brand Blue 10', value: 'var(--color-brand-blue-10, #edf5ff)' },
      { name: 'Brand Blue 20', value: 'var(--color-brand-blue-20, #d0e2ff)' },
      { name: 'Brand Blue 30', value: 'var(--color-brand-blue-30, #a6c8ff)' },
      { name: 'Brand Blue 40', value: 'var(--color-brand-blue-40, #78a9ff)' },
      { name: 'Brand Blue 50', value: 'var(--color-brand-blue-50, #4589ff)' },
      { name: 'Brand Blue 60', value: 'var(--color-brand-blue-60, #0f62fe)' },
      { name: 'Brand Blue 70', value: 'var(--color-brand-blue-70, #0043ce)' },
      { name: 'Brand Blue 80', value: 'var(--color-brand-blue-80, #002d9c)' },
      { name: 'Brand Blue 90', value: 'var(--color-brand-blue-90, #001d6c)' },
      { name: 'Brand Blue 100', value: 'var(--color-brand-blue-100, #001141)' },

      // Semantic Colors
      { name: 'Success', value: 'var(--color-success, #198038)' },
      { name: 'Warning', value: 'var(--color-warning, #d6a000)' },
      { name: 'Error', value: 'var(--color-error, #da1e28)' },
      { name: 'Info', value: 'var(--color-info, #0f62fe)' },

      // Background Colors
      { name: 'Background Primary', value: 'var(--background-primary, #ffffff)' },
      { name: 'Background Secondary', value: 'var(--background-secondary, #f4f4f4)' },
      { name: 'Background Tertiary', value: 'var(--background-tertiary, #e0e0e0)' },
      { name: 'Background Hover', value: 'var(--background-hover, rgba(141, 141, 141, 0.12))' },
      { name: 'Background Active', value: 'var(--background-active, rgba(141, 141, 141, 0.5))' },
      { name: 'Background Selected', value: 'var(--background-selected, rgba(218, 30, 40, 0.1))' },

      // Text Colors
      { name: 'Text Primary', value: 'var(--text-primary, #161616)' },
      { name: 'Text Secondary', value: 'var(--text-secondary, #525252)' },
      { name: 'Text Tertiary', value: 'var(--text-tertiary, #6f6f6f)' },
      { name: 'Text on Color', value: 'var(--text-on-color, #ffffff)' },
      { name: 'Text Error', value: 'var(--text-error, #da1e28)' },
      { name: 'Text on Light Background', value: 'var(--text-on-light-bg, #161616)' },
      { name: 'Text on Dark Background', value: 'var(--text-on-dark-bg, #ffffff)' },

      // Border Colors
      { name: 'Border Subtle', value: 'var(--border-subtle, #e0e0e0)' },
      { name: 'Border Strong', value: 'var(--border-strong, #8d8d8d)' },
      { name: 'Border Interactive', value: 'var(--border-interactive, #da1e28)' },

      // Interactive Colors
      { name: 'Interactive Primary', value: 'var(--interactive-primary, #da1e28)' },
      { name: 'Interactive Secondary', value: 'var(--interactive-secondary, #525252)' },
      { name: 'Interactive Hover', value: 'var(--interactive-hover, #a2191f)' },
      { name: 'Interactive Active', value: 'var(--interactive-active, #750e13)' },

      // Field Colors
      { name: 'Field Background', value: 'var(--field-background, #ffffff)' },
      { name: 'Field Text', value: 'var(--field-text, #161616)' },
      { name: 'Field Placeholder', value: 'var(--field-placeholder, #6f6f6f)' },

      // Notification Colors
      { name: 'Notification Error Background', value: 'var(--notification-error-bg, #fff1f1)' },
      { name: 'Notification Warning Background', value: 'var(--notification-warning-bg, #fcf4d6)' },
      { name: 'Notification Info Background', value: 'var(--notification-info-bg, #edf5ff)' },
      { name: 'Notification Success Background', value: 'var(--notification-success-bg, #defbe6)' },
      { name: 'Notification Text', value: 'var(--notification-text, #161616)' },
    ],

    // Box Shadow / Elevation Tokens
    boxShadow: [
      { name: 'Shadow 01', value: 'var(--shadow-01, 0 1px 2px 0 rgba(0, 0, 0, 0.05))' },
      { name: 'Shadow 02', value: 'var(--shadow-02, 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1))' },
      { name: 'Shadow 03', value: 'var(--shadow-03, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1))' },
      { name: 'Shadow 04', value: 'var(--shadow-04, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1))' },
      { name: 'Shadow 05', value: 'var(--shadow-05, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1))' },
      { name: 'Shadow 06', value: 'var(--shadow-06, 0 25px 50px -12px rgba(0, 0, 0, 0.25))' },
      { name: 'Card Shadow', value: 'var(--card-shadow, 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1))' },
      { name: 'Card Shadow Hover', value: 'var(--card-shadow-hover, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1))' },
      { name: 'Modal Shadow', value: 'var(--modal-shadow, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1))' },
      { name: 'Dropdown Shadow', value: 'var(--dropdown-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1))' },
    ],

    // Spacing Tokens
    spacing: [
      { name: 'Spacing 01', value: 'var(--spacing-01, 0.125rem)' },
      { name: 'Spacing 02', value: 'var(--spacing-02, 0.25rem)' },
      { name: 'Spacing 03', value: 'var(--spacing-03, 0.5rem)' },
      { name: 'Spacing 04', value: 'var(--spacing-04, 0.75rem)' },
      { name: 'Spacing 05', value: 'var(--spacing-05, 1rem)' },
      { name: 'Spacing 06', value: 'var(--spacing-06, 1.5rem)' },
      { name: 'Spacing 07', value: 'var(--spacing-07, 2rem)' },
      { name: 'Spacing 08', value: 'var(--spacing-08, 2.5rem)' },
      { name: 'Spacing 09', value: 'var(--spacing-09, 3rem)' },
      { name: 'Spacing 10', value: 'var(--spacing-10, 4rem)' },
      { name: 'Spacing 11', value: 'var(--spacing-11, 5rem)' },
      { name: 'Spacing 12', value: 'var(--spacing-12, 6rem)' },
      { name: 'Spacing 13', value: 'var(--spacing-13, 10rem)' },
      { name: 'Gap XS', value: 'var(--gap-xs, 0.25rem)' },
      { name: 'Gap SM', value: 'var(--gap-sm, 0.5rem)' },
      { name: 'Gap MD', value: 'var(--gap-md, 1rem)' },
      { name: 'Gap LG', value: 'var(--gap-lg, 1.5rem)' },
      { name: 'Gap XL', value: 'var(--gap-xl, 2rem)' },
      { name: 'Gap 2XL', value: 'var(--gap-2xl, 3rem)' },
      { name: 'Button Padding Horizontal', value: 'var(--button-padding-horizontal, 1rem)' },
      { name: 'Button Padding Vertical', value: 'var(--button-padding-vertical, 0.5rem)' },
      { name: 'Card Padding', value: 'var(--card-padding, 1rem)' },
      { name: 'Section Spacing', value: 'var(--section-spacing, 3rem)' },
    ],

    // Typography - Font Family
    fontFamily: [
      { name: 'Sans Serif', value: 'var(--font-family-sans, "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif)' },
      { name: 'Serif', value: 'var(--font-family-serif, "IBM Plex Serif", "Georgia", serif)' },
      { name: 'Monospace', value: 'var(--font-family-mono, "IBM Plex Mono", "Menlo", "Monaco", monospace)' },
    ],

    // Typography - Font Size
    fontSize: [
      { name: 'Heading H1', value: 'var(--heading-h1-size, 3rem)' },
      { name: 'Heading H2', value: 'var(--heading-h2-size, 2.25rem)' },
      { name: 'Heading H3', value: 'var(--heading-h3-size, 1.75rem)' },
      { name: 'Heading H4', value: 'var(--heading-h4-size, 1.5rem)' },
      { name: 'Heading H5', value: 'var(--heading-h5-size, 1.25rem)' },
      { name: 'Heading H6', value: 'var(--heading-h6-size, 1.125rem)' },
      { name: 'Body Large', value: 'var(--body-lg-size, 1.125rem)' },
      { name: 'Body Medium', value: 'var(--body-md-size, 1rem)' },
      { name: 'Body Small', value: 'var(--body-sm-size, 0.875rem)' },
      { name: 'Body XSmall', value: 'var(--body-xs-size, 0.75rem)' },
    ],

    // Typography - Font Weight
    fontWeight: [
      { name: 'Light', value: 'var(--font-weight-light, 300)' },
      { name: 'Regular', value: 'var(--font-weight-regular, 400)' },
      { name: 'Medium', value: 'var(--font-weight-medium, 500)' },
      { name: 'Semibold', value: 'var(--font-weight-semibold, 600)' },
      { name: 'Bold', value: 'var(--font-weight-bold, 700)' },
    ],

    // Typography - Line Height
    lineHeight: [
      { name: 'Heading H1', value: 'var(--heading-h1-line-height, 1.2)' },
      { name: 'Heading H2', value: 'var(--heading-h2-line-height, 1.2)' },
      { name: 'Heading H3', value: 'var(--heading-h3-line-height, 1.5)' },
      { name: 'Heading H4', value: 'var(--heading-h4-line-height, 1.5)' },
      { name: 'Heading H5', value: 'var(--heading-h5-line-height, 1.5)' },
      { name: 'Heading H6', value: 'var(--heading-h6-line-height, 1.5)' },
    ],

    // Sizing Tokens - Height
    height: [
      { name: 'Small', value: 'var(--height-sm, 2rem)' },
      { name: 'Medium', value: 'var(--height-md, 2.5rem)' },
      { name: 'Large', value: 'var(--height-lg, 3rem)' },
      { name: 'XLarge', value: 'var(--height-xl, 4rem)' },
      { name: 'Button Small', value: 'var(--button-height-sm, 2rem)' },
      { name: 'Button Medium', value: 'var(--button-height-md, 2.5rem)' },
      { name: 'Button Large', value: 'var(--button-height-lg, 3rem)' },
      { name: 'Button XLarge', value: 'var(--button-height-xl, 4rem)' },
      { name: 'Input Small', value: 'var(--input-height-sm, 2rem)' },
      { name: 'Input Medium', value: 'var(--input-height-md, 2.5rem)' },
      { name: 'Input Large', value: 'var(--input-height-lg, 3rem)' },
    ],

    // Sizing Tokens - Width
    width: [
      { name: 'Button Min Width', value: 'var(--button-min-width, 4rem)' },
      { name: 'Container Small', value: 'var(--container-sm, 640px)' },
      { name: 'Container Medium', value: 'var(--container-md, 768px)' },
      { name: 'Container Large', value: 'var(--container-lg, 1024px)' },
      { name: 'Container XLarge', value: 'var(--container-xl, 1280px)' },
      { name: 'Container 2XLarge', value: 'var(--container-2xl, 1536px)' },
      { name: 'Icon Small', value: 'var(--icon-size-sm, 1rem)' },
      { name: 'Icon Medium', value: 'var(--icon-size-md, 1.25rem)' },
      { name: 'Icon Large', value: 'var(--icon-size-lg, 1.5rem)' },
      { name: 'Icon XLarge', value: 'var(--icon-size-xl, 2rem)' },
    ],

    // Border Radius Tokens
    borderRadius: [
      { name: 'None', value: 'var(--radius-none, 0)' },
      { name: 'Small', value: 'var(--radius-sm, 0.125rem)' },
      { name: 'Medium', value: 'var(--radius-md, 0.25rem)' },
      { name: 'Large', value: 'var(--radius-lg, 0.5rem)' },
      { name: 'XLarge', value: 'var(--radius-xl, 1rem)' },
      { name: '2XLarge', value: 'var(--radius-2xl, 1.5rem)' },
      { name: 'Full', value: 'var(--radius-full, 9999px)' },
      { name: 'Circle', value: 'var(--radius-circle, 50%)' },
      { name: 'Button', value: 'var(--button-radius, 0.25rem)' },
      { name: 'Input', value: 'var(--input-radius, 0.25rem)' },
      { name: 'Card', value: 'var(--card-radius, 0.5rem)' },
      { name: 'Modal', value: 'var(--modal-radius, 0.5rem)' },
    ],

    // Motion - Duration (using custom properties via animation shorthand)
    animation: [
      { name: 'Instant', value: 'var(--duration-instant, 0ms)' },
      { name: 'Fast 01', value: 'var(--duration-fast-01, 70ms)' },
      { name: 'Fast 02', value: 'var(--duration-fast-02, 110ms)' },
      { name: 'Moderate 01', value: 'var(--duration-moderate-01, 150ms)' },
      { name: 'Moderate 02', value: 'var(--duration-moderate-02, 240ms)' },
      { name: 'Slow 01', value: 'var(--duration-slow-01, 400ms)' },
      { name: 'Slow 02', value: 'var(--duration-slow-02, 700ms)' },
      { name: 'Fade', value: 'var(--motion-fade, 150ms cubic-bezier(0.4, 0.0, 0.2, 1))' },
      { name: 'Slide', value: 'var(--motion-slide, 240ms cubic-bezier(0.0, 0.0, 0.2, 1))' },
      { name: 'Scale', value: 'var(--motion-scale, 110ms cubic-bezier(0.4, 0.0, 0.2, 1))' },
      { name: 'Hover', value: 'var(--motion-hover, 70ms cubic-bezier(0.4, 0.0, 0.2, 1))' },
    ],

    // Layout - Max Width (using maxWidth property)
    maxWidth: [
      { name: 'Breakpoint Small', value: 'var(--breakpoint-sm, 320px)' },
      { name: 'Breakpoint Medium', value: 'var(--breakpoint-md, 672px)' },
      { name: 'Breakpoint Large', value: 'var(--breakpoint-lg, 1056px)' },
      { name: 'Breakpoint XLarge', value: 'var(--breakpoint-xlg, 1312px)' },
      { name: 'Breakpoint Max', value: 'var(--breakpoint-max, 1584px)' },
      { name: 'Container Small', value: 'var(--container-max-width-sm, 640px)' },
      { name: 'Container Medium', value: 'var(--container-max-width-md, 768px)' },
      { name: 'Container Large', value: 'var(--container-max-width-lg, 1024px)' },
      { name: 'Container XLarge', value: 'var(--container-max-width-xlg, 1280px)' },
      { name: 'Container Max', value: 'var(--container-max-width-max, 1536px)' },
    ],
  },
});

export default Builder;
