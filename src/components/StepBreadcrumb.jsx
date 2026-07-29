import React from 'react';
import { Checkmark, CheckmarkFilled, CircleDash, Incomplete } from '@carbon/icons-react';
import './StepBreadcrumb.scss';

/**
 * StepBreadcrumb - Custom breadcrumb/stepper component
 * 
 * Replacement for Carbon's ProgressIndicator which had theming issues.
 * This component gives us full control over styling and ensures proper
 * theme support in both light and dark modes.
 * 
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects: [{ label, description?, key }]
 * @param {number} props.currentIndex - Index of current step (0-based)
 * @param {boolean} props.spaceEqually - Whether to space steps equally (default: true)
 */
export default function StepBreadcrumb({ steps, currentIndex = 0, spaceEqually = true, variant = 'default' }) {
  const isSegmented = variant === 'segmented';

  return (
    <div className={`step-breadcrumb ${spaceEqually ? 'step-breadcrumb--equal' : ''} ${isSegmented ? 'step-breadcrumb--segmented' : ''}`}>
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isIncomplete = index > currentIndex;

        return (
          <React.Fragment key={step.key || index}>
            <div
              className={`step-breadcrumb__item ${
                isComplete ? 'step-breadcrumb__item--complete' : ''
              } ${isCurrent ? 'step-breadcrumb__item--current' : ''} ${
                isIncomplete ? 'step-breadcrumb__item--incomplete' : ''
              }`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="step-breadcrumb__marker">
                {isSegmented ? (
                  isComplete ? (
                    <CheckmarkFilled size={16} className="step-breadcrumb__status-icon" />
                  ) : isCurrent ? (
                    <Incomplete size={16} className="step-breadcrumb__status-icon" />
                  ) : (
                    <CircleDash size={16} className="step-breadcrumb__status-icon" />
                  )
                ) : isComplete ? (
                  <Checkmark size={16} className="step-breadcrumb__check" />
                ) : (
                  <span className="step-breadcrumb__number">{index + 1}</span>
                )}
              </div>
              <div className="step-breadcrumb__content">
                <span className="step-breadcrumb__label">{step.label}</span>
                {step.description && (
                  <span className="step-breadcrumb__description">{step.description}</span>
                )}
              </div>
            </div>
            
            {!isSegmented && index < steps.length - 1 && (
              <div className={`step-breadcrumb__line ${isComplete ? 'step-breadcrumb__line--complete' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
