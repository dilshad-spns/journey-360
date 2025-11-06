// JSON Schema Types for AI 360 System

export type FieldType = 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'phone' | 'url';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom';
  value?: string | number;
  message: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldSchema {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
  validations?: ValidationRule[];
  options?: FieldOption[];
  description?: string;
  wizardStep?: number;
  conditional?: {
    field: string;
    value: any;
  };
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FieldSchema[];
  submitUrl?: string;
  successMessage?: string;
  errorMessage?: string;
  layout?: 'simple' | 'two-column' | 'carded';
  metadata?: {
    createdAt: string;
    userStory: string;
  };
}

export interface MockApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  responseBody: any;
  statusCode: number;
  delay?: number;
}

export interface TestCase {
  id: string;
  description: string;
  type: 'unit' | 'integration' | 'validation';
  code: string;
  fieldId?: string;
}

export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  url?: string;
  status: 'draft' | 'building' | 'deployed' | 'failed';
  timestamp?: string;
}

export interface AI360State {
  userInput: string;
  parsedIntent: string;
  schema: FormSchema | null;
  formData: Record<string, any>;
  mockApi: MockApiEndpoint[];
  tests: TestCase[];
  deployment: DeploymentConfig;
  activeLayer: 'input' | 'schema' | 'form' | 'tests' | 'deployment';
}
