/**
 * EXAMPLE: How to create a form with API-driven dropdowns and external submission
 *
 * This example shows how to configure fields to fetch options from APIs
 * and submit form data to your server
 */

import { FormSchema } from "../types/schema";

export const exampleApiDrivenForm: FormSchema = {
  id: "api-example-form",
  title: "Customer Registration Form",
  description: "Example form with API-driven dropdowns",

  fields: [
    // ============================================
    // EXAMPLE 1: Simple API-driven dropdown
    // ============================================
    {
      id: "country",
      name: "country",
      label: "Country",
      type: "select",
      placeholder: "Select your country",
      validations: [
        {
          type: "required",
          message: "Country is required",
        },
      ],
      // Fetch countries from REST Countries API
      apiConfig: {
        url: "https://restcountries.com/v3.1/all",
        method: "GET",
        labelKey: "name.common", // Use nested property for label
        valueKey: "cca2", // Use country code as value
      },
    },

    // ============================================
    // EXAMPLE 2: API with custom headers
    // ============================================
    {
      id: "product",
      name: "product",
      label: "Product",
      type: "select",
      placeholder: "Select a product",
      apiConfig: {
        url: "https://api.yourcompany.com/products",
        method: "GET",
        headers: {
          Authorization: "Bearer YOUR_TOKEN",
          "X-API-Key": "your-api-key",
          Accept: "application/json",
        },
        dataPath: "data.products", // Extract from nested response
        labelKey: "productName",
        valueKey: "productId",
      },
      // Fallback options if API fails
      options: [
        { label: "Product A", value: "prod-a" },
        { label: "Product B", value: "prod-b" },
      ],
    },

    // ============================================
    // EXAMPLE 3: API with query parameters (GET)
    // ============================================
    {
      id: "category",
      name: "category",
      label: "Category",
      type: "select",
      placeholder: "Select category",
      apiConfig: {
        url: "https://api.yourcompany.com/categories",
        method: "GET",
        params: {
          active: "true",
          limit: "50",
        },
        labelKey: "name",
        valueKey: "id",
      },
    },

    // ============================================
    // EXAMPLE 4: POST request for dropdown data
    // ============================================
    {
      id: "filtered-items",
      name: "filtered_items",
      label: "Filtered Items",
      type: "select",
      placeholder: "Select item",
      apiConfig: {
        url: "https://api.yourcompany.com/search",
        method: "POST",
        params: {
          filter: "active",
          type: "dropdown",
        },
        dataPath: "results",
        labelKey: "displayName",
        valueKey: "itemId",
      },
    },

    // ============================================
    // EXAMPLE 5: Radio buttons with API data
    // ============================================
    {
      id: "plan",
      name: "plan",
      label: "Subscription Plan",
      type: "radio",
      validations: [
        {
          type: "required",
          message: "Please select a plan",
        },
      ],
      apiConfig: {
        url: "https://api.yourcompany.com/plans",
        method: "GET",
        labelKey: "planName",
        valueKey: "planId",
      },
      // Static fallback
      options: [
        { label: "Basic - $9/month", value: "basic" },
        { label: "Pro - $29/month", value: "pro" },
      ],
    },

    // ============================================
    // Regular text field (no API)
    // ============================================
    {
      id: "email",
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "your@email.com",
      validations: [
        {
          type: "required",
          message: "Email is required",
        },
        {
          type: "email",
          message: "Invalid email format",
        },
      ],
    },
  ],

  // ============================================
  // FORM SUBMISSION TO EXTERNAL SERVER
  // ============================================
  submitUrl: "https://api.yourcompany.com/customer/register",

  successMessage: "✓ Registration successful! Welcome aboard.",
  errorMessage: "✗ Registration failed. Please try again.",

  layout: "simple",
  metadata: {
    createdAt: new Date().toISOString(),
    userStory: "API-driven customer registration form",
  },
};

/**
 * CUSTOMIZING FORM SUBMISSION
 *
 * To add custom headers or transform data before submission,
 * modify FormRenderer.tsx around line 95:
 *
 * const response = await ApiService.submitFormData(
 *   schema.submitUrl,
 *   data,
 *   {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${getAuthToken()}`,
 *       'X-Client-ID': 'journey-360',
 *       'X-Request-ID': crypto.randomUUID()
 *     },
 *     transformData: (formData) => {
 *       return {
 *         customer: formData,
 *         metadata: {
 *           timestamp: new Date().toISOString(),
 *           source: 'web-app',
 *           version: '1.0.0'
 *         }
 *       };
 *     }
 *   }
 * );
 */

/**
 * EXPECTED API RESPONSE FORMATS
 *
 * For dropdown APIs, your endpoint should return:
 *
 * Option 1: Simple array
 * [
 *   { "label": "Option 1", "value": "opt1" },
 *   { "label": "Option 2", "value": "opt2" }
 * ]
 *
 * Option 2: Nested object (use dataPath)
 * {
 *   "success": true,
 *   "data": {
 *     "items": [
 *       { "name": "Item 1", "id": "item1" },
 *       { "name": "Item 2", "id": "item2" }
 *     ]
 *   }
 * }
 *
 * Option 3: Custom keys (use labelKey/valueKey)
 * [
 *   { "displayName": "Choice A", "itemCode": "a" },
 *   { "displayName": "Choice B", "itemCode": "b" }
 * ]
 *
 * For form submission, your endpoint should accept:
 * {
 *   "country": "us",
 *   "product": "prod-a",
 *   "email": "user@example.com",
 *   ...
 * }
 *
 * And return:
 * {
 *   "success": true,
 *   "message": "Data saved successfully",
 *   "id": "customer-12345"
 * }
 */
