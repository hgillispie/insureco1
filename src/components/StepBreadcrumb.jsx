import React from 'react';
import { CheckmarkFilled } from '@carbon/icons-react';
import './StepBreadcrumb.scss';

function CurrentStepIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M11.8821 3.42965L12.5246 2.6639C11.904 2.13853 11.1963 1.72553 10.4336 1.4435L10.0918 2.3823C10.745 2.62459 11.3508 2.97902 11.8821 3.42965Z" fill="currentColor" />
      <path d="M13.905 7L14.8889 6.7936C14.7506 5.99468 14.4734 5.22616 14.07 4.52285L13.2044 5C13.5499 5.622 13.7868 6.29836 13.905 7Z" fill="currentColor" />
      <path d="M10.0918 13.6177L10.4336 14.5565C11.1963 14.2745 11.904 13.8615 12.5246 13.3361L11.8821 12.5703C11.3508 13.021 10.745 13.3754 10.0918 13.6177Z" fill="currentColor" />
      <path d="M13.2044 11L14.07 11.5C14.4737 10.7886 14.7508 10.0126 14.8891 9.2064L13.905 9.03295C13.7867 9.72415 13.5497 10.3897 13.2044 11Z" fill="currentColor" />
      <path d="M8 15V1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15Z" fill="currentColor" />
    </svg>
  );
}

function IncompleteStepIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3.85009 2.34997C3.27659 2.79006 2.77115 3.31235 2.35009 3.89997L3.15009 4.49997C3.51732 3.99069 3.95502 3.53615 4.45009 3.14997L3.85009 2.34997Z" fill="currentColor" />
      <path d="M2.30009 6.14997L1.35009 5.84997C1.10858 6.54065 0.990112 7.26835 1.00009 7.99997H2.00009C1.99806 7.37103 2.09942 6.74604 2.30009 6.14997Z" fill="currentColor" />
      <path d="M1.35009 10.2C1.58197 10.8972 1.91921 11.5548 2.35009 12.15L3.15009 11.55C2.78863 11.0439 2.50233 10.4881 2.30009 9.89997L1.35009 10.2Z" fill="currentColor" />
      <path d="M3.90009 13.65C4.49526 14.0809 5.15288 14.4181 5.85009 14.65L6.15009 13.7C5.56196 13.4977 5.0062 13.2114 4.50009 12.85L3.90009 13.65Z" fill="currentColor" />
      <path d="M5.85009 1.34997L6.15009 2.29997C6.74616 2.09929 7.37116 1.99794 8.00009 1.99997V0.999972C7.26847 0.98999 6.54077 1.10845 5.85009 1.34997Z" fill="currentColor" />
      <path d="M12.1001 13.65C12.689 13.211 13.2111 12.6889 13.6501 12.1L12.8501 11.5C12.4783 12.0219 12.022 12.4781 11.5001 12.85L12.1001 13.65Z" fill="currentColor" />
      <path d="M13.7001 9.84997L14.6501 10.15C14.8676 9.4534 14.9854 8.72956 15.0001 7.99997H14.0001C14.0021 8.62891 13.9008 9.25391 13.7001 9.84997Z" fill="currentColor" />
      <path d="M14.6001 5.79997C14.3682 5.10275 14.031 4.44514 13.6001 3.84997L12.8001 4.44997C13.1616 4.95608 13.4479 5.51184 13.6501 6.09997L14.6001 5.79997Z" fill="currentColor" />
      <path d="M12.0501 2.29997C11.4549 1.86909 10.7973 1.53185 10.1001 1.29997L9.80009 2.24997C10.3882 2.45221 10.944 2.73851 11.4501 3.09997L12.0501 2.29997Z" fill="currentColor" />
      <path d="M10.1501 14.65L9.85009 13.7C9.25403 13.9007 8.62903 14.002 8.00009 14V15C8.72679 14.9567 9.44718 14.8394 10.1501 14.65Z" fill="currentColor" />
    </svg>
  );
}

/**
 * StepBreadcrumb - Horizontal step progress indicator
 *
 * Matches the Figma "Progress indicator" component: each step is a flex
 * segment with its own top border (current/complete = blue, incomplete =
 * grey) and an icon + label row beneath it.
 *
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects: [{ label, key }]
 * @param {number} props.currentIndex - Index of current step (0-based)
 */
export default function StepBreadcrumb({ steps, currentIndex = 0 }) {
  return (
    <div className="step-breadcrumb">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={step.key || index}
            className={`step-breadcrumb__item ${
              isComplete ? 'step-breadcrumb__item--complete' : ''
            } ${isCurrent ? 'step-breadcrumb__item--current' : ''} ${
              !isComplete && !isCurrent ? 'step-breadcrumb__item--incomplete' : ''
            }`}
          >
            <div className="step-breadcrumb__icon-label">
              <span className="step-breadcrumb__icon">
                {isComplete ? (
                  <CheckmarkFilled size={16} />
                ) : isCurrent ? (
                  <CurrentStepIcon />
                ) : (
                  <IncompleteStepIcon />
                )}
              </span>
              <span className="step-breadcrumb__label">{step.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
