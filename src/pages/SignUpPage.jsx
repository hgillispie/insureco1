import React, { useState } from 'react';
import {
  Button,
  DatePicker,
  DatePickerInput,
  Form,
  Heading,
  RadioTile,
  Select,
  SelectItem,
  Tile,
  TileGroup,
  TextInput,
} from '@carbon/react';
import { ArrowLeft, ArrowRight, Car, Home as HomeIcon } from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import {
  formatDateForInput,
  isValidEmail,
  isValidPhone,
  isValidZipCode,
} from '../utils/businessHelpers';
import './SignUpPage.scss';

const steps = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'address', label: 'Address' },
  { key: 'coverage', label: 'Coverage' },
];

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const initialFormData = {
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
};

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const nextErrors = {};

    if (step === 0) {
      if (!formData.firstName.trim()) nextErrors.firstName = 'Enter your first name.';
      if (!formData.lastName.trim()) nextErrors.lastName = 'Enter your last name.';
      if (!formData.email.trim()) {
        nextErrors.email = 'Enter your email address.';
      } else if (!isValidEmail(formData.email)) {
        nextErrors.email = 'Enter a valid email address.';
      }
      if (!formData.phone.trim()) {
        nextErrors.phone = 'Enter your phone number.';
      } else if (!isValidPhone(formData.phone)) {
        nextErrors.phone = 'Enter a valid 10-digit phone number.';
      }
      if (!formData.dateOfBirth) nextErrors.dateOfBirth = 'Enter your date of birth.';
    }

    if (step === 1) {
      if (!formData.streetAddress.trim()) nextErrors.streetAddress = 'Enter your street address.';
      if (!formData.city.trim()) nextErrors.city = 'Enter your city.';
      if (!formData.state) nextErrors.state = 'Select your state.';
      if (!formData.zipCode.trim()) {
        nextErrors.zipCode = 'Enter your ZIP code.';
      } else if (!isValidZipCode(formData.zipCode)) {
        nextErrors.zipCode = 'Enter a valid ZIP code.';
      }
    }

    if (step === 2 && !formData.insuranceType) {
      nextErrors.insuranceType = 'Choose an insurance coverage option.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPersonalInformation = () => (
    <Form className="signup-form" aria-label="Personal information">
      <TextInput
        id="first-name"
        labelText="First Name"
        placeholder="Enter your first name"
        value={formData.firstName}
        onChange={(event) => handleInputChange('firstName', event.target.value)}
        invalid={Boolean(errors.firstName)}
        invalidText={errors.firstName}
      />
      <TextInput
        id="last-name"
        labelText="Last Name"
        placeholder="Enter your last name"
        value={formData.lastName}
        onChange={(event) => handleInputChange('lastName', event.target.value)}
        invalid={Boolean(errors.lastName)}
        invalidText={errors.lastName}
      />
      <TextInput
        id="email"
        type="email"
        labelText="Email Address"
        placeholder="your.email@example.com"
        value={formData.email}
        onChange={(event) => handleInputChange('email', event.target.value)}
        invalid={Boolean(errors.email)}
        invalidText={errors.email}
      />
      <TextInput
        id="phone"
        type="tel"
        labelText="Phone Number"
        placeholder="(555) 123-4567"
        value={formData.phone}
        onChange={(event) => handleInputChange('phone', event.target.value)}
        invalid={Boolean(errors.phone)}
        invalidText={errors.phone}
      />
      <DatePicker
        datePickerType="single"
        onChange={(dates) => handleInputChange('dateOfBirth', formatDateForInput(dates?.[0] || ''))}
      >
        <DatePickerInput
          id="date-of-birth"
          labelText="Date of Birth"
          placeholder="mm/dd/yyyy"
          value={formData.dateOfBirth}
          invalid={Boolean(errors.dateOfBirth)}
          invalidText={errors.dateOfBirth}
        />
      </DatePicker>
    </Form>
  );

  const renderAddress = () => (
    <Form className="signup-form" aria-label="Address">
      <TextInput
        id="street-address"
        labelText="Street Address"
        placeholder="123 Main Street"
        value={formData.streetAddress}
        onChange={(event) => handleInputChange('streetAddress', event.target.value)}
        invalid={Boolean(errors.streetAddress)}
        invalidText={errors.streetAddress}
      />
      <TextInput
        id="city"
        labelText="City"
        placeholder="Your city"
        value={formData.city}
        onChange={(event) => handleInputChange('city', event.target.value)}
        invalid={Boolean(errors.city)}
        invalidText={errors.city}
      />
      <Select
        id="state"
        labelText="State"
        value={formData.state}
        onChange={(event) => handleInputChange('state', event.target.value)}
        invalid={Boolean(errors.state)}
        invalidText={errors.state}
      >
        <SelectItem value="" text="Select a state" />
        {usStates.map((state) => (
          <SelectItem key={state} value={state} text={state} />
        ))}
      </Select>
      <TextInput
        id="zip-code"
        inputMode="numeric"
        labelText="Zip"
        placeholder="12345"
        value={formData.zipCode}
        onChange={(event) => handleInputChange('zipCode', event.target.value)}
        invalid={Boolean(errors.zipCode)}
        invalidText={errors.zipCode}
      />
    </Form>
  );

  const renderInsuranceType = () => (
    <div className="signup-insurance-options">
      <TileGroup
        name="insurance-type"
        valueSelected={formData.insuranceType}
        onChange={(value) => handleInputChange('insuranceType', value)}
      >
        <RadioTile id="car-insurance" value="car" className="signup-insurance-option">
          <Car size={30} aria-hidden="true" />
          <span className="signup-insurance-option__content">
            <span className="signup-insurance-option__title">Car Insurance</span>
            <span className="signup-insurance-option__description">Get comprehensive coverage for your vehicle</span>
          </span>
        </RadioTile>
        <RadioTile id="home-insurance" value="home" className="signup-insurance-option">
          <HomeIcon size={30} aria-hidden="true" />
          <span className="signup-insurance-option__content">
            <span className="signup-insurance-option__title">Home Insurance</span>
            <span className="signup-insurance-option__description">Protect your most important asset for your family</span>
          </span>
        </RadioTile>
        <RadioTile id="bundle-insurance" value="both" className="signup-insurance-option">
          <span className="signup-insurance-option__icons" aria-hidden="true">
            <Car size={30} />
            <HomeIcon size={30} />
          </span>
          <span className="signup-insurance-option__content">
            <span className="signup-insurance-option__title">Both Home and Car</span>
            <span className="signup-insurance-option__description">Insure both and get bundle savings</span>
          </span>
        </RadioTile>
      </TileGroup>
      {errors.insuranceType && <p className="signup-insurance-error">{errors.insuranceType}</p>}
    </div>
  );

  const content = [
    {
      title: 'Personal Information',
      description: "Let's start with some basic information about you.",
      form: renderPersonalInformation(),
    },
    {
      title: 'Your Address',
      description: 'Let us know where you live',
      form: renderAddress(),
    },
    {
      title: 'What Will You Insure',
      description: 'Which insurance coverage are you looking for',
      form: renderInsuranceType(),
    },
  ][currentStep];

  return (
    <main className="signup-page">
      <div className="signup-page__top">
        <section className="signup-hero" aria-labelledby="signup-title">
          <Heading id="signup-title" className="signup-hero__title">Sign Up for InsureCo</Heading>
          <p className="signup-hero__subtitle">Get started with your insurance coverage in just a few steps</p>
        </section>

        <nav className="signup-progress" aria-label="Sign-up progress">
          <StepBreadcrumb steps={steps} currentIndex={currentStep} />
        </nav>
      </div>

      <section className="signup-card" aria-labelledby="signup-step-title">
        <div className="signup-card__header">
          <Heading id="signup-step-title" className="signup-card__title">{content.title}</Heading>
        </div>
        <p className="signup-card__description">{content.description}</p>
        {content.form}
        <div className="signup-actions">
          {currentStep > 0 && (
            <Button kind="secondary" renderIcon={ArrowLeft} onClick={handleBack}>
              Back
            </Button>
          )}
          <Button renderIcon={ArrowRight} onClick={handleNext}>
            Next
          </Button>
        </div>
      </section>
    </main>
  );
}
