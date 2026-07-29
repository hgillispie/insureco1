import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Button,
  Heading,
  TextInput,
  Select,
  SelectItem,
  DatePicker,
  DatePickerInput,
  Form,
  TileGroup,
  RadioTile,
} from '@carbon/react';
import { ArrowLeft, ArrowRight, Checkmark, Car, Home as HomeIcon } from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import { isValidEmail, isValidPhone, isValidZipCode, formatDateForInput } from '../utils/businessHelpers';
import { saveSignUpSubmission } from '../utils/signupSubmissions';
import './SignUpPage.scss';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const STEPS = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'address', label: 'Address' },
  { key: 'insurance', label: 'Insurance Type' },
  { key: 'coverage', label: 'Coverage & Review' },
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    insuranceType: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) {
        newErrors.email = 'Email address is required';
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'Enter a valid email address';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!isValidPhone(formData.phone)) {
        newErrors.phone = 'Enter a valid 10-digit phone number';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    } else if (step === 1) {
      if (!formData.streetAddress) newErrors.streetAddress = 'Street address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zip) {
        newErrors.zip = 'Zip code is required';
      } else if (!isValidZipCode(formData.zip)) {
        newErrors.zip = 'Enter a valid zip code';
      }
    } else if (step === 2) {
      if (!formData.insuranceType) newErrors.insuranceType = 'Please select an insurance type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    saveSignUpSubmission(formData);
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <Heading className="step-content__title">Personal Information</Heading>
            </div>
            <p className="step-content__description">
              Let's start with some basic information about you.
            </p>

            <Form>
              <TextInput
                id="first-name"
                labelText="First Name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                invalid={!!errors.firstName}
                invalidText={errors.firstName}
              />

              <TextInput
                id="last-name"
                labelText="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                invalid={!!errors.lastName}
                invalidText={errors.lastName}
              />

              <TextInput
                id="email"
                type="email"
                labelText="Email Address"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                invalid={!!errors.email}
                invalidText={errors.email}
              />

              <TextInput
                id="phone"
                type="tel"
                labelText="Phone Number"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                invalid={!!errors.phone}
                invalidText={errors.phone}
              />

              <DatePicker
                datePickerType="single"
                onChange={(dates) => handleChange('dateOfBirth', formatDateForInput(dates?.[0] || ''))}
              >
                <DatePickerInput
                  id="date-of-birth"
                  labelText="Date of Birth"
                  placeholder="mm/dd/yyyy"
                  invalid={!!errors.dateOfBirth}
                  invalidText={errors.dateOfBirth}
                />
              </DatePicker>
            </Form>
          </div>
        );

      case 1:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <Heading className="step-content__title">Your Address</Heading>
            </div>
            <p className="step-content__description">Let us know where you live</p>

            <Form>
              <TextInput
                id="street-address"
                labelText="Street Address"
                placeholder="123 Main Street"
                value={formData.streetAddress}
                onChange={(e) => handleChange('streetAddress', e.target.value)}
                invalid={!!errors.streetAddress}
                invalidText={errors.streetAddress}
              />

              <TextInput
                id="city"
                labelText="City"
                placeholder="Your city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                invalid={!!errors.city}
                invalidText={errors.city}
              />

              <Select
                id="state"
                labelText="State"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                invalid={!!errors.state}
                invalidText={errors.state}
              >
                <SelectItem value="" text="Select state" />
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state} text={state} />
                ))}
              </Select>

              <TextInput
                id="zip"
                labelText="Zip"
                placeholder="12345"
                value={formData.zip}
                onChange={(e) => handleChange('zip', e.target.value)}
                invalid={!!errors.zip}
                invalidText={errors.zip}
              />
            </Form>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <Heading className="step-content__title">What Will You Insure</Heading>
            </div>
            <p className="step-content__description">Which insurance coverage are you looking for</p>

            <TileGroup
              className="insurance-type-tiles"
              name="insurance-type"
              legend="Insurance type"
              valueSelected={formData.insuranceType}
              onChange={(value) => handleChange('insuranceType', value)}
            >
              <RadioTile id="insurance-car" value="car" className="insurance-type-tile">
                <div className="insurance-type-tile__content">
                  <Car size={30} />
                  <div className="insurance-type-tile__text">
                    <h4>Car Insurance</h4>
                    <p>Get comprehensive coverage for your vehicle</p>
                  </div>
                </div>
              </RadioTile>

              <RadioTile id="insurance-home" value="home" className="insurance-type-tile">
                <div className="insurance-type-tile__content">
                  <HomeIcon size={30} />
                  <div className="insurance-type-tile__text">
                    <h4>Home Insurance</h4>
                    <p>Protect your most important asset for your family</p>
                  </div>
                </div>
              </RadioTile>

              <RadioTile id="insurance-both" value="both" className="insurance-type-tile">
                <div className="insurance-type-tile__content">
                  <div className="insurance-type-tile__icons">
                    <Car size={30} />
                    <HomeIcon size={30} />
                  </div>
                  <div className="insurance-type-tile__text">
                    <h4>Both Home and Car</h4>
                    <p>Insure both and get bundle savings</p>
                  </div>
                </div>
              </RadioTile>
            </TileGroup>
            {errors.insuranceType && (
              <p className="insurance-type-tiles__error">{errors.insuranceType}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-content__header">
              <Heading className="step-content__title">Coverage &amp; Review</Heading>
            </div>
            <p className="step-content__description">
              We're still building out the coverage selection and review steps. Check back soon
              to finish setting up your policy.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Grid fullWidth className="signup-page">
      <Column lg={16} md={8} sm={4} className="signup-page__hero-section">
        <div className="signup-page__hero">
          <Heading className="signup-page__hero-title">Sign Up for InsureCo</Heading>
          <p className="signup-page__hero-subtitle">
            Get started with your insurance coverage in just a few steps
          </p>
        </div>
      </Column>

      <Column lg={16} md={8} sm={4} className="signup-page__progress-section">
        <div className="signup-page__progress-panel">
          <StepBreadcrumb steps={STEPS} currentIndex={currentStep} />
        </div>
      </Column>

      <Column lg={{ span: 12, offset: 2 }} md={8} sm={4}>
        <Tile className="signup-page__form-tile">{renderStepContent()}</Tile>
      </Column>

      <Column lg={{ span: 12, offset: 2 }} md={8} sm={4}>
        <div className="signup-page__navigation">
          {currentStep > 0 && (
            <Button kind="secondary" renderIcon={ArrowLeft} onClick={handleBack}>
              Back
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button kind="primary" renderIcon={ArrowRight} onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button kind="primary" renderIcon={Checkmark} onClick={handleSubmit}>
              Submit sign up
            </Button>
          )}
        </div>
      </Column>
    </Grid>
  );
}
