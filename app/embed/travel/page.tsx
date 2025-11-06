'use client';

import React from 'react';
import { TravelInsuranceForm } from '../../../components/TravelInsuranceForm';
import { Toaster } from '../../../components/ui/sonner';

/**
 * Travel Insurance Form Embed
 * 
 * This route provides a standalone embeddable version of the travel insurance form.
 * Perfect for integrating into other React/Next.js applications.
 * 
 * Usage in another app:
 * <iframe src="http://localhost:3000/embed/travel" width="100%" height="800px" />
 * 
 * Or as a component import (if same codebase):
 * import TravelInsuranceForm from './components/TravelInsuranceForm';
 */
export default function TravelEmbedPage() {
  const handleFormDataChange = (data: any) => {
    // Log form data changes for debugging
    console.log('Travel Insurance Form Data:', data);
    
    // You can post messages to parent window if embedded in iframe
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'TRAVEL_FORM_UPDATE',
        data: data
      }, '*');
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-background">
        <TravelInsuranceForm
          showStepper={true}
          stepperType="progress"
          borderRadius="rounded"
          spacing="comfortable"
          labelPosition="top"
          inputSize="md"
          template="simple"
          onFormDataChange={handleFormDataChange}
        />
      </div>
      <Toaster />
    </>
  );
}
