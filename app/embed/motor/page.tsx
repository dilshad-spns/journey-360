'use client';

import React from 'react';
import { DeathClaimForm } from '../../../components/DeathClaimForm';
import { Toaster } from '../../../components/ui/sonner';

/**
 * Death Claim Form Embed (Motor/Universal Life Product)
 * 
 * This route provides a standalone embeddable version of the death claim form
 * for the Universal Life Product in the North America Agent Portal.
 * Perfect for integrating into other React/Next.js applications.
 * 
 * Usage in another app:
 * <iframe src="http://localhost:3000/embed/motor" width="100%" height="800px" />
 * 
 * Or as a component import (if same codebase):
 * import DeathClaimForm from './components/DeathClaimForm';
 */
export default function MotorEmbedPage() {
  const handleFormDataChange = (data: any) => {
    // Log form data changes for debugging
    console.log('Death Claim Form Data:', data);
    
    // You can post messages to parent window if embedded in iframe
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'DEATH_CLAIM_FORM_UPDATE',
        data: data
      }, '*');
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-background">
        <DeathClaimForm
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
