import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  ProgressIndicator,
  ProgressStep,
  Stack,
  TextInput,
  Select,
  SelectItem,
  NumberInput,
  RadioButtonGroup,
  RadioButton,
  Checkbox,
  TileGroup,
  RadioTile,
  Button,
  Heading,
} from '@carbon/react';
import { ArrowLeft, ArrowRight, Checkmark, Car, Home } from '@carbon/icons-react';
import './SignUpPage.scss';

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
  'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
  'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
  'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const HOME_YEARS = Array.from({ length: 2025 - 1800 + 1 }, (_, i) => 2025 - i);

const ALL_STEPS = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'address', label: 'Address' },
  { key: 'insurance', label: 'Insurance Type' },
  { key: 'car', label: 'Car Details' },
  { key: 'home', label: 'Home Details' },
  { key: 'coverage', label: 'Coverage' },
  { key: 'review', label: 'Review' },
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
  carVin: '',
  homeType: '',
  homeYear: '',
  homeSquareFeet: '',
  homeValue: '',
  coverageLevel: '',
  deductible: '',
  additionalCoverage: [],
};

export default function SignUpPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const activeSteps = ALL_STEPS.filter((step) => {
    if (step.key === 'car') return formData.insuranceType === 'car' || formData.insuranceType === 'both';
    if (step.key === 'home') return formData.insuranceType === 'home' || formData.insuranceType === 'both';
    return true;
  });

  const stepKey = activeSteps[currentStep].key;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAdditionalCoverage = (option) => {
    setFormData((prev) => ({
      ...prev,
      additionalCoverage: prev.additionalCoverage.includes(option)
        ? prev.additionalCoverage.filter((item) => item !== option)
        : [...prev.additionalCoverage, option],
    }));
  };

  const isStepValid = () => {
    switch (stepKey) {
      case 'personal':
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 'address':
        return formData.streetAddress && formData.city && formData.state && formData.zipCode;
      case 'insurance':
        return Boolean(formData.insuranceType);
      case 'car':
        return formData.carMake && formData.carModel && formData.carYear;
      case 'home':
        return formData.homeType && formData.homeYear && formData.homeSquareFeet;
      case 'coverage':
        return formData.coverageLevel && formData.deductible;
      default:
        return true;
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('Sign-up submitted', formData);
    navigate('/dashboard');
  };

  return (
    <Grid fullWidth className="signup-page">
      <Column lg={16} md={8} sm={4}>
        <div className="signup-container">
          <div className="signup-hero">
            <Heading className="signup-hero-title">Sign Up for InsureCo</Heading>
            <p className="signup-hero-subtitle">
              Get started with your insurance coverage in just a few steps
            </p>
          </div>

          <div className="signup-progress">
            <ProgressIndicator currentIndex={currentStep} spaceEqually>
              {activeSteps.map((step) => (
                <ProgressStep key={step.key} label={step.label} />
              ))}
            </ProgressIndicator>
          </div>

          <div className="signup-card">
            {stepKey === 'personal' && (
              <PersonalInfoStep formData={formData} updateField={updateField} />
            )}
            {stepKey === 'address' && (
              <AddressStep formData={formData} updateField={updateField} />
            )}
            {stepKey === 'insurance' && (
              <InsuranceTypeStep formData={formData} updateField={updateField} />
            )}
            {stepKey === 'car' && (
              <CarDetailsStep formData={formData} updateField={updateField} />
            )}
            {stepKey === 'home' && (
              <HomeDetailsStep formData={formData} updateField={updateField} />
            )}
            {stepKey === 'coverage' && (
              <CoverageStep
                formData={formData}
                updateField={updateField}
                toggleAdditionalCoverage={toggleAdditionalCoverage}
              />
            )}
            {stepKey === 'review' && <ReviewStep formData={formData} />}

            <div className="signup-actions">
              {currentStep > 0 && (
                <Button kind="secondary" renderIcon={ArrowLeft} onClick={handleBack}>
                  Back
                </Button>
              )}
              {stepKey !== 'review' ? (
                <Button
                  kind="primary"
                  renderIcon={ArrowRight}
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next
                </Button>
              ) : (
                <Button kind="primary" renderIcon={Checkmark} onClick={handleSubmit}>
                  Complete Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </Column>
    </Grid>
  );
}

function StepHeader({ title, description }) {
  return (
    <div className="signup-step-header">
      <Heading as="h2" className="signup-step-title">{title}</Heading>
      <p className="signup-step-description">{description}</p>
    </div>
  );
}

function PersonalInfoStep({ formData, updateField }) {
  return (
    <div className="signup-step">
      <StepHeader
        title="Personal Information"
        description="Let's start with some basic information about you."
      />
      <Stack gap={6}>
        <TextInput
          id="firstName"
          labelText="First Name"
          placeholder="Enter your first name"
          size="lg"
          value={formData.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
        />
        <TextInput
          id="lastName"
          labelText="Last Name"
          placeholder="Enter your last name"
          size="lg"
          value={formData.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
        />
        <TextInput
          id="email"
          type="email"
          labelText="Email Address"
          placeholder="your.email@example.com"
          size="lg"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
        <TextInput
          id="phone"
          type="tel"
          labelText="Phone Number"
          placeholder="(555) 123-4567"
          size="lg"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
        <TextInput
          id="dateOfBirth"
          type="date"
          labelText="Date of Birth"
          size="lg"
          value={formData.dateOfBirth}
          onChange={(e) => updateField('dateOfBirth', e.target.value)}
        />
      </Stack>
    </div>
  );
}

function AddressStep({ formData, updateField }) {
  return (
    <div className="signup-step">
      <StepHeader title="Your Address" description="Let us know where you live" />
      <Stack gap={6}>
        <TextInput
          id="streetAddress"
          labelText="Street Address"
          placeholder="123 Main Street"
          size="lg"
          value={formData.streetAddress}
          onChange={(e) => updateField('streetAddress', e.target.value)}
        />
        <TextInput
          id="city"
          labelText="City"
          placeholder="Your city"
          size="lg"
          value={formData.city}
          onChange={(e) => updateField('city', e.target.value)}
        />
        <Select
          id="state"
          labelText="State"
          size="lg"
          value={formData.state}
          onChange={(e) => updateField('state', e.target.value)}
        >
          <SelectItem value="" text="" />
          {STATES.map((state) => (
            <SelectItem key={state} value={state} text={state} />
          ))}
        </Select>
        <TextInput
          id="zipCode"
          labelText="Zip"
          placeholder="12345"
          size="lg"
          value={formData.zipCode}
          onChange={(e) => updateField('zipCode', e.target.value)}
        />
      </Stack>
    </div>
  );
}

function InsuranceTypeStep({ formData, updateField }) {
  return (
    <div className="signup-step">
      <StepHeader title="What Will You Insure" description="Which insurance coverage are you looking for" />
      <TileGroup
        name="insuranceType"
        className="insurance-tile-group"
        valueSelected={formData.insuranceType}
        onChange={(value) => updateField('insuranceType', value)}
      >
        <RadioTile className="insurance-tile" value="car" id="insurance-car">
          <div className="insurance-tile-content">
            <Car size={30} />
            <div className="insurance-tile-text">
              <div className="insurance-tile-title">Car Insurance</div>
              <div className="insurance-tile-description">
                Get comprehensive coverage for your vehicle
              </div>
            </div>
          </div>
        </RadioTile>
        <RadioTile className="insurance-tile" value="home" id="insurance-home">
          <div className="insurance-tile-content">
            <Home size={30} />
            <div className="insurance-tile-text">
              <div className="insurance-tile-title">Home Insurance</div>
              <div className="insurance-tile-description">
                Protect your most important asset for your family
              </div>
            </div>
          </div>
        </RadioTile>
        <RadioTile className="insurance-tile" value="both" id="insurance-both">
          <div className="insurance-tile-content">
            <div className="insurance-tile-icons">
              <Car size={30} />
              <Home size={30} />
            </div>
            <div className="insurance-tile-text">
              <div className="insurance-tile-title">Both Home and Car</div>
              <div className="insurance-tile-description">Insure both and get bundle savings</div>
            </div>
          </div>
        </RadioTile>
      </TileGroup>
    </div>
  );
}

function CarDetailsStep({ formData, updateField }) {
  return (
    <div className="signup-step">
      <StepHeader title="Car Details" description="Tell us about your car" />
      <Stack gap={6}>
        <TextInput
          id="carMake"
          labelText="Make"
          placeholder="e.g. Toyota, Ford"
          size="lg"
          value={formData.carMake}
          onChange={(e) => updateField('carMake', e.target.value)}
        />
        <TextInput
          id="carModel"
          labelText="Model"
          placeholder="e.g. Corolla, Bronco"
          size="lg"
          value={formData.carModel}
          onChange={(e) => updateField('carModel', e.target.value)}
        />
        <Select
          id="carYear"
          labelText="Year"
          size="lg"
          value={formData.carYear}
          onChange={(e) => updateField('carYear', e.target.value)}
        >
          <SelectItem value="" text="" />
          {HOME_YEARS.map((year) => (
            <SelectItem key={year} value={String(year)} text={String(year)} />
          ))}
        </Select>
        <TextInput
          id="carVin"
          labelText="VIN (optional)"
          size="lg"
          helperText="17 digits"
          value={formData.carVin}
          onChange={(e) => updateField('carVin', e.target.value)}
        />
      </Stack>
    </div>
  );
}

function HomeDetailsStep({ formData, updateField }) {
  return (
    <div className="signup-step">
      <StepHeader title="Home Details" description="Tell us about your home" />
      <Stack gap={6}>
        <Select
          id="homeType"
          labelText="Home Type"
          size="lg"
          value={formData.homeType}
          onChange={(e) => updateField('homeType', e.target.value)}
        >
          <SelectItem value="" text="" />
          <SelectItem value="single-family" text="Single Family" />
          <SelectItem value="condo" text="Condo" />
          <SelectItem value="townhouse" text="Townhouse" />
          <SelectItem value="apartment" text="Apartment" />
        </Select>
        <Select
          id="homeYear"
          labelText="Year Built"
          size="lg"
          value={formData.homeYear}
          onChange={(e) => updateField('homeYear', e.target.value)}
        >
          <SelectItem value="" text="" />
          {HOME_YEARS.map((year) => (
            <SelectItem key={year} value={String(year)} text={String(year)} />
          ))}
        </Select>
        <NumberInput
          id="homeSquareFeet"
          label="Square Feet"
          size="lg"
          helperText="We'll confirm this more accurately later"
          value={formData.homeSquareFeet}
          onChange={(e, { value }) => updateField('homeSquareFeet', value)}
        />
        <NumberInput
          id="homeValue"
          label="Estimated Home Value"
          size="lg"
          helperText="We'll confirm this more accurately later"
          value={formData.homeValue}
          onChange={(e, { value }) => updateField('homeValue', value)}
        />
      </Stack>
    </div>
  );
}

function CoverageStep({ formData, updateField, toggleAdditionalCoverage }) {
  const additionalOptions = ['Roadside Assistance', 'Rental Reimbursement', 'Identity Theft Protection'];

  return (
    <div className="signup-step">
      <StepHeader title="Coverage Preferences" description="Choose the coverage that fits your needs" />
      <Stack gap={6}>
        <RadioButtonGroup
          legendText="Coverage Level"
          name="coverageLevel"
          valueSelected={formData.coverageLevel}
          onChange={(value) => updateField('coverageLevel', value)}
          orientation="vertical"
        >
          <RadioButton labelText="Basic" value="basic" id="coverage-basic" />
          <RadioButton labelText="Standard" value="standard" id="coverage-standard" />
          <RadioButton labelText="Premium" value="premium" id="coverage-premium" />
        </RadioButtonGroup>
        <Select
          id="deductible"
          labelText="Deductible"
          size="lg"
          value={formData.deductible}
          onChange={(e) => updateField('deductible', e.target.value)}
        >
          <SelectItem value="" text="" />
          <SelectItem value="250" text="$250" />
          <SelectItem value="500" text="$500" />
          <SelectItem value="1000" text="$1,000" />
          <SelectItem value="2500" text="$2,500" />
        </Select>
        <div className="signup-checkbox-group">
          <p className="signup-checkbox-legend">Additional Coverage</p>
          {additionalOptions.map((option) => (
            <Checkbox
              key={option}
              id={`coverage-${option}`}
              labelText={option}
              checked={formData.additionalCoverage.includes(option)}
              onChange={() => toggleAdditionalCoverage(option)}
            />
          ))}
        </div>
      </Stack>
    </div>
  );
}

function ReviewStep({ formData }) {
  return (
    <div className="signup-step">
      <StepHeader title="Review & Confirm" description="Please review your information before submitting" />
      <div className="signup-review-grid">
        <ReviewSection
          title="Personal Information"
          rows={[
            ['Name', `${formData.firstName} ${formData.lastName}`],
            ['Email', formData.email],
            ['Phone', formData.phone],
            ['Date of Birth', formData.dateOfBirth],
          ]}
        />
        <ReviewSection
          title="Address"
          rows={[
            ['Street', formData.streetAddress],
            ['City', formData.city],
            ['State', formData.state],
            ['Zip', formData.zipCode],
          ]}
        />
        <ReviewSection title="Insurance Type" rows={[['Type', formData.insuranceType]]} />
        {(formData.insuranceType === 'car' || formData.insuranceType === 'both') && (
          <ReviewSection
            title="Car Details"
            rows={[
              ['Make', formData.carMake],
              ['Model', formData.carModel],
              ['Year', formData.carYear],
              ['VIN', formData.carVin || '—'],
            ]}
          />
        )}
        {(formData.insuranceType === 'home' || formData.insuranceType === 'both') && (
          <ReviewSection
            title="Home Details"
            rows={[
              ['Home Type', formData.homeType],
              ['Year Built', formData.homeYear],
              ['Square Feet', formData.homeSquareFeet],
              ['Estimated Value', formData.homeValue],
            ]}
          />
        )}
        <ReviewSection
          title="Coverage"
          rows={[
            ['Level', formData.coverageLevel],
            ['Deductible', formData.deductible],
            ['Additional', formData.additionalCoverage.join(', ') || 'None'],
          ]}
        />
      </div>
    </div>
  );
}

function ReviewSection({ title, rows }) {
  return (
    <div className="signup-review-section">
      <h4 className="signup-review-title">{title}</h4>
      <dl className="signup-review-list">
        {rows.map(([label, value]) => (
          <div className="signup-review-row" key={label}>
            <dt>{label}</dt>
            <dd>{value || '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
