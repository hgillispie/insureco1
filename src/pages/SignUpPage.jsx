import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Column,
  DatePicker,
  DatePickerInput,
  Form,
  Grid,
  Heading,
  InlineNotification,
  NumberInput,
  RadioTile,
  Select,
  SelectItem,
  TextInput,
  Tile,
  TileGroup,
} from '@carbon/react';
import { ArrowLeft, ArrowRight, Car, Checkmark, Home } from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import { formatDateForInput } from '../utils/businessHelpers';
import './SignUpPage.scss';

const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'],
  ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];

const COVERAGE_OPTIONS = [
  { id: 'roadside', label: 'Roadside assistance' },
  { id: 'rental', label: 'Rental vehicle reimbursement' },
  { id: 'identity', label: 'Identity theft protection' },
];

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  insuranceType: '',
  carMake: '',
  carModel: '',
  carYear: '',
  carMileage: '',
  annualMileage: '',
  carVin: '',
  homeType: '',
  homeYear: '',
  homeSquareFeet: '',
  homeValue: '',
  coverageLevel: '',
  deductible: '',
  additionalCoverage: [],
};

function parseInputDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;

  const [, month, day, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year)
    || date.getMonth() !== Number(month) - 1
    || date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label || 'Not provided';
}

function ReviewItem({ label, value }) {
  return (
    <div className="signup-review-item">
      <dt>{label}</dt>
      <dd>{value || 'Not provided'}</dd>
    </div>
  );
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const transitionTimers = useRef([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [showReviewNotice, setShowReviewNotice] = useState(true);

  const currentYear = new Date().getFullYear();
  const vehicleYears = useMemo(
    () => Array.from({ length: 40 }, (_, index) => String(currentYear + 1 - index)),
    [currentYear],
  );
  const propertyYears = useMemo(
    () => Array.from({ length: currentYear - 1799 }, (_, index) => String(currentYear - index)),
    [currentYear],
  );

  const steps = useMemo(() => {
    const flowSteps = [
      { key: 'personal', label: 'Your Info', description: 'Personal details' },
      { key: 'address', label: 'Address', description: 'Where you live' },
      { key: 'insurance', label: 'Insurance', description: 'What to insure' },
    ];

    if (formData.insuranceType === 'car' || formData.insuranceType === 'both') {
      flowSteps.push({ key: 'car', label: 'Car Details', description: 'Vehicle information' });
    }
    if (formData.insuranceType === 'home' || formData.insuranceType === 'both') {
      flowSteps.push({ key: 'property', label: 'Home Details', description: 'Property information' });
    }

    flowSteps.push(
      { key: 'coverage', label: 'Coverage', description: 'Choose protection' },
      { key: 'review', label: 'Review', description: 'Confirm details' },
    );
    return flowSteps;
  }, [formData.insuranceType]);

  const activeStep = steps[currentStep] || steps[0];

  useEffect(() => () => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: '' }));
    }
  };

  const validateStep = (stepKey) => {
    const nextErrors = {};
    const required = (field, message = 'Required') => {
      if (!String(formData[field] ?? '').trim()) nextErrors[field] = message;
    };

    if (stepKey === 'personal') {
      required('firstName', 'Enter your first name');
      required('lastName', 'Enter your last name');
      required('email', 'Enter your email address');
      required('phone', 'Enter your phone number');
      required('dateOfBirth', 'Enter your date of birth');

      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nextErrors.email = 'Enter a valid email address';
      }
      if (formData.phone && formData.phone.replace(/\D/g, '').length !== 10) {
        nextErrors.phone = 'Enter a 10-digit phone number';
      }
      if (formData.dateOfBirth) {
        const birthDate = parseInputDate(formData.dateOfBirth);
        const adultCutoff = new Date();
        adultCutoff.setFullYear(adultCutoff.getFullYear() - 18);
        if (!birthDate) nextErrors.dateOfBirth = 'Use the format mm/dd/yyyy';
        else if (birthDate > adultCutoff) nextErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

    if (stepKey === 'address') {
      required('streetAddress', 'Enter your street address');
      required('city', 'Enter your city');
      required('state', 'Select your state');
      required('zipCode', 'Enter your ZIP code');
      if (formData.zipCode && !/^\d{5}$/.test(formData.zipCode)) {
        nextErrors.zipCode = 'Enter a 5-digit ZIP code';
      }
    }

    if (stepKey === 'insurance') {
      required('insuranceType', 'Select the coverage you want');
    }

    if (stepKey === 'car') {
      required('carMake', 'Enter the vehicle make');
      required('carModel', 'Enter the vehicle model');
      required('carYear', 'Select the vehicle year');
      required('carMileage', 'Enter the current mileage');
      required('annualMileage', 'Enter the miles driven per year');
      if (formData.carVin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(formData.carVin)) {
        nextErrors.carVin = 'VIN must be 17 characters with no I, O, or Q';
      }
    }

    if (stepKey === 'property') {
      required('homeType', 'Select a home type');
      required('homeYear', 'Select the year built');
      required('homeSquareFeet', 'Enter the square footage');
      required('homeValue', 'Enter the estimated home value');
    }

    if (stepKey === 'coverage') {
      required('coverageLevel', 'Select a coverage level');
      required('deductible', 'Select a deductible');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const transitionTo = (nextStep, nextDirection) => {
    if (transitionPhase !== 'idle') return;

    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    setDirection(nextDirection);
    setTransitionPhase('exit');

    const swapTimer = window.setTimeout(() => {
      setCurrentStep(nextStep);
      setErrors({});
      setTransitionPhase('enter');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const finishTimer = window.setTimeout(() => setTransitionPhase('idle'), 240);
      transitionTimers.current.push(finishTimer);
    }, 150);

    transitionTimers.current = [swapTimer];
  };

  const handleNext = () => {
    if (!validateStep(activeStep.key)) return;
    transitionTo(Math.min(currentStep + 1, steps.length - 1), 'forward');
  };

  const handleBack = () => {
    transitionTo(Math.max(currentStep - 1, 0), 'backward');
  };

  const handleCoverageToggle = (id, checked) => {
    const nextCoverage = checked
      ? [...formData.additionalCoverage, id]
      : formData.additionalCoverage.filter((option) => option !== id);
    updateField('additionalCoverage', nextCoverage);
  };

  const handleSubmit = () => {
    navigate('/dashboard', {
      state: {
        notification: {
          kind: 'success',
          title: 'Welcome to InsureCo',
          subtitle: 'Your information was submitted successfully. We will be in touch with your quote.',
        },
      },
    });
  };

  const renderPersonalStep = () => (
    <>
      <div className="signup-section-header">
        <Heading className="signup-section-title">Hello Greg</Heading>
      </div>
      <p className="signup-section-description">Let's start with some basic information about you.</p>
      <Form className="signup-form" onSubmit={(event) => event.preventDefault()}>
        <TextInput
          id="signup-first-name"
          labelText="First Name"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={(event) => updateField('firstName', event.target.value)}
          invalid={Boolean(errors.firstName)}
          invalidText={errors.firstName}
        />
        <TextInput
          id="signup-last-name"
          labelText="Last Name"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={(event) => updateField('lastName', event.target.value)}
          invalid={Boolean(errors.lastName)}
          invalidText={errors.lastName}
        />
        <TextInput
          id="signup-email"
          type="email"
          labelText="Email Address"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(event) => updateField('email', event.target.value)}
          invalid={Boolean(errors.email)}
          invalidText={errors.email}
        />
        <TextInput
          id="signup-phone"
          type="tel"
          labelText="Phone Number"
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          invalid={Boolean(errors.phone)}
          invalidText={errors.phone}
        />
        <DatePicker
          datePickerType="single"
          dateFormat="m/d/Y"
          onChange={(dates) => updateField('dateOfBirth', formatDateForInput(dates?.[0] || ''))}
        >
          <DatePickerInput
            id="signup-date-of-birth"
            labelText="Date of Birth"
            placeholder="mm/dd/yyyy"
            defaultValue={formData.dateOfBirth}
            onChange={(event) => updateField('dateOfBirth', event.target.value)}
            invalid={Boolean(errors.dateOfBirth)}
            invalidText={errors.dateOfBirth}
          />
        </DatePicker>
      </Form>
    </>
  );

  const renderAddressStep = () => (
    <>
      <div className="signup-section-header">
        <Heading className="signup-section-title">Your Address</Heading>
      </div>
      <p className="signup-section-description">Let us know where you live</p>
      <Form className="signup-form" onSubmit={(event) => event.preventDefault()}>
        <TextInput
          id="signup-street-address"
          labelText="Street Address"
          placeholder="123 Main Street"
          value={formData.streetAddress}
          onChange={(event) => updateField('streetAddress', event.target.value)}
          invalid={Boolean(errors.streetAddress)}
          invalidText={errors.streetAddress}
        />
        <TextInput
          id="signup-city"
          labelText="City"
          placeholder="Your city"
          value={formData.city}
          onChange={(event) => updateField('city', event.target.value)}
          invalid={Boolean(errors.city)}
          invalidText={errors.city}
        />
        <Select
          id="signup-state"
          labelText="State"
          value={formData.state}
          onChange={(event) => updateField('state', event.target.value)}
          invalid={Boolean(errors.state)}
          invalidText={errors.state}
        >
          <SelectItem value="" text="Select a state" />
          {US_STATES.map(([value, label]) => (
            <SelectItem key={value} value={value} text={label} />
          ))}
        </Select>
        <TextInput
          id="signup-zip-code"
          labelText="Zip"
          placeholder="12345"
          inputMode="numeric"
          maxLength={5}
          value={formData.zipCode}
          onChange={(event) => updateField('zipCode', event.target.value.replace(/\D/g, ''))}
          invalid={Boolean(errors.zipCode)}
          invalidText={errors.zipCode}
        />
      </Form>
    </>
  );

  const renderInsuranceStep = () => (
    <>
      <div className="signup-section-header">
        <Heading className="signup-section-title">What Will You Insure</Heading>
      </div>
      <p className="signup-section-description">Which insurance coverage are you looking for</p>
      <TileGroup
        className="signup-insurance-options"
        legend="Insurance coverage selection"
        name="insurance-type"
        valueSelected={formData.insuranceType}
        onChange={(value) => updateField('insuranceType', value)}
      >
        <RadioTile id="insurance-car" value="car">
          <div className="signup-insurance-option">
            <Car size={30} />
            <div>
              <h3>Car Insurance</h3>
              <p>Get comprehensive coverage for your vehicle</p>
            </div>
          </div>
        </RadioTile>
        <RadioTile id="insurance-home" value="home">
          <div className="signup-insurance-option">
            <Home size={30} />
            <div>
              <h3>Home Insurance</h3>
              <p>Protect your most important asset for your family</p>
            </div>
          </div>
        </RadioTile>
        <RadioTile id="insurance-both" value="both">
          <div className="signup-insurance-option">
            <div className="signup-insurance-icons" aria-hidden="true">
              <Car size={30} />
              <Home size={30} />
            </div>
            <div>
              <h3>Both Home and Car</h3>
              <p>Insure both and get bundle savings</p>
            </div>
          </div>
        </RadioTile>
      </TileGroup>
      {errors.insuranceType && <p className="signup-selection-error" role="alert">{errors.insuranceType}</p>}
    </>
  );

  const renderCarStep = () => (
    <>
      <div className="signup-section-header">
        <Heading className="signup-section-title">Car Details</Heading>
      </div>
      <p className="signup-section-description">Tell us about your car</p>
      <Form className="signup-form" onSubmit={(event) => event.preventDefault()}>
        <TextInput
          id="signup-car-make"
          labelText="Make"
          placeholder="e.g. Toyota, Ford"
          value={formData.carMake}
          onChange={(event) => updateField('carMake', event.target.value)}
          invalid={Boolean(errors.carMake)}
          invalidText={errors.carMake}
        />
        <TextInput
          id="signup-car-model"
          labelText="Model"
          placeholder="e.g. Corolla, Bronco"
          value={formData.carModel}
          onChange={(event) => updateField('carModel', event.target.value)}
          invalid={Boolean(errors.carModel)}
          invalidText={errors.carModel}
        />
        <Select
          id="signup-car-year"
          labelText="Year"
          value={formData.carYear}
          onChange={(event) => updateField('carYear', event.target.value)}
          invalid={Boolean(errors.carYear)}
          invalidText={errors.carYear}
        >
          <SelectItem value="" text="Select year" />
          {vehicleYears.map((year) => <SelectItem key={year} value={year} text={year} />)}
        </Select>
        <NumberInput
          id="signup-car-mileage"
          label="Mileage"
          min={0}
          value={formData.carMileage}
          onChange={(event, { value }) => updateField('carMileage', value)}
          invalid={Boolean(errors.carMileage)}
          invalidText={errors.carMileage}
        />
        <NumberInput
          id="signup-annual-mileage"
          label="Miles driven per year"
          min={0}
          value={formData.annualMileage}
          onChange={(event, { value }) => updateField('annualMileage', value)}
          invalid={Boolean(errors.annualMileage)}
          invalidText={errors.annualMileage}
        />
        <TextInput
          id="signup-car-vin"
          labelText="VIN (optional)"
          helperText="17 digits"
          maxLength={17}
          value={formData.carVin}
          onChange={(event) => updateField('carVin', event.target.value.toUpperCase())}
          invalid={Boolean(errors.carVin)}
          invalidText={errors.carVin}
        />
      </Form>
    </>
  );

  const renderPropertyStep = () => (
    <>
      <div className="signup-section-header">
        <Heading className="signup-section-title">Property Details</Heading>
      </div>
      <p className="signup-section-description">Tell us about your home</p>
      <Form className="signup-form" onSubmit={(event) => event.preventDefault()}>
        <Select
          id="signup-home-type"
          labelText="Home Type"
          value={formData.homeType}
          onChange={(event) => updateField('homeType', event.target.value)}
          invalid={Boolean(errors.homeType)}
          invalidText={errors.homeType}
        >
          <SelectItem value="" text="Select home type" />
          <SelectItem value="single-family" text="Single-family home" />
          <SelectItem value="condo" text="Condominium" />
          <SelectItem value="townhouse" text="Townhouse" />
          <SelectItem value="mobile" text="Manufactured home" />
        </Select>
        <Select
          id="signup-home-year"
          labelText="Year Built"
          value={formData.homeYear}
          onChange={(event) => updateField('homeYear', event.target.value)}
          invalid={Boolean(errors.homeYear)}
          invalidText={errors.homeYear}
        >
          <SelectItem value="" text="Select year" />
          {propertyYears.map((year) => <SelectItem key={year} value={year} text={year} />)}
        </Select>
        <NumberInput
          id="signup-home-square-feet"
          label="Square Feet"
          helperText="We'll confirm this more accurately later"
          min={1}
          value={formData.homeSquareFeet}
          onChange={(event, { value }) => updateField('homeSquareFeet', value)}
          invalid={Boolean(errors.homeSquareFeet)}
          invalidText={errors.homeSquareFeet}
        />
        <NumberInput
          id="signup-home-value"
          label="Estimated Home Value"
          helperText="We'll confirm this more accurately later"
          min={1}
          value={formData.homeValue}
          onChange={(event, { value }) => updateField('homeValue', value)}
          invalid={Boolean(errors.homeValue)}
          invalidText={errors.homeValue}
        />
      </Form>
    </>
  );

  const renderCoverageStep = () => (
    <>
      <div className="signup-section-header">
        <Heading className="signup-section-title">Coverage Preferences</Heading>
      </div>
      <p className="signup-section-description">Choose the protection that best fits your needs</p>
      <Form className="signup-form" onSubmit={(event) => event.preventDefault()}>
        <Select
          id="signup-coverage-level"
          labelText="Coverage Level"
          value={formData.coverageLevel}
          onChange={(event) => updateField('coverageLevel', event.target.value)}
          invalid={Boolean(errors.coverageLevel)}
          invalidText={errors.coverageLevel}
        >
          <SelectItem value="" text="Select coverage level" />
          <SelectItem value="essential" text="Essential" />
          <SelectItem value="standard" text="Standard" />
          <SelectItem value="premium" text="Premium" />
        </Select>
        <Select
          id="signup-deductible"
          labelText="Deductible"
          value={formData.deductible}
          onChange={(event) => updateField('deductible', event.target.value)}
          invalid={Boolean(errors.deductible)}
          invalidText={errors.deductible}
        >
          <SelectItem value="" text="Select deductible" />
          <SelectItem value="500" text="$500" />
          <SelectItem value="1000" text="$1,000" />
          <SelectItem value="1500" text="$1,500" />
          <SelectItem value="2500" text="$2,500" />
        </Select>
        <fieldset className="signup-checkbox-group">
          <legend>Additional coverage (optional)</legend>
          {COVERAGE_OPTIONS.map((option) => (
            <Checkbox
              key={option.id}
              id={`signup-coverage-${option.id}`}
              labelText={option.label}
              checked={formData.additionalCoverage.includes(option.id)}
              onChange={(event, { checked }) => handleCoverageToggle(option.id, checked)}
            />
          ))}
        </fieldset>
      </Form>
    </>
  );

  const insuranceLabels = {
    car: 'Car Insurance',
    home: 'Home Insurance',
    both: 'Both Home and Car',
  };
  const homeTypeOptions = [
    { value: 'single-family', label: 'Single-family home' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'mobile', label: 'Manufactured home' },
  ];
  const coverageLevelOptions = [
    { value: 'essential', label: 'Essential' },
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
  ];

  const renderReviewStep = () => (
    <>
      <div className="signup-section-header">
        <Heading className="signup-section-title">Review & Confirm</Heading>
      </div>
      <p className="signup-section-description">Review your information before completing sign up</p>
      <div className="signup-review-section">
        <section className="signup-review-group">
          <h3>Personal Information</h3>
          <dl>
            <ReviewItem label="Name" value={`${formData.firstName} ${formData.lastName}`} />
            <ReviewItem label="Email" value={formData.email} />
            <ReviewItem label="Phone" value={formData.phone} />
            <ReviewItem label="Date of Birth" value={formData.dateOfBirth} />
          </dl>
        </section>
        <section className="signup-review-group">
          <h3>Address</h3>
          <dl>
            <ReviewItem label="Street" value={formData.streetAddress} />
            <ReviewItem label="Location" value={`${formData.city}, ${formData.state} ${formData.zipCode}`} />
          </dl>
        </section>
        <section className="signup-review-group">
          <h3>Insurance</h3>
          <dl>
            <ReviewItem label="Coverage for" value={insuranceLabels[formData.insuranceType]} />
            <ReviewItem label="Coverage level" value={getOptionLabel(coverageLevelOptions, formData.coverageLevel)} />
            <ReviewItem label="Deductible" value={formData.deductible ? `$${Number(formData.deductible).toLocaleString()}` : ''} />
          </dl>
        </section>
        {(formData.insuranceType === 'car' || formData.insuranceType === 'both') && (
          <section className="signup-review-group">
            <h3>Car Details</h3>
            <dl>
              <ReviewItem label="Vehicle" value={`${formData.carYear} ${formData.carMake} ${formData.carModel}`} />
              <ReviewItem label="Mileage" value={`${Number(formData.carMileage).toLocaleString()} miles`} />
              <ReviewItem label="Annual mileage" value={`${Number(formData.annualMileage).toLocaleString()} miles`} />
              {formData.carVin && <ReviewItem label="VIN" value={formData.carVin} />}
            </dl>
          </section>
        )}
        {(formData.insuranceType === 'home' || formData.insuranceType === 'both') && (
          <section className="signup-review-group">
            <h3>Property Details</h3>
            <dl>
              <ReviewItem label="Home type" value={getOptionLabel(homeTypeOptions, formData.homeType)} />
              <ReviewItem label="Year built" value={formData.homeYear} />
              <ReviewItem label="Square feet" value={Number(formData.homeSquareFeet).toLocaleString()} />
              <ReviewItem label="Estimated value" value={`$${Number(formData.homeValue).toLocaleString()}`} />
            </dl>
          </section>
        )}
      </div>
      {showReviewNotice && (
        <InlineNotification
          kind="info"
          title="What happens next"
          subtitle="We'll review these details and contact you with a personalized quote."
          aria-label="Dismiss next steps notification"
          statusIconDescription="info"
          onCloseButtonClick={() => setShowReviewNotice(false)}
        />
      )}
    </>
  );

  const renderActiveStep = () => {
    const renderers = {
      personal: renderPersonalStep,
      address: renderAddressStep,
      insurance: renderInsuranceStep,
      car: renderCarStep,
      property: renderPropertyStep,
      coverage: renderCoverageStep,
      review: renderReviewStep,
    };
    return renderers[activeStep.key]?.() || null;
  };

  const transitionClass = transitionPhase === 'idle'
    ? ''
    : ` signup-step-content--${transitionPhase} signup-step-content--${direction}`;

  return (
    <Grid fullWidth className="signup-page">
      <Column lg={16} md={8} sm={4} className="signup-banner-column">
        <div className="signup-banner">
          <Heading className="signup-banner-title">Sign Up for InsureCo</Heading>
          <p className="signup-banner-subtitle">Get started with your insurance coverage in just a few steps</p>
        </div>
      </Column>

      <Column lg={16} md={8} sm={4} className="signup-progress-column">
        <nav className="signup-progress" aria-label="Sign-up progress">
          <StepBreadcrumb steps={steps} currentIndex={currentStep} spaceEqually variant="segmented" />
        </nav>
      </Column>

      <Column lg={12} md={8} sm={4} className="signup-form-column">
        <Tile className="signup-form-tile">
          <div className={`signup-step-content${transitionClass}`} aria-live="polite">
            {renderActiveStep()}
          </div>

          <div className="signup-navigation">
            <Button kind="tertiary" onClick={() => navigate('/')}>Cancel</Button>
            <div className="signup-navigation-primary">
              {currentStep > 0 && (
                <Button kind="secondary" renderIcon={ArrowLeft} onClick={handleBack}>Back</Button>
              )}
              {activeStep.key === 'review' ? (
                <Button kind="primary" renderIcon={Checkmark} onClick={handleSubmit}>Complete Sign Up</Button>
              ) : (
                <Button kind="primary" renderIcon={ArrowRight} onClick={handleNext}>Next</Button>
              )}
            </div>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
