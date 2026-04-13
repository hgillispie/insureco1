import React, { useState } from 'react';
import {
  Grid,
  Column,
  Button,
  Tile,
  Select,
  SelectItem,
  Heading,
  Tag,
} from '@carbon/react';
import {
  Car,
  Home as HomeIcon,
  Gift,
  ArrowRight,
  ArrowLeft,
  CheckmarkFilled,
  Calculator,
} from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
import './QuotePage.scss';

const STEPS = ['Coverage Type', 'Your Details', 'Your Estimate'];

// Quote calculation logic
function calculateQuote(formData) {
  let carMonthly = 0;
  let homeMonthly = 0;

  if (formData.coverageType === 'car' || formData.coverageType === 'bundle') {
    let base = 80;

    const yearNum = parseInt(formData.vehicleYear, 10);
    if (yearNum >= 2020) base += 20;
    else if (yearNum >= 2015) base += 0;
    else base -= 15;

    if (formData.coverageLevel === 'basic') base -= 20;
    else if (formData.coverageLevel === 'comprehensive') base += 30;

    if (formData.annualMileage === 'low') base -= 10;
    else if (formData.annualMileage === 'high') base += 20;

    carMonthly = Math.max(30, base);
  }

  if (formData.coverageType === 'home' || formData.coverageType === 'bundle') {
    let base = 100;

    if (formData.homeValue === 'under200k') base -= 20;
    else if (formData.homeValue === '500kto1m') base += 40;
    else if (formData.homeValue === 'over1m') base += 100;

    if (formData.homeType === 'condo') base -= 20;
    else if (formData.homeType === 'townhouse') base -= 10;

    if (formData.homeAge === 'new') base -= 10;
    else if (formData.homeAge === 'old') base += 20;

    homeMonthly = Math.max(40, base);
  }

  let total = carMonthly + homeMonthly;
  if (formData.coverageType === 'bundle') total = Math.round(total * 0.85);

  const low = Math.round(total * 0.9);
  const high = Math.round(total * 1.1);

  return { carMonthly, homeMonthly, total, low, high };
}

export default function QuotePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    coverageType: '',
    vehicleYear: '2022',
    coverageLevel: 'standard',
    annualMileage: 'medium',
    homeValue: '200kto500k',
    homeType: 'single',
    homeAge: 'medium',
  });
  const [estimate, setEstimate] = useState(null);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const result = calculateQuote(formData);
      setEstimate(result);
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const canProceedStep0 = formData.coverageType !== '';
  const canProceedStep1 = true; // All fields have defaults

  const coverageOptions = [
    {
      id: 'car',
      icon: <Car size={32} />,
      label: 'Car Insurance',
      description: 'Coverage for your vehicle, liability, and roadside assistance.',
    },
    {
      id: 'home',
      icon: <HomeIcon size={32} />,
      label: 'Home Insurance',
      description: 'Protect your home, belongings, and personal liability.',
    },
    {
      id: 'bundle',
      icon: <Gift size={32} />,
      label: 'Bundle & Save',
      description: 'Combine car and home insurance and save up to 15%.',
      badge: 'Save 15%',
    },
  ];

  const vehicleYears = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: String(year), label: String(year) };
  });

  return (
    <div className="quote-page">
      {/* Page Header */}
      <section className="quote-header">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="quote-header-content">
              <div className="quote-header-icon">
                <Calculator size={40} />
              </div>
              <Heading className="quote-page-title">Get Your Instant Quote</Heading>
              <p className="quote-page-subtitle">
                Answer a few quick questions and get a personalized estimate in under 2 minutes.
              </p>
            </div>
          </Column>
        </Grid>
      </section>

      {/* Step Indicator */}
      <section className="quote-steps-bar">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="step-indicators">
              {STEPS.map((label, idx) => (
                <div
                  key={label}
                  className={`step-indicator ${idx < currentStep ? 'step-complete' : ''} ${idx === currentStep ? 'step-current' : ''}`}
                >
                  <div className="step-circle">
                    {idx < currentStep ? <CheckmarkFilled size={16} /> : <span>{idx + 1}</span>}
                  </div>
                  <span className="step-label">{label}</span>
                  {idx < STEPS.length - 1 && <div className="step-connector" />}
                </div>
              ))}
            </div>
          </Column>
        </Grid>
      </section>

      {/* Form Content */}
      <section className="quote-form-section">
        <Grid>
          <Column lg={{ span: 10, offset: 3 }} md={8} sm={4}>

            {/* Step 0: Coverage Type */}
            {currentStep === 0 && (
              <div className="quote-step">
                <h2 className="step-question">What would you like to insure?</h2>
                <div className="coverage-type-grid">
                  {coverageOptions.map(option => (
                    <button
                      key={option.id}
                      className={`coverage-card ${formData.coverageType === option.id ? 'coverage-card--selected' : ''}`}
                      onClick={() => updateField('coverageType', option.id)}
                    >
                      {option.badge && (
                        <div className="coverage-badge">{option.badge}</div>
                      )}
                      <div className="coverage-card-icon">{option.icon}</div>
                      <h3 className="coverage-card-label">{option.label}</h3>
                      <p className="coverage-card-description">{option.description}</p>
                      {formData.coverageType === option.id && (
                        <div className="coverage-selected-check">
                          <CheckmarkFilled size={20} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="step-actions">
                  <Button
                    kind="primary"
                    size="lg"
                    renderIcon={ArrowRight}
                    onClick={handleNext}
                    disabled={!canProceedStep0}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 1: Details */}
            {currentStep === 1 && (
              <div className="quote-step">
                <h2 className="step-question">Tell us about your coverage needs</h2>

                {/* Car fields */}
                {(formData.coverageType === 'car' || formData.coverageType === 'bundle') && (
                  <div className="details-group">
                    {formData.coverageType === 'bundle' && (
                      <h3 className="details-group-heading">
                        <Car size={20} /> Car Details
                      </h3>
                    )}
                    <div className="details-fields">
                      <Select
                        id="vehicle-year"
                        labelText="Vehicle Year"
                        value={formData.vehicleYear}
                        onChange={e => updateField('vehicleYear', e.target.value)}
                      >
                        {vehicleYears.map(y => (
                          <SelectItem key={y.value} value={y.value} text={y.label} />
                        ))}
                      </Select>

                      <Select
                        id="coverage-level"
                        labelText="Coverage Level"
                        value={formData.coverageLevel}
                        onChange={e => updateField('coverageLevel', e.target.value)}
                      >
                        <SelectItem value="basic" text="Basic – Liability only" />
                        <SelectItem value="standard" text="Standard – Collision & liability" />
                        <SelectItem value="comprehensive" text="Comprehensive – Full coverage" />
                      </Select>

                      <Select
                        id="annual-mileage"
                        labelText="Annual Mileage"
                        value={formData.annualMileage}
                        onChange={e => updateField('annualMileage', e.target.value)}
                      >
                        <SelectItem value="low" text="Under 7,500 miles" />
                        <SelectItem value="medium" text="7,500 – 15,000 miles" />
                        <SelectItem value="high" text="Over 15,000 miles" />
                      </Select>
                    </div>
                  </div>
                )}

                {/* Home fields */}
                {(formData.coverageType === 'home' || formData.coverageType === 'bundle') && (
                  <div className="details-group">
                    {formData.coverageType === 'bundle' && (
                      <h3 className="details-group-heading">
                        <HomeIcon size={20} /> Home Details
                      </h3>
                    )}
                    <div className="details-fields">
                      <Select
                        id="home-value"
                        labelText="Estimated Home Value"
                        value={formData.homeValue}
                        onChange={e => updateField('homeValue', e.target.value)}
                      >
                        <SelectItem value="under200k" text="Under $200,000" />
                        <SelectItem value="200kto500k" text="$200,000 – $500,000" />
                        <SelectItem value="500kto1m" text="$500,000 – $1,000,000" />
                        <SelectItem value="over1m" text="Over $1,000,000" />
                      </Select>

                      <Select
                        id="home-type"
                        labelText="Property Type"
                        value={formData.homeType}
                        onChange={e => updateField('homeType', e.target.value)}
                      >
                        <SelectItem value="single" text="Single-family home" />
                        <SelectItem value="townhouse" text="Townhouse" />
                        <SelectItem value="condo" text="Condo / Apartment" />
                      </Select>

                      <Select
                        id="home-age"
                        labelText="Home Age"
                        value={formData.homeAge}
                        onChange={e => updateField('homeAge', e.target.value)}
                      >
                        <SelectItem value="new" text="Built in last 10 years" />
                        <SelectItem value="medium" text="10 – 30 years old" />
                        <SelectItem value="old" text="Over 30 years old" />
                      </Select>
                    </div>
                  </div>
                )}

                <div className="step-actions step-actions--split">
                  <Button kind="ghost" size="lg" renderIcon={ArrowLeft} iconDescription="Back" onClick={handleBack}>
                    Back
                  </Button>
                  <Button kind="primary" size="lg" renderIcon={ArrowRight} onClick={handleNext} disabled={!canProceedStep1}>
                    Calculate My Quote
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Results */}
            {currentStep === 2 && estimate && (
              <div className="quote-step">
                <div className="quote-result-header">
                  <CheckmarkFilled size={40} className="result-success-icon" />
                  <h2 className="step-question">Your Personalized Estimate</h2>
                  <p className="result-disclaimer">Based on the information provided. Final rates may vary.</p>
                </div>

                {/* Main Estimate */}
                <Tile className="estimate-main-tile">
                  <p className="estimate-label">Estimated Monthly Premium</p>
                  <div className="estimate-range">
                    <span className="estimate-amount">${estimate.low} – ${estimate.high}</span>
                    <span className="estimate-period">/ month</span>
                  </div>
                  {formData.coverageType === 'bundle' && (
                    <Tag type="green" className="bundle-savings-tag">
                      Bundle discount applied – saving ~15%
                    </Tag>
                  )}
                </Tile>

                {/* Breakdown */}
                {formData.coverageType === 'bundle' && (
                  <div className="estimate-breakdown">
                    <h3 className="breakdown-heading">Coverage Breakdown</h3>
                    <div className="breakdown-items">
                      <div className="breakdown-item">
                        <div className="breakdown-icon"><Car size={20} /></div>
                        <span className="breakdown-label">Car Insurance</span>
                        <span className="breakdown-value">~${estimate.carMonthly}/mo</span>
                      </div>
                      <div className="breakdown-item">
                        <div className="breakdown-icon"><HomeIcon size={20} /></div>
                        <span className="breakdown-label">Home Insurance</span>
                        <span className="breakdown-value">~${estimate.homeMonthly}/mo</span>
                      </div>
                      <div className="breakdown-divider" />
                      <div className="breakdown-item breakdown-item--total">
                        <span className="breakdown-label">Bundle Total (15% off)</span>
                        <span className="breakdown-value">~${estimate.total}/mo</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* What's Included */}
                <div className="estimate-includes">
                  <h3 className="includes-heading">What's included</h3>
                  <div className="includes-list">
                    {(formData.coverageType === 'car' || formData.coverageType === 'bundle') && (
                      <>
                        <div className="include-item"><CheckmarkFilled size={16} /> Collision & liability coverage</div>
                        <div className="include-item"><CheckmarkFilled size={16} /> 24/7 roadside assistance</div>
                        <div className="include-item"><CheckmarkFilled size={16} /> Rental car reimbursement</div>
                      </>
                    )}
                    {(formData.coverageType === 'home' || formData.coverageType === 'bundle') && (
                      <>
                        <div className="include-item"><CheckmarkFilled size={16} /> Property damage protection</div>
                        <div className="include-item"><CheckmarkFilled size={16} /> Personal liability coverage</div>
                        <div className="include-item"><CheckmarkFilled size={16} /> Natural disaster coverage</div>
                      </>
                    )}
                    <div className="include-item"><CheckmarkFilled size={16} /> No hidden fees</div>
                    <div className="include-item"><CheckmarkFilled size={16} /> Cancel anytime</div>
                  </div>
                </div>

                <div className="step-actions step-actions--result">
                  <Button
                    kind="primary"
                    size="lg"
                    renderIcon={ArrowRight}
                    onClick={() => navigate('/signup')}
                  >
                    Start My Application
                  </Button>
                  <Button
                    kind="ghost"
                    size="lg"
                    onClick={() => {
                      setCurrentStep(0);
                      setFormData({
                        coverageType: '',
                        vehicleYear: '2022',
                        coverageLevel: 'standard',
                        annualMileage: 'medium',
                        homeValue: '200kto500k',
                        homeType: 'single',
                        homeAge: 'medium',
                      });
                      setEstimate(null);
                    }}
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            )}

          </Column>
        </Grid>
      </section>

      {/* Trust Indicators */}
      <section className="quote-trust-section">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="trust-items">
              <div className="trust-item">
                <CheckmarkFilled size={20} />
                <span>No commitment required</span>
              </div>
              <div className="trust-item">
                <CheckmarkFilled size={20} />
                <span>Your data is secure</span>
              </div>
              <div className="trust-item">
                <CheckmarkFilled size={20} />
                <span>No spam calls</span>
              </div>
              <div className="trust-item">
                <CheckmarkFilled size={20} />
                <span>Rates from top carriers</span>
              </div>
            </div>
          </Column>
        </Grid>
      </section>
    </div>
  );
}
