// Death Claim Journey Data
// Mock data for Death Claim Submission - Universal Life Product

export interface MedicalReason {
  value: string;
  label: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface ReasonOption {
  value: string;
  label: string;
}

export interface Payee {
  id: string;
  name: string;
  relationship: string;
  bankDetails?: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'text' | 'radio' | 'dropdown' | 'textarea';
  question: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

// Primary Medical Reasons
export const medicalReasons: MedicalReason[] = [
  { value: 'heart-attack', label: 'Heart Attack' },
  { value: 'cancer', label: 'Cancer' },
  { value: 'accident', label: 'Accident' },
  { value: 'stroke', label: 'Stroke' },
  { value: 'respiratory-failure', label: 'Respiratory Failure' },
  { value: 'kidney-failure', label: 'Kidney Failure' },
  { value: 'liver-disease', label: 'Liver Disease' },
  { value: 'diabetes-complications', label: 'Diabetes Complications' },
  { value: 'infectious-disease', label: 'Infectious Disease' },
  { value: 'natural-causes', label: 'Natural Causes' },
  { value: 'other', label: 'Other' }
];

// Required Documents
export const requiredDocuments: DocumentItem[] = [
  { id: 'doc-1', name: 'Death Certificate (Original)', required: true },
  { id: 'doc-2', name: 'Policy Document', required: true },
  { id: 'doc-3', name: 'Claimant Identity Proof', required: true }
];

// Document Status Options
export const statusOptions: StatusOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'received', label: 'Received' },
  { value: 'not-applicable', label: 'Not Applicable' }
];

// Document Reason Options
export const reasonOptions: ReasonOption[] = [
  { value: 'awaiting-submission', label: 'Awaiting Submission' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'requires-clarification', label: 'Requires Clarification' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'not-required', label: 'Not Required' }
];

// Assessment Questions (Decisionator simulation)
export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'q1',
    type: 'radio',
    question: 'Was the death within the first 2 years of policy issuance?',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    id: 'q2',
    type: 'radio',
    question: 'Were all premium payments up to date at the time of death?',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    id: 'q3',
    type: 'radio',
    question: 'Is there any suspicion of fraud or misrepresentation?',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    id: 'q4',
    type: 'dropdown',
    question: 'What is the claim amount range?',
    required: true,
    options: [
      { value: 'under-50k', label: 'Under $50,000' },
      { value: '50k-100k', label: '$50,000 - $100,000' },
      { value: '100k-250k', label: '$100,000 - $250,000' },
      { value: '250k-500k', label: '$250,000 - $500,000' },
      { value: 'over-500k', label: 'Over $500,000' }
    ]
  },
  {
    id: 'q5',
    type: 'radio',
    question: 'Does the cause of death match the policy coverage?',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    id: 'q6',
    type: 'textarea',
    question: 'Additional notes or observations regarding this claim:',
    required: false
  }
];

// Mock Beneficiaries/Payees
export const mockPayees: Payee[] = [
  {
    id: 'payee-1',
    name: 'Sarah Johnson',
    relationship: 'Spouse',
    bankDetails: 'Bank of America - ***4532'
  },
  {
    id: 'payee-2',
    name: 'Michael Johnson',
    relationship: 'Son',
    bankDetails: 'Wells Fargo - ***7821'
  },
  {
    id: 'payee-3',
    name: 'Emily Johnson',
    relationship: 'Daughter',
    bankDetails: 'Chase Bank - ***3421'
  },
  {
    id: 'payee-4',
    name: 'Robert Johnson Sr.',
    relationship: 'Father',
    bankDetails: 'Citibank - ***9012'
  }
];

// Assessment Result Types
export type AssessmentResult = 'approved' | 'referred' | 'rejected' | null;

// Mock function to calculate assessment result
export const calculateAssessmentResult = (answers: Record<string, string>): AssessmentResult => {
  // Simple logic for demo purposes
  const withinTwoYears = answers['q1'] === 'yes';
  const premiumsPaid = answers['q2'] === 'yes';
  const fraudSuspicion = answers['q3'] === 'yes';
  const coverageMatch = answers['q5'] === 'yes';

  if (fraudSuspicion || !coverageMatch) {
    return 'rejected';
  }

  if (!premiumsPaid || withinTwoYears) {
    return 'referred';
  }

  return 'approved';
};

// Generate random claim ID
export const generateClaimId = (): string => {
  const prefix = 'DC-UL-';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${year}-${random}`;
};
