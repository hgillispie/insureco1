import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DatePicker,
  DatePickerInput,
  ProgressIndicator,
  ProgressStep,
  RadioTile,
  Select,
  SelectItem,
  TextInput,
  TileGroup,
} from '@carbon/react';
import { ArrowLeft, ArrowRight, Car, Home } from '@carbon/icons-react';
import { formatDateForInput } from '../utils/businessHelpers';
import './SignUpPage.scss';

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
  'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
  'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
  'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const STEPS = [
  { key: 'personal', label: 'Personal Info', nodeId: '11148:21182' },
  { key: 'address', label: 'Address', nodeId: '11152:24746' },
  { key: 'insurance', label: 'Insurance Type', nodeId: '11152:26346' },
];

const INSURANCE_OPTIONS = [
  {
    value: 'car',
    title: 'Car Insurance',
    description: 'Get comprehensive coverage for your vehicle',
    icons: [Car],
    nodeId: '11152:26535',
  },
  {
    value: 'home',
    title: 'Home Insurance',
    description: 'Protect your most important asset for your family',
    icons: [Home],
    nodeId: '11152:28153',
  },
  {
    value: 'both',
    title: 'Both Home and Car',
    description: 'Insure both and get bundle savings',
    icons: [Car, Home],
    nodeId: '11152:28154',
  },
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
};

export default function SignUpPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const stepKey = STEPS[currentStep].key;
  const isLastStep = currentStep === STEPS.length - 1;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (stepKey) {
      case 'personal':
        return Boolean(
          formData.firstName.trim() &&
            formData.lastName.trim() &&
            formData.email.trim() &&
            formData.phone.trim() &&
            formData.dateOfBirth
        );
      case 'address':
        return Boolean(
          formData.streetAddress.trim() &&
            formData.city.trim() &&
            formData.state &&
            formData.zipCode.trim()
        );
      case 'insurance':
        return Boolean(formData.insuranceType);
      default:
        return true;
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isStepValid()) return;

    if (isLastStep) {
      // eslint-disable-next-line no-console
      console.log('Sign-up submitted', formData);
      navigate('/dashboard');
    } else {
      goToStep(currentStep + 1);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <header className="signup-hero" data-node-id="11148:21186">
          <h1 className="signup-hero__title">Sign Up for InsureCo</h1>
          <p className="signup-hero__subtitle">
            Get started with your insurance coverage in just a few steps
          </p>
        </header>

        <nav className="signup-progress" aria-label="Sign-up progress" data-node-id="11148:21190">
          <ProgressIndicator currentIndex={currentStep} spaceEqually>
            {STEPS.map((step) => (
              <ProgressStep key={step.key} label={step.label} />
            ))}
          </ProgressIndicator>
        </nav>

        <form
          className="signup-card"
          onSubmit={handleSubmit}
          noValidate
          data-node-id={STEPS[currentStep].nodeId}
        >
          {stepKey === 'personal' && (
            <PersonalInfoStep formData={formData} updateField={updateField} />
          )}
          {stepKey === 'address' && (
            <AddressStep formData={formData} updateField={updateField} />
          )}
          {stepKey === 'insurance' && (
            <InsuranceTypeStep formData={formData} updateField={updateField} />
          )}

          <div className="signup-actions" data-node-id="11152:29381">
            {currentStep > 0 && (
              <Button
                kind="secondary"
                type="button"
                renderIcon={ArrowLeft}
                onClick={() => goToStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            <Button
              kind="primary"
              type="submit"
              renderIcon={ArrowRight}
              disabled={!isStepValid()}
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StepHeader({ title, description }) {
  return (
    <>
      <h2 className="signup-step__title">{title}</h2>
      <p className="signup-step__description">{description}</p>
    </>
  );
}

function PersonalInfoStep({ formData, updateField }) {
  return (
    <div className="signup-step">
      <StepHeader
        title="Personal Information"
        description="Let's start with some basic information about you."
      />
      <div className="signup-fields">
        <TextInput
          id="firstName"
          labelText="First Name"
          placeholder="Enter your first name"
          autoComplete="given-name"
          value={formData.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
        />
        <TextInput
          id="lastName"
          labelText="Last Name"
          placeholder="Enter your last name"
          autoComplete="family-name"
          value={formData.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
        />
        <TextInput
          id="email"
          type="email"
          labelText="Email Address"
          placeholder="your.email@example.com"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
        <TextInput
          id="phone"
          type="tel"
          labelText="Phone Number"
          placeholder="(555) 123-4567"
          autoComplete="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
        <DatePicker
          datePickerType="single"
          dateFormat="m/d/Y"
          maxDate={new Date()}
          className="signup-date-picker"
          onChange={(dates) => updateField('dateOfBirth', formatDateForInput(dates?.[0] || ''))}
        >
          <DatePickerInput
            id="dateOfBirth"
            labelText="Date of Birth"
            placeholder="mm/dd/yyyy"
            value={formData.dateOfBirth}
          />
        </DatePicker>
      </div>
    </div>
  );
}

function AddressStep({ formData, updateField }) {
  return (
    <div className="signup-step">
      <StepHeader title="Your Address" description="Let us know where you live" />
      <div className="signup-fields">
        <TextInput
          id="streetAddress"
          labelText="Street Address"
          placeholder="123 Main Street"
          autoComplete="street-address"
          value={formData.streetAddress}
          onChange={(e) => updateField('streetAddress', e.target.value)}
        />
        <TextInput
          id="city"
          labelText="City"
          placeholder="Your city"
          autoComplete="address-level2"
          value={formData.city}
          onChange={(e) => updateField('city', e.target.value)}
        />
        <div className="signup-field--half">
          <Select
            id="state"
            labelText="State"
            value={formData.state}
            onChange={(e) => updateField('state', e.target.value)}
          >
            <SelectItem value="" text="" />
            {STATES.map((abbr) => (
              <SelectItem key={abbr} value={abbr} text={abbr} />
            ))}
          </Select>
        </div>
        <TextInput
          id="zipCode"
          labelText="Zip"
          placeholder="12345"
          autoComplete="postal-code"
          inputMode="numeric"
          value={formData.zipCode}
          onChange={(e) => updateField('zipCode', e.target.value)}
        />
      </div>
    </div>
  );
}

function InsuranceTypeStep({ formData, updateField }) {
  return (
    <div className="signup-step">
      <StepHeader
        title="What Will You Insure"
        description="Which insurance coverage are you looking for"
      />
      <TileGroup
        legend={<span className="cds--visually-hidden">Insurance type</span>}
        name="insurance-type"
        valueSelected={formData.insuranceType}
        onChange={(value) => updateField('insuranceType', value)}
        className="signup-tiles"
      >
        {INSURANCE_OPTIONS.map(({ value, title, description, icons, nodeId }) => (
          <RadioTile
            key={value}
            id={`insurance-${value}`}
            value={value}
            className="signup-tile"
            data-node-id={nodeId}
          >
            <span className="signup-tile__content">
              <span className="signup-tile__icons" aria-hidden="true">
                {icons.map((Icon, i) => (
                  <Icon key={i} size={32} />
                ))}
              </span>
              <span className="signup-tile__text">
                <span className="signup-tile__title">{title}</span>
                <span className="signup-tile__description">{description}</span>
              </span>
            </span>
          </RadioTile>
        ))}
      </TileGroup>
    </div>
  );
}
