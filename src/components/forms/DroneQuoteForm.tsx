'use client';

import { useState, useCallback } from 'react';
import { droneQuoteSchema } from '@/lib/validations/drone-quote';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

export function DroneQuoteForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    propertyAddress: '',
    propertyType: 'residential',
    serviceType: ['photography'] as string[],
    acreage: '',
    timeline: 'asap',
    budget: '500-1000',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        serviceType: checked
          ? [...prev.serviceType, value]
          : prev.serviceType.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFieldChange = useCallback(
    (fieldName: string) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    },
    []
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      // Validate data
      droneQuoteSchema.parse(formData);

      const response = await fetch('/api/drone-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quote request');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        propertyAddress: '',
        propertyType: 'residential',
        serviceType: ['photography'],
        acreage: '',
        timeline: 'asap',
        budget: '500-1000',
        notes: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-900 p-4 text-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-900 p-4 text-green-100">
          Quote request submitted successfully! We'll contact you soon.
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Full Name *
        </label>
        <Input
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-2 bg-slate-700 text-white placeholder-slate-400"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Email *
        </label>
        <Input
          type="email"
          name="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-2 bg-slate-700 text-white placeholder-slate-400"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Phone Number *
        </label>
        <Input
          type="tel"
          name="phone"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={handleChange}
          required
          className="mt-2 bg-slate-700 text-white placeholder-slate-400"
        />
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Company (Optional)
        </label>
        <Input
          type="text"
          name="company"
          placeholder="Your Company"
          value={formData.company}
          onChange={handleChange}
          className="mt-2 bg-slate-700 text-white placeholder-slate-400"
        />
      </div>

      {/* Property Address */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Property Address *
        </label>
        <Input
          type="text"
          name="propertyAddress"
          placeholder="123 Main St, City, State 12345"
          value={formData.propertyAddress}
          onChange={handleChange}
          required
          className="mt-2 bg-slate-700 text-white placeholder-slate-400"
        />
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Property Type *
        </label>
        <Select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleFieldChange('propertyType')}
          options={[
            { value: 'residential', label: 'Residential' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'land', label: 'Land' },
            { value: 'development', label: 'Development' },
            { value: 'other', label: 'Other' },
          ]}
          className="mt-2 bg-slate-700 text-white"
        />
      </div>

      {/* Service Type */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Services Needed *
        </label>
        <div className="mt-2 space-y-2">
          {['photography', 'video', 'mapping', 'inspection'].map((service) => (
            <label key={service} className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                name="serviceType"
                value={service}
                checked={formData.serviceType.includes(service)}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700"
              />
              <span className="capitalize">{service}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Acreage */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Acreage (Optional)
        </label>
        <Input
          type="text"
          name="acreage"
          placeholder="e.g., 2.5 acres"
          value={formData.acreage}
          onChange={handleChange}
          className="mt-2 bg-slate-700 text-white placeholder-slate-400"
        />
      </div>

      {/* Timeline */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Timeline *
        </label>
        <Select
          name="timeline"
          value={formData.timeline}
          onChange={handleFieldChange('timeline')}
          options={[
            { value: 'asap', label: 'ASAP' },
            { value: '1-2-weeks', label: '1-2 weeks' },
            { value: '1-month', label: '1 month' },
            { value: 'flexible', label: 'Flexible' },
          ]}
          className="mt-2 bg-slate-700 text-white"
        />
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Budget Range *
        </label>
        <Select
          name="budget"
          value={formData.budget}
          onChange={handleFieldChange('budget')}
          options={[
            { value: '500-1000', label: '$500 - $1,000' },
            { value: '1000-2500', label: '$1,000 - $2,500' },
            { value: '2500-5000', label: '$2,500 - $5,000' },
            { value: '5000+', label: '$5,000+' },
          ]}
          className="mt-2 bg-slate-700 text-white"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-white">
          Additional Notes (Optional)
        </label>
        <Textarea
          placeholder="Any special requirements or details..."
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="mt-2 bg-slate-700 text-white placeholder-slate-400"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="primary"
        className="w-full bg-red-600 py-3 font-bold hover:bg-red-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Request Quote'}
      </Button>
    </form>
  );
}
