'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { CreateQuoteRequestInput } from '@/lib/validations';

interface QuoteRequestFormProps {
  onSubmit: (data: CreateQuoteRequestInput) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormData extends Omit<CreateQuoteRequestInput, 'preferredDate' | 'alternateDate'> {
  preferredDate?: string;
  alternateDate?: string;
}

const SERVICE_TYPES = [
  { value: 'portrait', label: 'Portrait Photography' },
  { value: 'event', label: 'Event Photography' },
  { value: 'aerial', label: 'Aerial Photography' },
  { value: 'pet', label: 'Pet Photography' },
  { value: 'commercial', label: 'Commercial Photography' },
  { value: 'real-estate', label: 'Real Estate Photography' },
  { value: 'inspection', label: 'Property Inspection' },
  { value: 'other', label: 'Other' }
];

const SESSION_TYPES = {
  portrait: [
    { value: '1-hour-family', label: '1-Hour Family Session' },
    { value: '3-hour-multi-location', label: '3-Hour Multi-Location Session' },
    { value: 'couple-individual', label: 'Couple/Individual Session' }
  ],
  event: [
    { value: 'birthday-party', label: 'Birthday Party' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'family-reunion', label: 'Family Reunion' },
    { value: 'special-occasion', label: 'Special Occasion' }
  ],
  aerial: [
    { value: 'panoramic-views', label: 'Panoramic Views' },
    { value: 'property-overview', label: 'Property Overview' },
    { value: 'event-aerial', label: 'Event Aerial Coverage' }
  ],
  pet: [
    { value: 'single-pet', label: 'Single Pet Session' },
    { value: 'multiple-pets', label: 'Multiple Pets Session' },
    { value: 'pet-family', label: 'Pet & Family Session' }
  ]
};

const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '3-4-weeks', label: '3-4 weeks' },
  { value: '1-2-months', label: '1-2 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: 'flexible', label: 'Flexible' }
];

const BUDGET_OPTIONS = [
  { value: 'under-500', label: 'Under $500' },
  { value: '500-1000', label: '$500 - $1,000' },
  { value: '1000-2000', label: '$1,000 - $2,000' },
  { value: '2000-5000', label: '$2,000 - $5,000' },
  { value: 'over-5000', label: 'Over $5,000' },
  { value: 'discuss', label: 'Prefer to discuss' }
];

export function QuoteRequestForm({ onSubmit, isSubmitting = false }: QuoteRequestFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '' as FormData['serviceType'],
    sessionType: '' as FormData['sessionType'],
    projectDescription: '',
    location: '',
    preferredDate: '',
    alternateDate: '',
    timeline: '',
    budget: '' as FormData['budget'],
    specialRequirements: '',
    petDetails: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 2:
        if (!formData.serviceType) newErrors.serviceType = 'Please select a service type';
        if (!formData.projectDescription.trim()) {
          newErrors.projectDescription = 'Please describe your project';
        } else if (formData.projectDescription.length < 10) {
          newErrors.projectDescription = 'Please provide more details about your project';
        }
        break;
      case 3:
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.timeline) newErrors.timeline = 'Please select a timeline';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      const submitData: CreateQuoteRequestInput = {
        ...formData,
        preferredDate: formData.preferredDate ? new Date(formData.preferredDate) : undefined,
        alternateDate: formData.alternateDate ? new Date(formData.alternateDate) : undefined
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting quote request:', error);
    }
  };

  const getSessionTypes = () => {
    const serviceKey = formData.serviceType as keyof typeof SESSION_TYPES;
    return SESSION_TYPES[serviceKey] || [];
  };

  const isPetService = (formData.serviceType as string) === 'pet';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6">
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-600">Let's start with your basic information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Full Name *"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  error={errors.name}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  error={errors.email}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="(555) 123-4567"
                helperText="Optional, but helpful for quick communication"
              />
            </div>
          </div>
        )}

        {/* Step 2: Service Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Details</h2>
              <p className="text-gray-600">Tell us about the photography service you need</p>
            </div>

            <div>
              <Select
                label="Service Type *"
                value={formData.serviceType}
                onChange={(value) => {
                  updateFormData('serviceType', value);
                  updateFormData('sessionType', ''); // Reset session type when service changes
                }}
                options={SERVICE_TYPES}
                error={errors.serviceType}
                placeholder="Select a service type"
              />
            </div>

            {formData.serviceType && getSessionTypes().length > 0 && (
              <div>
                <Select
                  label="Session Type"
                  value={formData.sessionType}
                  onChange={(value) => updateFormData('sessionType', value)}
                  options={getSessionTypes()}
                  placeholder="Select a session type"
                />
              </div>
            )}

            <div>
              <Textarea
                label="Project Description *"
                value={formData.projectDescription}
                onChange={(e) => updateFormData('projectDescription', e.target.value)}
                error={errors.projectDescription}
                placeholder="Please describe your photography needs, vision, and any specific requirements..."
                rows={4}
                helperText="Minimum 10 characters. The more details you provide, the better we can serve you."
              />
            </div>
          </div>
        )}

        {/* Step 3: Location & Timing */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Timing</h2>
              <p className="text-gray-600">Where and when would you like the session?</p>
            </div>

            <div>
              <Input
                label="Location *"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                error={errors.location}
                placeholder="City, venue, or specific address"
                helperText="Include any specific venue details or accessibility considerations"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DatePicker
                  label="Preferred Date"
                  value={formData.preferredDate}
                  onChange={(value) => updateFormData('preferredDate', value)}
                  placeholder="Select preferred date"
                />
              </div>
              <div>
                <DatePicker
                  label="Alternate Date"
                  value={formData.alternateDate}
                  onChange={(value) => updateFormData('alternateDate', value)}
                  placeholder="Select alternate date"
                />
              </div>
            </div>

            <div>
              <Select
                label="Timeline *"
                value={formData.timeline}
                onChange={(value) => updateFormData('timeline', value)}
                options={TIMELINE_OPTIONS}
                error={errors.timeline}
                placeholder="When do you need this completed?"
              />
            </div>

            <div>
              <Select
                label="Budget Range"
                value={formData.budget}
                onChange={(value) => updateFormData('budget', value)}
                options={BUDGET_OPTIONS}
                placeholder="Select your budget range"
                helperText="This helps us recommend the best package for your needs"
              />
            </div>
          </div>
        )}

        {/* Step 4: Additional Details */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Details</h2>
              <p className="text-gray-600">Any special requirements or additional information?</p>
            </div>

            <div>
              <Textarea
                label="Special Requirements"
                value={formData.specialRequirements}
                onChange={(e) => updateFormData('specialRequirements', e.target.value)}
                placeholder="Any special requests, accessibility needs, or custom package requirements..."
                rows={3}
                helperText="Optional: Let us know about any specific needs or custom requests"
              />
            </div>

            {isPetService && (
              <div>
                <Textarea
                  label="Pet Details"
                  value={formData.petDetails}
                  onChange={(e) => updateFormData('petDetails', e.target.value)}
                  placeholder="Tell us about your pet(s): breed, age, temperament, any special considerations..."
                  rows={3}
                  helperText="This helps us prepare for a comfortable and successful session"
                />
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Pet Photography Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Bring your pet's favorite treats and toys</li>
                    <li>• Schedule during your pet's most active/alert time</li>
                    <li>• Consider a brief walk before the session</li>
                    <li>• We work with all animals: cats, dogs, farm animals, reptiles, and birds</li>
                    <li>• Sessions are conducted in a pet-friendly, comfortable environment</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Request Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div><span className="font-medium">Service:</span> {SERVICE_TYPES.find(s => s.value === formData.serviceType)?.label}</div>
                {formData.sessionType && (
                  <div><span className="font-medium">Session:</span> {getSessionTypes().find(s => s.value === formData.sessionType)?.label}</div>
                )}
                <div><span className="font-medium">Location:</span> {formData.location}</div>
                <div><span className="font-medium">Timeline:</span> {TIMELINE_OPTIONS.find(t => t.value === formData.timeline)?.label}</div>
                {formData.budget && (
                  <div><span className="font-medium">Budget:</span> {BUDGET_OPTIONS.find(b => b.value === formData.budget)?.label}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit Quote Request
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}