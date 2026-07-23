import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Button,
  TextInput,
  Select,
  SelectItem,
  NumberInput,
  DatePicker,
  DatePickerInput,
  TileGroup,
  RadioTile,
  Checkbox,
  CheckboxGroup,
  Stack,
  ProgressIndicator,
  ProgressStep,
} from '@carbon/react';
import { ArrowLeft, ArrowRight, Checkmark, Car, Home as HomeIcon } from '@carbon/icons-react';
import { formatDateForInput } from '../utils/businessHelpers';
import './SignUpPage.scss';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
];

const HOME_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Mobile Home'];
const COVERAGE_LEVELS = ['Basic', 'Standard', 'Premium'];
const DEDUCTIBLES = ['$250', '$500', '$1,000', '$2,500'];
const ADDITIONAL_COVERAGE_OPTIONS = [
  { key: 'roadside', label: 'Roadside Assistance' },
  { key: 'rental', label: 'Rental Reimbursement' },
  { key: 'gap', label: 'Gap Insurance' },
  { key: 'water', label: 'Water Backup Coverage' },
];

const CURRENT_YEAR = new Date().getFullYear();
const VEHICLE_YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR + 1 - i);
const HOME_YEARS = Array.from({ length: CURRENT_YEAR - 1799 }, (_, i) => CURRENT_YEAR - i);

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

function getSteps(insuranceType) {
  const steps = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'address', label: 'Address' },
    { key: 'insurance', label: 'Insurance Type' },
  ];

  if (insuranceType === 'car' || insuranceType === 'both') {
    steps.push({ key: 'car', label: 'Car Details' });
  }
  if (insuranceType === 'home' || insuranceType === 'both') {
    steps.push({ key: 'home', label: 'Home Details' });
  }

  steps.push({ key: 'coverage', label: 'Coverage' });
  steps.push({ key: 'review', label: 'Review' });

  return steps;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const steps = getSteps(formData.insuranceType);
  const currentKey = steps[currentStep].key;
  const isLastStep = currentStep === steps.length - 1;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAdditionalCoverage = (key) => {
    setFormData((prev) => {
      const exists = prev.additionalCoverage.includes(key);
      return {
        ...prev,
        additionalCoverage: exists
          ? prev.additionalCoverage.filter((item) => item !== key)
          : [...prev.additionalCoverage, key],
      };
    });
  };

  const isStepValid = () => {
    switch (currentKey) {
      case 'personal':
        return Boolean(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 'address':
        return Boolean(formData.streetAddress && formData.city && formData.state && formData.zipCode);
      case 'insurance':
        return Boolean(formData.insuranceType);
      case 'car':
        return Boolean(formData.carMake && formData.carModel && formData.carYear);
      case 'home':
        return Boolean(formData.homeType && formData.homeYear && formData.homeSquareFeet);
      case 'coverage':
        return Boolean(formData.coverageLevel && formData.deductible);
      default:
        return true;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (isLastStep) {
      // Mock submission - would POST to backend in production
      console.log('Sign-up form submitted:', formData);
      navigate('/dashboard');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    scrollToTop();
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    scrollToTop();
  };

  const stepMeta = {
    personal: {
      title: 'Personal Information',
      description: "Let's start with some basic information about you.",
    },
    address: {
      title: 'Your Address',
      description: 'Let us know where you live',
    },
    insurance: {
      title: 'What Will You Insure',
      description: 'Which insurance coverage are you looking for',
    },
    car: {
      title: 'Car Details',
      description: 'Tell us about your car',
    },
    home: {
      title: 'Home Details',
      description: 'Tell us about your home',
    },
    coverage: {
      title: 'Coverage Preferences',
      description: 'Choose the coverage level that works for you',
    },
    review: {
      title: 'Review & Confirm',
      description: 'Please review your information before submitting',
    },
  };

  return (
    <Grid fullWidth className="signup-page">
      <Column lg={16} md={8} sm={4}>
        <div className="signup-page__container">
          <div className="signup-banner">
            <h1 className="signup-banner__title">Sign Up for InsureCo</h1>
            <p className="signup-banner__subtitle">
              Get started with your insurance coverage in just a few steps
            </p>
          </div>

          <div className="signup-progress">
            <ProgressIndicator currentIndex={currentStep} spaceEqually>
              {steps.map((step) => (
                <ProgressStep key={step.key} label={step.label} />
              ))}
            </ProgressIndicator>
          </div>

          <div className="signup-card">
            <div className="signup-card__header">
              <h2 className="signup-card__title">{stepMeta[currentKey].title}</h2>
            </div>
            <p className="signup-card__description">{stepMeta[currentKey].description}</p>

            <div className="signup-card__body">
              {currentKey === 'personal' && (
                <Stack gap={6}>
                  <TextInput
                    id="firstName"
                    labelText="First Name"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                  />
                  <TextInput
                    id="lastName"
                    labelText="Last Name"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                  />
                  <TextInput
                    id="email"
                    type="email"
                    labelText="Email Address"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                  <TextInput
                    id="phone"
                    type="tel"
                    labelText="Phone Number"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                  <DatePicker
                    datePickerType="single"
                    dateFormat="m/d/Y"
                    onChange={(dates) => updateField('dateOfBirth', formatDateForInput(dates?.[0] || ''))}
                  >
                    <DatePickerInput
                      id="dateOfBirth"
                      labelText="Date of Birth"
                      placeholder="mm/dd/yyyy"
                      value={formData.dateOfBirth}
                    />
                  </DatePicker>
                </Stack>
              )}

              {currentKey === 'address' && (
                <Stack gap={6}>
                  <TextInput
                    id="streetAddress"
                    labelText="Street Address"
                    placeholder="123 Main Street"
                    value={formData.streetAddress}
                    onChange={(e) => updateField('streetAddress', e.target.value)}
                  />
                  <TextInput
                    id="city"
                    labelText="City"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                  <Select
                    id="state"
                    labelText="State"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                  >
                    <SelectItem value="" text="" />
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state} text={state} />
                    ))}
                  </Select>
                  <TextInput
                    id="zipCode"
                    labelText="Zip"
                    placeholder="(555) 123-4567"
                    value={formData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                  />
                </Stack>
              )}

              {currentKey === 'insurance' && (
                <TileGroup
                  name="insurance-type"
                  valueSelected={formData.insuranceType}
                  onChange={(value) => updateField('insuranceType', value)}
                  className="insurance-type-tiles"
                >
                  <RadioTile value="car" id="insurance-car" className="insurance-type-tile">
                    <div className="insurance-type-tile__content">
                      <Car size={30} className="insurance-type-tile__icon" />
                      <div className="insurance-type-tile__text">
                        <span className="insurance-type-tile__title">Car Insurance</span>
                        <span className="insurance-type-tile__desc">
                          Get comprehensive coverage for your vehicle
                        </span>
                      </div>
                    </div>
                  </RadioTile>
                  <RadioTile value="home" id="insurance-home" className="insurance-type-tile">
                    <div className="insurance-type-tile__content">
                      <HomeIcon size={30} className="insurance-type-tile__icon" />
                      <div className="insurance-type-tile__text">
                        <span className="insurance-type-tile__title">Home Insurance</span>
                        <span className="insurance-type-tile__desc">
                          Protect your most important asset for your family
                        </span>
                      </div>
                    </div>
                  </RadioTile>
                  <RadioTile value="both" id="insurance-both" className="insurance-type-tile">
                    <div className="insurance-type-tile__content">
                      <span className="insurance-type-tile__icon-group">
                        <Car size={30} className="insurance-type-tile__icon" />
                        <HomeIcon size={30} className="insurance-type-tile__icon" />
                      </span>
                      <div className="insurance-type-tile__text">
                        <span className="insurance-type-tile__title">Both Home and Car</span>
                        <span className="insurance-type-tile__desc">
                          Insure both and get bundle savings
                        </span>
                      </div>
                    </div>
                  </RadioTile>
                </TileGroup>
              )}

              {currentKey === 'car' && (
                <Stack gap={6}>
                  <TextInput
                    id="carMake"
                    labelText="Make"
                    placeholder="e.g. Toyota, Ford"
                    value={formData.carMake}
                    onChange={(e) => updateField('carMake', e.target.value)}
                  />
                  <TextInput
                    id="carModel"
                    labelText="Model"
                    placeholder="e.g. Corolla, Bronco"
                    value={formData.carModel}
                    onChange={(e) => updateField('carModel', e.target.value)}
                  />
                  <Select
                    id="carYear"
                    labelText="Year"
                    value={formData.carYear}
                    onChange={(e) => updateField('carYear', e.target.value)}
                  >
                    <SelectItem value="" text="" />
                    {VEHICLE_YEARS.map((year) => (
                      <SelectItem key={year} value={String(year)} text={String(year)} />
                    ))}
                  </Select>
                  <TextInput
                    id="carVin"
                    labelText="VIN (optional)"
                    placeholder=""
                    helperText="17 digits"
                    value={formData.carVin}
                    onChange={(e) => updateField('carVin', e.target.value)}
                  />
                </Stack>
              )}

              {currentKey === 'home' && (
                <Stack gap={6}>
                  <Select
                    id="homeType"
                    labelText="Home Type"
                    value={formData.homeType}
                    onChange={(e) => updateField('homeType', e.target.value)}
                  >
                    <SelectItem value="" text="" />
                    {HOME_TYPES.map((type) => (
                      <SelectItem key={type} value={type} text={type} />
                    ))}
                  </Select>
                  <Select
                    id="homeYear"
                    labelText="Year Built"
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
                    helperText="We'll confirm this more accurately later"
                    value={formData.homeSquareFeet}
                    onChange={(e, { value }) => updateField('homeSquareFeet', value)}
                    min={0}
                  />
                  <NumberInput
                    id="homeValue"
                    label="Estimated Home Value"
                    helperText="We'll confirm this more accurately later"
                    value={formData.homeValue}
                    onChange={(e, { value }) => updateField('homeValue', value)}
                    min={0}
                  />
                </Stack>
              )}

              {currentKey === 'coverage' && (
                <Stack gap={6}>
                  <Select
                    id="coverageLevel"
                    labelText="Coverage Level"
                    value={formData.coverageLevel}
                    onChange={(e) => updateField('coverageLevel', e.target.value)}
                  >
                    <SelectItem value="" text="" />
                    {COVERAGE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level} text={level} />
                    ))}
                  </Select>
                  <Select
                    id="deductible"
                    labelText="Deductible"
                    value={formData.deductible}
                    onChange={(e) => updateField('deductible', e.target.value)}
                  >
                    <SelectItem value="" text="" />
                    {DEDUCTIBLES.map((amount) => (
                      <SelectItem key={amount} value={amount} text={amount} />
                    ))}
                  </Select>
                  <CheckboxGroup legendText="Additional Coverage Options">
                    {ADDITIONAL_COVERAGE_OPTIONS.map((option) => (
                      <Checkbox
                        key={option.key}
                        id={`coverage-${option.key}`}
                        labelText={option.label}
                        checked={formData.additionalCoverage.includes(option.key)}
                        onChange={() => toggleAdditionalCoverage(option.key)}
                      />
                    ))}
                  </CheckboxGroup>
                </Stack>
              )}

              {currentKey === 'review' && (
                <div className="signup-review">
                  <div className="signup-review__section">
                    <h3 className="signup-review__heading">Personal Information</h3>
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.email}</p>
                    <p>{formData.phone}</p>
                    {formData.dateOfBirth && <p>DOB: {formData.dateOfBirth}</p>}
                  </div>
                  <div className="signup-review__section">
                    <h3 className="signup-review__heading">Address</h3>
                    <p>{formData.streetAddress}</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                  </div>
                  <div className="signup-review__section">
                    <h3 className="signup-review__heading">Insurance Type</h3>
                    <p>{formData.insuranceType === 'both' ? 'Home and Car' : formData.insuranceType}</p>
                  </div>
                  {(formData.insuranceType === 'car' || formData.insuranceType === 'both') && (
                    <div className="signup-review__section">
                      <h3 className="signup-review__heading">Car Details</h3>
                      <p>{formData.carYear} {formData.carMake} {formData.carModel}</p>
                      {formData.carVin && <p>VIN: {formData.carVin}</p>}
                    </div>
                  )}
                  {(formData.insuranceType === 'home' || formData.insuranceType === 'both') && (
                    <div className="signup-review__section">
                      <h3 className="signup-review__heading">Home Details</h3>
                      <p>{formData.homeType}, built {formData.homeYear}</p>
                      <p>{formData.homeSquareFeet} sq ft</p>
                    </div>
                  )}
                  <div className="signup-review__section">
                    <h3 className="signup-review__heading">Coverage</h3>
                    <p>{formData.coverageLevel} coverage, {formData.deductible} deductible</p>
                    {formData.additionalCoverage.length > 0 && (
                      <p>
                        Add-ons:{' '}
                        {formData.additionalCoverage
                          .map((key) => ADDITIONAL_COVERAGE_OPTIONS.find((o) => o.key === key)?.label)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="signup-card__footer">
              {currentStep > 0 && (
                <Button kind="secondary" renderIcon={ArrowLeft} onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                kind="primary"
                renderIcon={isLastStep ? Checkmark : ArrowRight}
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                {isLastStep ? 'Complete Sign Up' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </Column>
    </Grid>
  );
}
