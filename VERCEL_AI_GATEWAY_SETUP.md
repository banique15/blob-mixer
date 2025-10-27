# Vercel AI Gateway Setup Guide

This guide will help you deploy your own Vercel AI Gateway to proxy requests to OpenAI.

## Prerequisites

1. A Vercel account (free tier works)
2. Vercel CLI installed: `npm i -g vercel`
3. Your OpenAI API key

## Step-by-Step Deployment

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy the Gateway
From your project root directory:
```bash
vercel --prod
```

### 4. Set Environment Variables
After deployment, you need to add your OpenAI API key:

```bash
# Add your OpenAI API key as a secret
vercel env add OPENAI_API_KEY
```

When prompted:
- **Environment**: Choose "Production"
- **Value**: Paste your OpenAI API key (starts with sk-...)

### 5. Redeploy to Apply Environment Variables
```bash
vercel --prod
```

### 6. Get Your Gateway URL
After deployment, Vercel will provide you with a URL like:
```
https://your-project-name.vercel.app
```

Your AI Gateway endpoint will be:
```
https://your-project-name.vercel.app/api/ai-gateway
```

### 7. Update Your .env File
Replace the placeholder URL in your `.env` file:

```env
# Replace this line:
VITE_AI_GATEWAY_BASE_URL=https://your-gateway-url.vercel.app/api

# With your actual URL:
VITE_AI_GATEWAY_BASE_URL=https://your-project-name.vercel.app/api
```

### 8. Update Authentication
You can use your Vercel API token for authentication, or create a custom auth system.

For now, you can use your Vercel token:
```env
VITE_AI_GATEWAY_API_KEY=your_vercel_api_token
```

## Testing Your Gateway

Once deployed, you can test it with curl:

```bash
curl -X POST https://your-project-name.vercel.app/api/ai-gateway \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_vercel_token" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
  }'
```

## Benefits of Using Your Gateway

1. **Cost Management**: Monitor and control API usage
2. **Rate Limiting**: Add custom rate limiting
3. **Caching**: Implement response caching
4. **Analytics**: Track usage patterns
5. **Security**: Add authentication layers
6. **Customization**: Modify requests/responses as needed

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Working**
   - Make sure you redeploy after adding environment variables
   - Check that OPENAI_API_KEY is set in Vercel dashboard

2. **CORS Errors**
   - The gateway includes CORS headers
   - If still having issues, check your domain settings

3. **Authentication Errors**
   - Verify your Vercel API token is correct
   - Make sure the token has appropriate permissions

### Vercel Dashboard
You can manage your deployment at: https://vercel.com/dashboard

## Next Steps

Once your gateway is working:
1. Your chat application will automatically use the gateway
2. Monitor usage in Vercel dashboard
3. Consider adding rate limiting and caching
4. Implement custom authentication if needed

## Files Created

- `api/ai-gateway.js` - The gateway function
- `vercel.json` - Vercel configuration
- This setup guide

Your application is now ready to use Vercel AI Gateway instead of direct OpenAI API calls!