# API Integration - Quick Reference

## ✅ What Was Added

### 1. Dynamic Dropdown Options

Fields can now fetch their options from external APIs in real-time.

### 2. External Form Submission

Forms can now submit data directly to your backend API.

## 🚀 Quick Start

### For Dropdown Fields

```typescript
{
  id: 'country',
  name: 'country',
  label: 'Country',
  type: 'select',
  apiConfig: {
    url: 'https://api.example.com/countries',
    method: 'GET',                    // Optional: defaults to GET
    labelKey: 'name',                 // Optional: defaults to 'label'
    valueKey: 'code'                  // Optional: defaults to 'value'
  }
}
```

### For Form Submission

```typescript
{
  id: 'my-form',
  title: 'Registration Form',
  fields: [...],
  submitUrl: 'https://api.example.com/submit'
}
```

## 📝 Files Modified/Created

| File                            | Purpose                                        |
| ------------------------------- | ---------------------------------------------- |
| `types/schema.ts`               | Added `ApiConfig` interface                    |
| `utils/apiService.ts`           | **NEW** - API integration service              |
| `components/FormRenderer.tsx`   | Added API support for dropdowns and submission |
| `utils/aiParser.ts`             | Updated with API examples                      |
| `docs/API_INTEGRATION_GUIDE.md` | **NEW** - Complete documentation               |
| `utils/exampleApiForm.ts`       | **NEW** - Working examples                     |

## 🔧 Configuration Options

### ApiConfig Properties

| Property   | Type            | Required | Description                                   |
| ---------- | --------------- | -------- | --------------------------------------------- |
| `url`      | string          | ✅       | API endpoint URL                              |
| `method`   | 'GET' \| 'POST' | ❌       | HTTP method (default: GET)                    |
| `headers`  | object          | ❌       | Custom headers                                |
| `params`   | object          | ❌       | Query params (GET) or body (POST)             |
| `dataPath` | string          | ❌       | JSONPath to extract data (e.g., 'data.items') |
| `labelKey` | string          | ❌       | Key for option label (default: 'label')       |
| `valueKey` | string          | ❌       | Key for option value (default: 'value')       |

## 🎯 Real Examples in aiParser.ts

1. **Nationality Field** - Uses REST Countries API

   - Line ~173: `traveler_nationality`
   - Fetches all countries dynamically

2. **Country Field** - Uses REST Countries API with custom headers

   - Line ~303: `country`
   - Demonstrates header configuration

3. **Destination Field** - Static options with commented API example
   - Line ~79: `destination`
   - Shows how to add API as alternative

## 🛠️ How It Works

### Dropdown Loading Flow

1. Form loads → Scans for fields with `apiConfig`
2. Calls `ApiService.fetchDropdownOptions()` for each field
3. Shows loading spinner while fetching
4. Populates dropdown when data arrives
5. Falls back to static `options` on error

### Form Submission Flow

1. User clicks Submit → Validates form
2. If `schema.submitUrl` exists → Calls `ApiService.submitFormData()`
3. Sends JSON POST to your server
4. Shows success/error message
5. Resets form on success

## 🔒 Security Notes

**⚠️ Never hardcode API keys!**

Use environment variables:

```typescript
apiConfig: {
  url: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
  }
}
```

## 🧪 Testing Your Integration

### 1. Test API Endpoint

```bash
curl -X GET "https://restcountries.com/v3.1/all"
```

### 2. Check in Browser Console

```javascript
fetch("https://restcountries.com/v3.1/all")
  .then((r) => r.json())
  .then((data) => console.log(data));
```

### 3. Use Mock Data (Development)

```typescript
const options = await ApiService.mockFetchDropdownOptions("country");
```

## ⚡ Next Steps

1. **Replace example URLs** with your actual endpoints

   - Update `submitUrl` in schemas
   - Update `apiConfig.url` in fields

2. **Add authentication**

   - Modify `FormRenderer.tsx` line ~95
   - Add your auth headers

3. **Handle CORS**

   - Configure CORS on your backend
   - Or use Next.js API routes as proxy

4. **Test thoroughly**
   - Test each API endpoint
   - Test form submission
   - Test error scenarios

## 📚 Documentation

- **Complete Guide:** `docs/API_INTEGRATION_GUIDE.md`
- **Examples:** `utils/exampleApiForm.ts`
- **Type Definitions:** `types/schema.ts`
- **Service Code:** `utils/apiService.ts`

## 🐛 Common Issues

### CORS Errors

**Solution:** Add CORS headers to your API or use a proxy

### API Not Loading

**Solution:** Check browser console, verify URL is accessible

### Form Not Submitting

**Solution:** Check `submitUrl` is set in schema

### Options Not Showing

**Solution:** Verify `labelKey` and `valueKey` match your API response

## 💡 Tips

- Always provide fallback `options` for API-driven fields
- Use loading indicators for better UX
- Add error boundaries for graceful failures
- Test with real APIs before production
- Monitor API response times
- Consider caching for frequently used data

## 📞 Support

Check the following when troubleshooting:

1. Browser console for errors
2. Network tab in DevTools
3. API endpoint accessibility (Postman/curl)
4. CORS configuration on server
5. Response format matches expected structure
