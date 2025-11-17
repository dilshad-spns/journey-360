# API Integration Guide

## Overview

The Journey-360 form renderer now supports:

1. **Dynamic dropdown options** from external APIs
2. **Form submission** to external servers

## Features Added

### 1. Dynamic Dropdown Options

Fields with type `select` or `radio` can now fetch their options from external APIs in real-time.

#### Schema Configuration

```typescript
{
  id: 'country',
  name: 'country',
  label: 'Country',
  type: 'select',
  placeholder: 'Select country',
  apiConfig: {
    url: 'https://api.example.com/countries',
    method: 'GET',                          // Optional, defaults to 'GET'
    headers: {                              // Optional custom headers
      'Authorization': 'Bearer TOKEN',
      'Accept': 'application/json'
    },
    params: {                               // Optional query params (GET) or body (POST)
      region: 'europe'
    },
    dataPath: 'data.countries',            // Optional JSONPath to extract array
    labelKey: 'name',                       // Key for option label (default: 'label')
    valueKey: 'code'                        // Key for option value (default: 'value')
  },
  // Fallback options if API fails
  options: [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' }
  ]
}
```

#### API Response Format

Your API should return an array of objects. Example:

```json
{
  "data": {
    "countries": [
      { "name": "United States", "code": "us" },
      { "name": "United Kingdom", "code": "uk" },
      { "name": "Canada", "code": "ca" }
    ]
  }
}
```

Or a simple array:

```json
[
  { "label": "Option 1", "value": "opt1" },
  { "label": "Option 2", "value": "opt2" }
]
```

#### How It Works

1. When the form loads, `FormRenderer` scans for fields with `apiConfig`
2. For each field, it calls `ApiService.fetchDropdownOptions()`
3. Options are fetched and stored in component state
4. Loading spinner shows while fetching
5. On error, fallback to static `options` or show empty state

### 2. Form Submission to External Server

#### Schema Configuration

```typescript
{
  id: 'travel-form',
  title: 'Travel Insurance',
  fields: [...],
  submitUrl: 'https://api.example.com/submit-travel-form',
  successMessage: 'Form submitted successfully!',
  errorMessage: 'Failed to submit form'
}
```

#### How It Works

1. User fills the form and clicks "Submit"
2. `FormRenderer.onSubmit()` is triggered
3. If `schema.submitUrl` exists, calls `ApiService.submitFormData()`
4. Data is sent as JSON POST request
5. Success/error messages shown based on response

#### Custom Headers & Transformation

You can customize the submission in `FormRenderer.tsx`:

```typescript
const response = await ApiService.submitFormData(schema.submitUrl, data, {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
    "X-Custom-Header": "value",
  },
  transformData: (formData) => {
    // Transform data before sending
    return {
      ...formData,
      timestamp: new Date().toISOString(),
      source: "journey-360",
    };
  },
});
```

## Real-World Examples

### Example 1: Country Dropdown with REST Countries API

```typescript
{
  id: 'country',
  name: 'country',
  label: 'Select Country',
  type: 'select',
  apiConfig: {
    url: 'https://restcountries.com/v3.1/all',
    method: 'GET',
    labelKey: 'name.common',
    valueKey: 'cca2'
  }
}
```

### Example 2: Cities Based on Selected Country

```typescript
{
  id: 'city',
  name: 'city',
  label: 'Select City',
  type: 'select',
  apiConfig: {
    url: 'https://api.example.com/cities',
    method: 'GET',
    params: {
      // This would need to be dynamic based on country selection
      country: 'us'
    },
    dataPath: 'data',
    labelKey: 'name',
    valueKey: 'id'
  }
}
```

### Example 3: Form Submission with Authentication

Update `FormRenderer.tsx` line ~95:

```typescript
const response = await ApiService.submitFormData(schema.submitUrl, data, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "X-Client-ID": "journey-360",
    "X-Request-ID": crypto.randomUUID(),
  },
});
```

## API Service Methods

### `fetchDropdownOptions(apiConfig)`

Fetches options for a dropdown field from an external API.

**Parameters:**

- `apiConfig`: Configuration object with url, method, headers, etc.

**Returns:** `Promise<FieldOption[]>`

### `submitFormData(submitUrl, formData, options)`

Submits form data to an external server.

**Parameters:**

- `submitUrl`: Target endpoint URL
- `formData`: Form data object
- `options`: Optional configuration (method, headers, transformData)

**Returns:** `Promise<any>` - Server response

### `checkEndpointHealth(url)`

Performs a health check on an endpoint.

**Parameters:**

- `url`: Endpoint URL to check

**Returns:** `Promise<boolean>`

## Testing

### Mock API for Development

The `ApiService` includes a mock function for testing:

```typescript
const options = await ApiService.mockFetchDropdownOptions("country");
```

### Testing Your API Integration

1. **Check endpoint accessibility:**

   ```typescript
   const isHealthy = await ApiService.checkEndpointHealth(
     "https://api.example.com/countries"
   );
   console.log("API is accessible:", isHealthy);
   ```

2. **Test in browser console:**

   ```javascript
   // Test dropdown fetch
   const options = await fetch("https://restcountries.com/v3.1/all").then((r) =>
     r.json()
   );
   console.log(options);
   ```

3. **Use CORS proxy for development:**
   ```typescript
   apiConfig: {
     url: "https://cors-anywhere.herokuapp.com/https://api.example.com/data";
   }
   ```

## Error Handling

### Dropdown Loading Errors

- Loading spinner shows during fetch
- If API fails, falls back to static `options`
- Error toast notification shown to user
- Empty state shown if no options available

### Form Submission Errors

- Error messages from server are displayed
- Fallback to `schema.errorMessage` if server doesn't provide one
- Form remains editable after error
- Toast notification shows error details

## Security Considerations

### 1. API Keys & Authentication

**Don't hardcode API keys in the schema!** Use environment variables:

```typescript
apiConfig: {
  url: 'https://api.example.com/data',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
  }
}
```

### 2. CORS Issues

If you encounter CORS errors:

1. **Backend solution:** Configure CORS headers on your API
2. **Proxy solution:** Use Next.js API routes as proxy
3. **Development only:** Use CORS proxy services

### 3. Data Validation

Always validate on the server side. Client-side validation can be bypassed.

## Next Steps

1. Replace example URLs with your actual API endpoints
2. Add authentication tokens from your auth system
3. Implement data transformation if your API format differs
4. Add loading states and error boundaries
5. Test with real API endpoints
6. Monitor API response times and add caching if needed

## Example Implementation in aiParser.ts

See the updated `getTravelInsuranceSchema()` function for working examples:

- **Nationality field:** Uses REST Countries API
- **Country field:** Uses REST Countries API with custom headers
- **Destination field:** Example of static options with commented API config
- **Submit URL:** Points to example endpoint (update with real one)

## File Structure

```
utils/
  ├── apiService.ts          # API integration service
  └── aiParser.ts            # Schema generation with API configs

types/
  └── schema.ts              # Type definitions including ApiConfig

components/
  └── FormRenderer.tsx       # Form renderer with API support
```

## Support

For issues or questions about API integration:

1. Check browser console for detailed error messages
2. Verify API endpoint is accessible (use Postman/curl)
3. Check CORS configuration on your server
4. Review network tab in browser DevTools
