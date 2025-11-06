# Environment Variables Documentation

## Overview

Journey 360 uses environment variables to configure AI service integration and feature flags. All variables are optional and have sensible defaults.

## Setup

1. Copy the example file:
```bash
cp .env.example .env.local
```

2. Update values in `.env.local` with your configuration

3. Restart the development server:
```bash
npm run dev
```

## Environment Files

- `.env.example` - Template with all available variables
- `.env.local` - Your local configuration (gitignored)
- `.env.production` - Production configuration (if needed)

**Important**: Never commit `.env.local` or `.env.production` to version control.

## AI Service Variables

These variables configure the AI service integration for converting natural language to Form Schema JSON.

### Core Configuration

#### `NEXT_PUBLIC_AI_SERVICE_URL`
- **Type**: String (URL)
- **Required**: No
- **Default**: None
- **Description**: Base URL for your AI service API endpoint
- **Example**: `https://api.openai.com/v1` or `https://api.anthropic.com/v1`

#### `NEXT_PUBLIC_AI_SERVICE_API_KEY`
- **Type**: String
- **Required**: No (required if AI parsing is enabled)
- **Default**: None
- **Description**: API key for authenticating with your AI service
- **Security**: Keep this secret! Never expose in client-side code
- **Example**: `sk-proj-abc123...`

### Model Configuration

#### `NEXT_PUBLIC_AI_MODEL`
- **Type**: String
- **Required**: No
- **Default**: `gpt-4`
- **Description**: AI model to use for schema generation
- **Options**:
  - `gpt-4` - Most capable, best for complex forms
  - `gpt-3.5-turbo` - Faster, cheaper, good for simple forms
  - `claude-3-opus` - Anthropic's most capable model
  - `claude-3-sonnet` - Balanced performance and cost

#### `NEXT_PUBLIC_AI_MAX_TOKENS`
- **Type**: Number
- **Required**: No
- **Default**: `2000`
- **Description**: Maximum tokens in AI response
- **Range**: 100 - 4000
- **Cost Impact**: Higher values = higher API costs

#### `NEXT_PUBLIC_AI_TEMPERATURE`
- **Type**: Number (float)
- **Required**: No
- **Default**: `0.7`
- **Description**: Controls randomness in AI responses
- **Range**: 0.0 - 1.0
- **Recommendations**:
  - `0.0-0.3`: Deterministic, consistent schemas
  - `0.4-0.7`: Balanced creativity and consistency (recommended)
  - `0.8-1.0`: More creative, less predictable

#### `NEXT_PUBLIC_AI_TIMEOUT`
- **Type**: Number (milliseconds)
- **Required**: No
- **Default**: `30000` (30 seconds)
- **Description**: Timeout for AI service requests
- **Range**: 5000 - 60000

## Feature Flags

Control which features are enabled in your deployment.

#### `NEXT_PUBLIC_ENABLE_AI_PARSER`
- **Type**: Boolean
- **Required**: No
- **Default**: `false`
- **Description**: Enable AI-powered schema generation
- **Values**: `true` | `false`
- **Note**: Requires AI service configuration

#### `NEXT_PUBLIC_ENABLE_MOCK_API`
- **Type**: Boolean
- **Required**: No
- **Default**: `true`
- **Description**: Enable mock API generation feature

#### `NEXT_PUBLIC_ENABLE_TEST_GEN`
- **Type**: Boolean
- **Required**: No
- **Default**: `true`
- **Description**: Enable automatic test generation

#### `NEXT_PUBLIC_ENABLE_SPEECH`
- **Type**: Boolean
- **Required**: No
- **Default**: `true`
- **Description**: Enable speech-to-text input
- **Note**: Requires HTTPS or localhost

## Application Settings

#### `NODE_ENV`
- **Type**: String
- **Set by**: Next.js automatically
- **Values**: `development` | `production` | `test`
- **Description**: Current environment

#### `NEXT_PUBLIC_BASE_URL`
- **Type**: String (URL)
- **Required**: No
- **Default**: Auto-detected
- **Description**: Base URL for your application
- **Example**: `https://journey360.example.com`

## Development Settings

#### `NEXT_PUBLIC_DEBUG`
- **Type**: Boolean
- **Required**: No
- **Default**: `false`
- **Description**: Enable debug logging in console
- **Recommendation**: Only enable in development

## AI Service Integration Flow

```
User Input (Text/Speech)
        ↓
AI Service Parser (utils/aiParser.ts)
        ↓
Uses Environment Variables:
  • NEXT_PUBLIC_AI_SERVICE_URL
  • NEXT_PUBLIC_AI_SERVICE_API_KEY
  • NEXT_PUBLIC_AI_MODEL
  • NEXT_PUBLIC_AI_MAX_TOKENS
  • NEXT_PUBLIC_AI_TEMPERATURE
        ↓
AI Service API Call
        ↓
Form Schema JSON Response
        ↓
Form Renderer (components/FormRenderer.tsx)
```

## Example Configurations

### Development (AI Disabled)
```bash
NEXT_PUBLIC_ENABLE_AI_PARSER=false
NEXT_PUBLIC_ENABLE_MOCK_API=true
NEXT_PUBLIC_ENABLE_TEST_GEN=true
NEXT_PUBLIC_DEBUG=true
```

### Development (AI Enabled with OpenAI)
```bash
NEXT_PUBLIC_AI_SERVICE_URL=https://api.openai.com/v1
NEXT_PUBLIC_AI_SERVICE_API_KEY=sk-proj-your-key
NEXT_PUBLIC_AI_MODEL=gpt-4
NEXT_PUBLIC_AI_MAX_TOKENS=2000
NEXT_PUBLIC_AI_TEMPERATURE=0.7
NEXT_PUBLIC_ENABLE_AI_PARSER=true
```

### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://journey360.example.com
NEXT_PUBLIC_AI_SERVICE_URL=https://api.your-service.com/v1
NEXT_PUBLIC_AI_SERVICE_API_KEY=your-production-key
NEXT_PUBLIC_AI_MODEL=gpt-4
NEXT_PUBLIC_ENABLE_AI_PARSER=true
NEXT_PUBLIC_DEBUG=false
```

## Security Best Practices

1. **Never commit** `.env.local` or `.env.production` files
2. **Rotate API keys** regularly
3. **Use different keys** for dev/staging/production
4. **Monitor API usage** to detect unauthorized access
5. **Set rate limits** on your AI service account
6. **Use environment-specific** configurations

## Implementation Notes

### Current State (v1.0)
- AI service integration is **prepared but not implemented**
- Schema generation currently uses **mock/template-based logic**
- All AI variables are **optional** and have no effect when `ENABLE_AI_PARSER=false`

### Future Implementation (v2.0)
When implementing AI service integration:

1. Update `utils/aiParser.ts`:
```typescript
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL;
const AI_API_KEY = process.env.NEXT_PUBLIC_AI_SERVICE_API_KEY;
const AI_MODEL = process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-4';

async function callAIService(prompt: string) {
  const response = await fetch(`${AI_SERVICE_URL}/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      prompt: prompt,
      max_tokens: parseInt(process.env.NEXT_PUBLIC_AI_MAX_TOKENS || '2000'),
      temperature: parseFloat(process.env.NEXT_PUBLIC_AI_TEMPERATURE || '0.7'),
    }),
  });
  return response.json();
}
```

2. Toggle feature in `components/InputRequirementScreen.tsx`:
```typescript
const enableAI = process.env.NEXT_PUBLIC_ENABLE_AI_PARSER === 'true';
```

## Troubleshooting

### AI Service Not Working
1. Check API key is correct
2. Verify service URL is accessible
3. Check API quota/rate limits
4. Review AI service logs
5. Test with curl/Postman first

### Environment Variables Not Loading
1. Restart dev server after changes
2. Check file name is exactly `.env.local`
3. Verify variables start with `NEXT_PUBLIC_`
4. Check for typos in variable names

### CORS Errors
- AI service must allow requests from your domain
- Configure CORS headers on AI service
- Consider using API proxy route

## Support

For issues with:
- **Environment setup**: Check this documentation
- **AI service**: Contact your AI provider
- **Application**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
