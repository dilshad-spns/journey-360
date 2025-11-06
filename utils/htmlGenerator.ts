/**
 * Utility to generate standalone HTML+CSS+JS bundle for forms
 * This creates a fully self-contained embeddable form with glassmorphism design
 */

import { JSONSchema } from '../types/schema';

export interface PublishConfig {
  uuid: string;
  publishedAt: string;
  scriptUrl: string;
  embedCode: string;
  htmlBundle: string;
}

/**
 * Generate a unique UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate standalone HTML+CSS+JS bundle from schema
 */
export function generateHTMLBundle(schema: any, formData?: any): string {
  const uuid = generateUUID();
  
  const cssVariables = `
    :root {
      /* Typography */
      --font-size: 16px;
      --text-h1: 32px;
      --text-h2: 26px;
      --text-h3: 21px;
      --text-h4: 18px;
      --text-base: 14px;
      --text-label: 12px;
      
      /* Colors */
      --background: rgba(250, 251, 252, 1);
      --foreground: rgba(15, 23, 42, 1);
      --card: rgba(255, 255, 255, 1);
      --card-foreground: rgba(15, 23, 42, 1);
      --popover: rgba(255, 255, 255, 1);
      --popover-foreground: rgba(15, 23, 42, 1);
      --primary: rgba(0, 28, 86, 1);
      --primary-foreground: rgba(255, 255, 255, 1);
      --secondary: rgba(241, 245, 249, 1);
      --secondary-foreground: rgba(15, 23, 42, 1);
      --muted: rgba(241, 245, 249, 1);
      --muted-foreground: rgba(100, 116, 139, 1);
      --accent: rgba(14, 165, 233, 1);
      --accent-foreground: rgba(255, 255, 255, 1);
      --destructive: rgba(239, 68, 68, 1);
      --destructive-foreground: rgba(255, 255, 255, 1);
      --success: rgba(34, 197, 94, 1);
      --success-foreground: rgba(255, 255, 255, 1);
      --warning: rgba(234, 179, 8, 1);
      --warning-foreground: rgba(15, 23, 42, 1);
      --border: rgba(226, 232, 240, 1);
      --input-background: rgba(255, 255, 255, 1);
      --ring: rgba(0, 28, 86, 0.2);
      
      /* Radius */
      --radius-button: 6px;
      --radius-card: 12px;
      --radius-input: 6px;
      --radius-pill: 999px;
      
      /* Elevation */
      --elevation-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --elevation-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --elevation-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      
      /* Glassmorphism */
      --glass-bg: rgba(255, 255, 255, 0.7);
      --glass-border: rgba(255, 255, 255, 0.18);
      --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    }
  `;

  const baseStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: var(--text-base);
      line-height: 1.5;
      color: var(--foreground);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-attachment: fixed;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      min-height: 100vh;
      padding: 2rem 1rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @keyframes progressFill {
      from { width: 0%; }
    }

    @keyframes checkmark {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }

    h1 { font-size: var(--text-h1); font-weight: 600; line-height: 1.2; }
    h2 { font-size: var(--text-h2); font-weight: 600; line-height: 1.2; margin: 0; }
    h3 { font-size: var(--text-h3); font-weight: 600; line-height: 1.3; }
    h4 { font-size: var(--text-h4); font-weight: 600; line-height: 1.3; }

    .journey-container {
      max-width: 720px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }

    /* Glassmorphism Card */
    .journey-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: calc(var(--radius-card) * 2);
      box-shadow: var(--glass-shadow);
      overflow: hidden;
    }

    /* Progress Indicator */
    .progress-wrapper {
      padding: 2rem 2rem 1rem;
      background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.8));
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      margin-bottom: 1.5rem;
    }

    .progress-line {
      position: absolute;
      top: 20px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--border);
      z-index: 0;
    }

    .progress-line-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--primary));
      transition: width 0.4s ease;
      animation: progressFill 0.6s ease-out;
    }

    .progress-step {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .step-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--card);
      border: 3px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: var(--elevation-sm);
    }

    .step-circle.active {
      background: linear-gradient(135deg, var(--accent), var(--primary));
      border-color: var(--primary);
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
    }

    .step-circle.completed {
      background: var(--success);
      border-color: var(--success);
    }

    .step-circle svg {
      width: 20px;
      height: 20px;
      stroke: var(--muted-foreground);
    }

    .step-circle.active svg,
    .step-circle.completed svg {
      stroke: white;
    }

    .step-label {
      font-size: 11px;
      color: var(--muted-foreground);
      text-align: center;
      max-width: 80px;
    }

    .step-circle.active + .step-label,
    .step-circle.completed + .step-label {
      color: var(--foreground);
      font-weight: 500;
    }

    /* Form Header */
    .journey-header {
      padding: 2rem 2rem 1.5rem;
      text-align: center;
      background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
    }

    .journey-icon {
      width: 56px;
      height: 56px;
      margin: 0 auto 1rem;
      background: linear-gradient(135deg, var(--accent), var(--primary));
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 3s ease-in-out infinite;
      box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
    }

    .journey-title {
      color: var(--foreground);
      margin-bottom: 0.5rem;
    }

    .journey-subtitle {
      color: var(--muted-foreground);
      margin: 0;
    }

    /* Form Body */
    .journey-body {
      padding: 2rem;
      min-height: 400px;
      background: rgba(255,255,255,0.6);
    }

    .step-content {
      animation: slideUp 0.4s ease-out;
    }

    .step-title {
      color: var(--foreground);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .field-group {
      margin-bottom: 1.5rem;
    }

    .field-label {
      display: block;
      color: var(--foreground);
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .field-required {
      color: var(--destructive);
      margin-left: 0.25rem;
    }

    .field-input,
    .field-select {
      width: 100%;
      padding: 0.875rem 1rem;
      background: var(--input-background);
      border: 2px solid var(--border);
      border-radius: var(--radius-input);
      color: var(--foreground);
      font-family: inherit;
      font-size: var(--text-base);
      transition: all 0.2s ease;
    }

    .field-input:hover,
    .field-select:hover {
      border-color: var(--accent);
    }

    .field-input:focus,
    .field-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--ring);
      transform: translateY(-1px);
    }

    .field-select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      padding-right: 3rem;
    }

    .field-error {
      color: var(--destructive);
      font-size: var(--text-label);
      margin-top: 0.5rem;
      display: none;
      align-items: center;
      gap: 0.375rem;
    }

    .field-error.active {
      display: flex;
    }

    /* Plan Cards */
    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .plan-card {
      background: var(--card);
      border: 2px solid var(--border);
      border-radius: var(--radius-card);
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .plan-card:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(14, 165, 233, 0.2);
    }

    .plan-card.selected {
      border-color: var(--primary);
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(0, 28, 86, 0.05));
      box-shadow: 0 0 0 3px var(--ring), 0 12px 24px rgba(14, 165, 233, 0.2);
    }

    .plan-badge {
      position: absolute;
      top: -10px;
      right: 10px;
      background: var(--accent);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-pill);
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .plan-name {
      color: var(--foreground);
      margin-bottom: 0.5rem;
    }

    .plan-price {
      color: var(--primary);
      margin-bottom: 1rem;
    }

    .plan-features {
      list-style: none;
      padding: 0;
    }

    .plan-features li {
      color: var(--muted-foreground);
      font-size: var(--text-label);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .plan-features li:before {
      content: "✓";
      color: var(--success);
      font-weight: bold;
    }

    /* Traveller Cards */
    .traveller-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius-card);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .traveller-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
    }

    .traveller-number {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, var(--accent), var(--primary));
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .field-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    /* Payment Card */
    .payment-methods {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .payment-method {
      flex: 1;
      padding: 1rem;
      background: var(--card);
      border: 2px solid var(--border);
      border-radius: var(--radius-input);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .payment-method:hover {
      border-color: var(--accent);
    }

    .payment-method.selected {
      border-color: var(--primary);
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(0, 28, 86, 0.05));
    }

    .payment-icon {
      width: 40px;
      height: 40px;
      margin: 0 auto 0.5rem;
      background: var(--secondary);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Navigation */
    .journey-nav {
      display: flex;
      gap: 1rem;
      padding: 2rem;
      background: linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
      border-top: 1px solid var(--glass-border);
    }

    .btn {
      padding: 0.875rem 1.75rem;
      border: none;
      border-radius: var(--radius-button);
      font-family: inherit;
      font-size: var(--text-base);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      flex: 1;
      background: linear-gradient(135deg, var(--accent), var(--primary));
      color: white;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
    }

    .btn-secondary {
      background: var(--secondary);
      color: var(--secondary-foreground);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--muted);
    }

    /* Loading */
    .loading {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Success State */
    .success-state {
      text-align: center;
      padding: 3rem 2rem;
      animation: slideUp 0.6s ease-out;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: linear-gradient(135deg, var(--success), #10b981);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }

    .success-icon svg {
      width: 40px;
      height: 40px;
      stroke: white;
      stroke-width: 3;
      stroke-dasharray: 100;
      animation: checkmark 0.6s ease-out forwards;
    }

    .success-title {
      color: var(--foreground);
      margin-bottom: 0.75rem;
    }

    .success-message {
      color: var(--muted-foreground);
      margin-bottom: 2rem;
    }

    /* Responsive */
    @media (max-width: 640px) {
      body {
        padding: 1rem 0.5rem;
      }

      .progress-wrapper,
      .journey-header,
      .journey-body,
      .journey-nav {
        padding: 1.5rem 1rem;
      }

      .progress-steps {
        overflow-x: auto;
        justify-content: flex-start;
        gap: 1rem;
      }

      .step-label {
        font-size: 10px;
        max-width: 60px;
      }

      .plans-grid {
        grid-template-columns: 1fr;
      }

      .field-row {
        grid-template-columns: 1fr;
      }

      .payment-methods {
        flex-direction: column;
      }

      .journey-nav {
        flex-direction: column-reverse;
      }
    }
  `;

  const formHTML = `
    <div class="journey-container">
      <div class="journey-card">
        <!-- Progress Indicator -->
        <div class="progress-wrapper">
          <div class="progress-steps">
            <div class="progress-line">
              <div class="progress-line-fill" id="progressFill"></div>
            </div>
            <div class="progress-step">
              <div class="step-circle active" id="step-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span class="step-label">Trip Details</span>
            </div>
            <div class="progress-step">
              <div class="step-circle" id="step-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span class="step-label">Travellers</span>
            </div>
            <div class="progress-step">
              <div class="step-circle" id="step-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 3v18M3 9h18M3 15h18"/>
                </svg>
              </div>
              <span class="step-label">Plan</span>
            </div>
            <div class="progress-step">
              <div class="step-circle" id="step-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span class="step-label">Nominee</span>
            </div>
            <div class="progress-step">
              <div class="step-circle" id="step-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <span class="step-label">Payment</span>
            </div>
          </div>
        </div>

        <!-- Form Header -->
        <div class="journey-header">
          <div class="journey-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h2 class="journey-title">Travel Insurance Journey</h2>
          <p class="journey-subtitle">Get insured for your trip in just 5 easy steps</p>
        </div>

        <!-- Form Body -->
        <form id="journeyForm">
          <div class="journey-body" id="stepContainer"></div>

          <!-- Navigation -->
          <div class="journey-nav">
            <button type="button" class="btn btn-secondary" id="backBtn" style="display: none;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back
            </button>
            <button type="button" class="btn btn-primary" id="continueBtn">
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const formJS = `
    (function() {
      // Global Configuration
      const config = {
        companyName: "SafeTravel Insurance",
        primaryColor: "#0ea5e9",
        secondaryColor: "#001c56",
        fontFamily: "Inter",
        title: "Travel Insurance Journey"
      };

      // Mock Data
      const countries = [
        "United States", "United Kingdom", "Canada", "Australia", "Germany", 
        "France", "Italy", "Spain", "Japan", "Singapore", "Thailand", 
        "United Arab Emirates", "Switzerland", "Netherlands", "New Zealand"
      ];

      const plans = [
        {
          id: "basic",
          name: "Basic",
          price: "$49",
          duration: "Per trip",
          coverage: "$50,000",
          features: [
            "Medical coverage",
            "Trip cancellation",
            "Lost luggage",
            "24/7 assistance"
          ]
        },
        {
          id: "standard",
          name: "Standard",
          price: "$89",
          duration: "Per trip",
          coverage: "$100,000",
          features: [
            "Enhanced medical coverage",
            "Trip cancellation & interruption",
            "Lost luggage & delays",
            "Emergency evacuation",
            "24/7 premium assistance"
          ],
          popular: true
        },
        {
          id: "premium",
          name: "Premium",
          price: "$149",
          duration: "Per trip",
          coverage: "$250,000",
          features: [
            "Comprehensive medical",
            "Cancel for any reason",
            "Luxury luggage protection",
            "Emergency evacuation",
            "Adventure sports coverage",
            "Concierge service"
          ]
        }
      ];

      const relationships = [
        "Spouse", "Parent", "Child", "Sibling", "Friend", "Other"
      ];

      // State Management
      let currentStep = 1;
      const totalSteps = 5;
      const formData = {
        tripType: '',
        destination: '',
        startDate: '',
        endDate: '',
        travellers: 1,
        travellerDetails: [],
        selectedPlan: '',
        nomineeName: '',
        nomineeRelation: '',
        nomineeContact: '',
        paymentMethod: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: ''
      };
      const errors = {};

      // Initialize
      document.addEventListener('DOMContentLoaded', function() {
        renderStep(currentStep);
        updateProgress();
        initializeEventListeners();
        
        // Initialize Flatpickr
        if (typeof flatpickr !== 'undefined') {
          console.log('Flatpickr loaded successfully');
        }
      });

      function initializeEventListeners() {
        document.getElementById('backBtn').addEventListener('click', goBack);
        document.getElementById('continueBtn').addEventListener('click', goNext);
      }

      function updateProgress() {
        const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        document.getElementById('progressFill').style.width = progressPercent + '%';

        // Update step circles
        for (let i = 1; i <= totalSteps; i++) {
          const circle = document.getElementById('step-' + i);
          circle.classList.remove('active', 'completed');
          
          if (i < currentStep) {
            circle.classList.add('completed');
            circle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
          } else if (i === currentStep) {
            circle.classList.add('active');
          }
        }

        // Update navigation buttons
        document.getElementById('backBtn').style.display = currentStep > 1 ? 'flex' : 'none';
        const continueBtn = document.getElementById('continueBtn');
        
        if (currentStep === totalSteps) {
          continueBtn.innerHTML = '<span class="loading"></span> Processing Payment...';
        } else {
          continueBtn.innerHTML = 'Continue<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        }
      }

      function renderStep(step) {
        const container = document.getElementById('stepContainer');
        
        switch(step) {
          case 1:
            container.innerHTML = renderTripInformation();
            initializeTripInformation();
            break;
          case 2:
            container.innerHTML = renderTravellerInformation();
            initializeTravellerInformation();
            break;
          case 3:
            container.innerHTML = renderPlanSelection();
            initializePlanSelection();
            break;
          case 4:
            container.innerHTML = renderNomineeDetails();
            initializeNomineeDetails();
            break;
          case 5:
            container.innerHTML = renderPayment();
            initializePayment();
            break;
        }
      }

      // Step 1: Trip Information
      function renderTripInformation() {
        return \`
          <div class="step-content">
            <h3 class="step-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Trip Information
            </h3>

            <div class="field-group">
              <label class="field-label">Trip Type<span class="field-required">*</span></label>
              <select class="field-select" id="tripType" required>
                <option value="">Select trip type</option>
                <option value="single">Single Trip</option>
                <option value="multi">Multi-Trip (Annual)</option>
              </select>
              <div class="field-error" id="error-tripType">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Please select a trip type</span>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Destination Country<span class="field-required">*</span></label>
              <select class="field-select" id="destination" required>
                <option value="">Select destination</option>
                \${countries.map(c => \`<option value="\${c}">\${c}</option>\`).join('')}
              </select>
              <div class="field-error" id="error-destination">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Please select a destination</span>
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Travel Start Date<span class="field-required">*</span></label>
                <input type="text" class="field-input" id="startDate" placeholder="Select date" required />
                <div class="field-error" id="error-startDate">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Please select start date</span>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">Travel End Date<span class="field-required">*</span></label>
                <input type="text" class="field-input" id="endDate" placeholder="Select date" required />
                <div class="field-error" id="error-endDate">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Please select end date</span>
                </div>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Number of Travellers<span class="field-required">*</span></label>
              <input type="number" class="field-input" id="travellers" min="1" max="10" value="1" required />
              <div class="field-error" id="error-travellers">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Please enter number of travellers</span>
              </div>
            </div>
          </div>
        \`;
      }

      function initializeTripInformation() {
        // Initialize Flatpickr for date inputs
        if (typeof flatpickr !== 'undefined') {
          flatpickr("#startDate", {
            minDate: "today",
            dateFormat: "Y-m-d",
            onChange: function(selectedDates, dateStr) {
              formData.startDate = dateStr;
            }
          });

          flatpickr("#endDate", {
            minDate: "today",
            dateFormat: "Y-m-d",
            onChange: function(selectedDates, dateStr) {
              formData.endDate = dateStr;
            }
          });
        }

        // Set values from formData
        if (formData.tripType) document.getElementById('tripType').value = formData.tripType;
        if (formData.destination) document.getElementById('destination').value = formData.destination;
        if (formData.travellers) document.getElementById('travellers').value = formData.travellers;

        // Add change listeners
        document.getElementById('tripType').addEventListener('change', (e) => {
          formData.tripType = e.target.value;
          clearError('tripType');
        });

        document.getElementById('destination').addEventListener('change', (e) => {
          formData.destination = e.target.value;
          clearError('destination');
        });

        document.getElementById('travellers').addEventListener('change', (e) => {
          formData.travellers = parseInt(e.target.value) || 1;
          clearError('travellers');
        });
      }

      function validateTripInformation() {
        let isValid = true;
        
        if (!formData.tripType) {
          showError('tripType');
          isValid = false;
        }
        if (!formData.destination) {
          showError('destination');
          isValid = false;
        }
        if (!formData.startDate) {
          showError('startDate');
          isValid = false;
        }
        if (!formData.endDate) {
          showError('endDate');
          isValid = false;
        }
        if (!formData.travellers || formData.travellers < 1) {
          showError('travellers');
          isValid = false;
        }

        return isValid;
      }

      // Step 2: Traveller Information
      function renderTravellerInformation() {
        const travellerCount = formData.travellers || 1;
        let html = \`
          <div class="step-content">
            <h3 class="step-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Traveller Information
            </h3>
        \`;

        for (let i = 0; i < travellerCount; i++) {
          const traveller = formData.travellerDetails[i] || {};
          html += \`
            <div class="traveller-card">
              <div class="traveller-header">
                <div class="traveller-number">\${i + 1}</div>
                <h4>Traveller \${i + 1}</h4>
              </div>

              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">Full Name<span class="field-required">*</span></label>
                  <input type="text" class="field-input" id="traveller-\${i}-name" value="\${traveller.name || ''}" placeholder="Enter full name" required />
                  <div class="field-error" id="error-traveller-\${i}-name">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>Name is required</span>
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label">Age<span class="field-required">*</span></label>
                  <input type="number" class="field-input" id="traveller-\${i}-age" value="\${traveller.age || ''}" min="1" max="120" placeholder="Age" required />
                  <div class="field-error" id="error-traveller-\${i}-age">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>Age is required</span>
                  </div>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">Passport Number<span class="field-required">*</span></label>
                <input type="text" class="field-input" id="traveller-\${i}-passport" value="\${traveller.passport || ''}" placeholder="Enter passport number" required />
                <div class="field-error" id="error-traveller-\${i}-passport">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Passport is required</span>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">Pre-existing Medical Conditions<span class="field-required">*</span></label>
                <select class="field-select" id="traveller-\${i}-condition" required>
                  <option value="">Select an option</option>
                  <option value="no" \${traveller.condition === 'no' ? 'selected' : ''}>No</option>
                  <option value="yes" \${traveller.condition === 'yes' ? 'selected' : ''}>Yes</option>
                </select>
                <div class="field-error" id="error-traveller-\${i}-condition">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Please select an option</span>
                </div>
              </div>
            </div>
          \`;
        }

        html += '</div>';
        return html;
      }

      function initializeTravellerInformation() {
        const travellerCount = formData.travellers || 1;
        
        for (let i = 0; i < travellerCount; i++) {
          document.getElementById(\`traveller-\${i}-name\`).addEventListener('input', (e) => {
            if (!formData.travellerDetails[i]) formData.travellerDetails[i] = {};
            formData.travellerDetails[i].name = e.target.value;
            clearError(\`traveller-\${i}-name\`);
          });

          document.getElementById(\`traveller-\${i}-age\`).addEventListener('input', (e) => {
            if (!formData.travellerDetails[i]) formData.travellerDetails[i] = {};
            formData.travellerDetails[i].age = e.target.value;
            clearError(\`traveller-\${i}-age\`);
          });

          document.getElementById(\`traveller-\${i}-passport\`).addEventListener('input', (e) => {
            if (!formData.travellerDetails[i]) formData.travellerDetails[i] = {};
            formData.travellerDetails[i].passport = e.target.value;
            clearError(\`traveller-\${i}-passport\`);
          });

          document.getElementById(\`traveller-\${i}-condition\`).addEventListener('change', (e) => {
            if (!formData.travellerDetails[i]) formData.travellerDetails[i] = {};
            formData.travellerDetails[i].condition = e.target.value;
            clearError(\`traveller-\${i}-condition\`);
          });
        }
      }

      function validateTravellerInformation() {
        let isValid = true;
        const travellerCount = formData.travellers || 1;

        for (let i = 0; i < travellerCount; i++) {
          const traveller = formData.travellerDetails[i] || {};
          
          if (!traveller.name) {
            showError(\`traveller-\${i}-name\`);
            isValid = false;
          }
          if (!traveller.age) {
            showError(\`traveller-\${i}-age\`);
            isValid = false;
          }
          if (!traveller.passport) {
            showError(\`traveller-\${i}-passport\`);
            isValid = false;
          }
          if (!traveller.condition) {
            showError(\`traveller-\${i}-condition\`);
            isValid = false;
          }
        }

        return isValid;
      }

      // Step 3: Plan Selection
      function renderPlanSelection() {
        return \`
          <div class="step-content">
            <h3 class="step-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 3v18M3 9h18M3 15h18"/>
              </svg>
              Choose Your Plan
            </h3>

            <div class="plans-grid">
              \${plans.map(plan => \`
                <div class="plan-card \${formData.selectedPlan === plan.id ? 'selected' : ''}" data-plan="\${plan.id}">
                  \${plan.popular ? '<div class="plan-badge">Popular</div>' : ''}
                  <h4 class="plan-name">\${plan.name}</h4>
                  <div class="plan-price">\${plan.price} <small>\${plan.duration}</small></div>
                  <p style="color: var(--muted-foreground); font-size: var(--text-label); margin-bottom: 1rem;">Coverage: \${plan.coverage}</p>
                  <ul class="plan-features">
                    \${plan.features.map(f => \`<li>\${f}</li>\`).join('')}
                  </ul>
                </div>
              \`).join('')}
            </div>

            <div class="field-error" id="error-plan" style="margin-top: 1rem;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>Please select a plan</span>
            </div>
          </div>
        \`;
      }

      function initializePlanSelection() {
        document.querySelectorAll('.plan-card').forEach(card => {
          card.addEventListener('click', () => {
            document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            formData.selectedPlan = card.dataset.plan;
            clearError('plan');
          });
        });
      }

      function validatePlanSelection() {
        if (!formData.selectedPlan) {
          showError('plan');
          return false;
        }
        return true;
      }

      // Step 4: Nominee Details
      function renderNomineeDetails() {
        return \`
          <div class="step-content">
            <h3 class="step-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Nominee Details
            </h3>

            <div class="field-group">
              <label class="field-label">Nominee Name<span class="field-required">*</span></label>
              <input type="text" class="field-input" id="nomineeName" value="\${formData.nomineeName || ''}" placeholder="Enter nominee full name" required />
              <div class="field-error" id="error-nomineeName">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Nominee name is required</span>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Relationship<span class="field-required">*</span></label>
              <select class="field-select" id="nomineeRelation" required>
                <option value="">Select relationship</option>
                \${relationships.map(r => \`<option value="\${r}" \${formData.nomineeRelation === r ? 'selected' : ''}>\${r}</option>\`).join('')}
              </select>
              <div class="field-error" id="error-nomineeRelation">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Relationship is required</span>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Contact Number<span class="field-required">*</span></label>
              <input type="tel" class="field-input" id="nomineeContact" value="\${formData.nomineeContact || ''}" placeholder="Enter contact number" required />
              <div class="field-error" id="error-nomineeContact">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Contact number is required</span>
              </div>
            </div>
          </div>
        \`;
      }

      function initializeNomineeDetails() {
        document.getElementById('nomineeName').addEventListener('input', (e) => {
          formData.nomineeName = e.target.value;
          clearError('nomineeName');
        });

        document.getElementById('nomineeRelation').addEventListener('change', (e) => {
          formData.nomineeRelation = e.target.value;
          clearError('nomineeRelation');
        });

        document.getElementById('nomineeContact').addEventListener('input', (e) => {
          formData.nomineeContact = e.target.value;
          clearError('nomineeContact');
        });
      }

      function validateNomineeDetails() {
        let isValid = true;
        
        if (!formData.nomineeName) {
          showError('nomineeName');
          isValid = false;
        }
        if (!formData.nomineeRelation) {
          showError('nomineeRelation');
          isValid = false;
        }
        if (!formData.nomineeContact) {
          showError('nomineeContact');
          isValid = false;
        }

        return isValid;
      }

      // Step 5: Payment
      function renderPayment() {
        return \`
          <div class="step-content">
            <h3 class="step-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Payment Details
            </h3>

            <div class="payment-methods">
              <div class="payment-method \${formData.paymentMethod === 'card' ? 'selected' : ''}" data-method="card">
                <div class="payment-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div>Credit/Debit</div>
              </div>
              <div class="payment-method \${formData.paymentMethod === 'upi' ? 'selected' : ''}" data-method="upi">
                <div class="payment-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <div>UPI</div>
              </div>
            </div>

            <div id="cardFields" style="display: \${formData.paymentMethod === 'card' || !formData.paymentMethod ? 'block' : 'none'};">
              <div class="field-group">
                <label class="field-label">Card Number<span class="field-required">*</span></label>
                <input type="text" class="field-input" id="cardNumber" value="\${formData.cardNumber || ''}" placeholder="1234 5678 9012 3456" maxlength="19" required />
                <div class="field-error" id="error-cardNumber">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Card number is required</span>
                </div>
              </div>

              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">Expiry (MM/YY)<span class="field-required">*</span></label>
                  <input type="text" class="field-input" id="cardExpiry" value="\${formData.cardExpiry || ''}" placeholder="MM/YY" maxlength="5" required />
                  <div class="field-error" id="error-cardExpiry">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>Expiry is required</span>
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label">CVV<span class="field-required">*</span></label>
                  <input type="text" class="field-input" id="cardCVV" value="\${formData.cardCVV || ''}" placeholder="123" maxlength="3" required />
                  <div class="field-error" id="error-cardCVV">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>CVV is required</span>
                  </div>
                </div>
              </div>
            </div>

            <div id="upiFields" style="display: \${formData.paymentMethod === 'upi' ? 'block' : 'none'};">
              <div class="field-group">
                <label class="field-label">UPI ID<span class="field-required">*</span></label>
                <input type="text" class="field-input" id="upiId" placeholder="yourname@upi" />
              </div>
            </div>
          </div>
        \`;
      }

      function initializePayment() {
        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
          method.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            formData.paymentMethod = method.dataset.method;

            if (formData.paymentMethod === 'card') {
              document.getElementById('cardFields').style.display = 'block';
              document.getElementById('upiFields').style.display = 'none';
            } else {
              document.getElementById('cardFields').style.display = 'none';
              document.getElementById('upiFields').style.display = 'block';
            }
          });
        });

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
          cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
            formData.cardNumber = value;
            clearError('cardNumber');
          });
        }

        // Expiry formatting
        const expiryInput = document.getElementById('cardExpiry');
        if (expiryInput) {
          expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\\D/g, '');
            if (value.length >= 2) {
              value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
            formData.cardExpiry = value;
            clearError('cardExpiry');
          });
        }

        // CVV
        const cvvInput = document.getElementById('cardCVV');
        if (cvvInput) {
          cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\\D/g, '');
            formData.cardCVV = e.target.value;
            clearError('cardCVV');
          });
        }
      }

      function validatePayment() {
        let isValid = true;

        if (formData.paymentMethod === 'card' || !formData.paymentMethod) {
          if (!formData.cardNumber || formData.cardNumber.length < 13) {
            showError('cardNumber');
            isValid = false;
          }
          if (!formData.cardExpiry || formData.cardExpiry.length < 5) {
            showError('cardExpiry');
            isValid = false;
          }
          if (!formData.cardCVV || formData.cardCVV.length < 3) {
            showError('cardCVV');
            isValid = false;
          }
        }

        return isValid;
      }

      // Navigation
      function goBack() {
        if (currentStep > 1) {
          currentStep--;
          renderStep(currentStep);
          updateProgress();
        }
      }

      async function goNext() {
        // Validate current step
        let isValid = false;
        
        switch(currentStep) {
          case 1:
            isValid = validateTripInformation();
            break;
          case 2:
            isValid = validateTravellerInformation();
            break;
          case 3:
            isValid = validatePlanSelection();
            break;
          case 4:
            isValid = validateNomineeDetails();
            break;
          case 5:
            isValid = validatePayment();
            break;
        }

        if (!isValid) return;

        // If last step, submit
        if (currentStep === totalSteps) {
          await submitForm();
          return;
        }

        // Move to next step
        currentStep++;
        renderStep(currentStep);
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      async function submitForm() {
        const continueBtn = document.getElementById('continueBtn');
        continueBtn.disabled = true;
        continueBtn.innerHTML = '<span class="loading"></span> Processing Payment...';

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success
        showSuccess();

        // Send data to parent
        window.parent.postMessage({
          type: 'journey360-form-submit',
          data: formData
        }, '*');

        console.log('Form submitted:', formData);
      }

      function showSuccess() {
        const container = document.getElementById('stepContainer');
        container.innerHTML = \`
          <div class="success-state">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 class="success-title">Payment Successful!</h3>
            <p class="success-message">Your travel insurance has been activated. You will receive a confirmation email shortly.</p>
            <button class="btn btn-primary" onclick="location.reload()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              Start New Application
            </button>
          </div>
        \`;

        document.getElementById('backBtn').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'none';
      }

      // Error handling
      function showError(fieldId) {
        const errorEl = document.getElementById('error-' + fieldId);
        if (errorEl) {
          errorEl.classList.add('active');
        }
      }

      function clearError(fieldId) {
        const errorEl = document.getElementById('error-' + fieldId);
        if (errorEl) {
          errorEl.classList.remove('active');
        }
      }

      // SDK: Data bindings
      window.data_sdk = {
        getData: () => formData,
        setData: (data) => Object.assign(formData, data),
        getConfig: () => config,
        setConfig: (newConfig) => Object.assign(config, newConfig)
      };

      // SDK: Element configuration
      window.element_sdk = {
        setColors: (colors) => {
          if (colors.primary) document.documentElement.style.setProperty('--primary', colors.primary);
          if (colors.accent) document.documentElement.style.setProperty('--accent', colors.accent);
        },
        setFont: (fontFamily) => {
          document.body.style.fontFamily = fontFamily;
        },
        setTitle: (title) => {
          document.querySelector('.journey-title').textContent = title;
        }
      };

      // Notify parent
      window.parent.postMessage({
        type: 'journey360-form-ready',
        formId: '${uuid}'
      }, '*');
    })();
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Travel Insurance Journey - ${schema.title || 'Journey 360'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  <style>
    ${cssVariables}
    ${baseStyles}
  </style>
</head>
<body>
  ${formHTML}
  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
  <script>
    ${formJS}
  </script>
</body>
</html>`;
}

/**
 * Generate publish configuration with script embed code
 */
export function generatePublishConfig(schema: any, formData?: any): PublishConfig {
  const uuid = generateUUID();
  const scriptUrl = `https://journey360.com/embed/${uuid}.js`;
  const htmlBundle = generateHTMLBundle(schema, formData);
  
  const embedCode = `<!-- Journey 360 Embedded Form -->
<script src="${scriptUrl}" async></script>
<div id="journey360-form-${uuid}"></div>

<!-- OR use React component -->
{/* 
import Script from 'next/script'

<Script src="${scriptUrl}" />
<div id="journey360-form-${uuid}"></div>
*/}`;

  return {
    uuid,
    publishedAt: new Date().toISOString(),
    scriptUrl,
    embedCode,
    htmlBundle,
  };
}

/**
 * Download HTML bundle as file
 */
export function downloadHTMLBundle(htmlBundle: string, filename: string = 'journey360-form.html') {
  const blob = new Blob([htmlBundle], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
