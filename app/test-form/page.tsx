"use client";

import { InquiryForm } from '@/components/inquiry-form';

export default function TestFormPage() {
  const handleSuccess = () => {
    console.log('Form submitted successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Venue Inquiry Form</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <InquiryForm 
          category="Wedding Venue"
          city="New York"
          state="NY"
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
