# Vercel AI Gateway Deployment Guide

## 🚀 Current Status
- ✅ **Local Development**: Uses OpenAI API directly (working)
- ✅ **Vercel Serverless Function**: Ready for deployment (`api/ai-gateway.js`)
- ✅ **Fallback Logic**: Robust error handling implemented
- ⏳ **Production Deployment**: Ready to deploy

## 📋 Deployment Steps

### 1. Deploy to Vercel
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy your project
vercel

# Follow the prompts to connect your project
```

### 2. Configure Environment Variables on Vercel
In your Vercel dashboard, add these environment variables:

```env
# Enable the AI Gateway for production
VITE_AI_GATEWAY_BASE_URL=https://your-project.vercel.app/api/ai-gateway
VITE_AI_GATEWAY_API_KEY=your-secure-gateway-key

# OpenAI API Key (for the serverless function)
OPENAI_API_KEY=sk-proj-your-openai-key-here
```

### 3. Update Local Environment for Production Testing
When you want to test the gateway locally against your deployed Vercel function:

```env
# .env (uncomment these lines)
VITE_AI_GATEWAY_BASE_URL=https://your-project.vercel.app/api/ai-gateway
VITE_AI_GATEWAY_API_KEY=your-secure-gateway-key
```

## 🔧 How It Works

### Local Development (Current)
```
User → AI Service → OpenAI API Direct
```

### Production with Vercel AI Gateway
```
User → AI Service → Vercel Serverless Function → OpenAI API
```

## 🌟 Benefits of Using Vercel AI Gateway

1. **Cost Tracking**: Monitor API usage through Vercel
2. **Rate Limiting**: Control API usage
3. **Security**: Hide OpenAI API key from frontend
4. **Caching**: Potential response caching
5. **Analytics**: Request logging and monitoring

## 🔄 Switching Between Modes

### For Local Development (Current)
```env
# .env - Gateway disabled
# VITE_AI_GATEWAY_BASE_URL=...
# VITE_AI_GATEWAY_API_KEY=...
VITE_OPENAI_API_KEY=sk-proj-your-openai-key-here
```

### For Production with Gateway
```env
# .env - Gateway enabled
VITE_AI_GATEWAY_BASE_URL=https://your-project.vercel.app/api/ai-gateway
VITE_AI_GATEWAY_API_KEY=your-secure-gateway-key
VITE_OPENAI_API_KEY=sk-proj-your-openai-key-here
```

## 🧪 Testing the Deployment

After deployment, you should see:
```
🌐 Using Custom Vercel AI Gateway: https://your-project.vercel.app/api/ai-gateway
📝 Model: gpt-4
📡 Response status: 200
✅ Custom Vercel AI Gateway success
```

## 🛠️ Troubleshooting

### If Gateway Fails
The system will automatically fallback to OpenAI direct:
```
❌ Custom Vercel AI Gateway failed: [error]
🔄 Falling back to OpenAI direct...
🤖 Using OpenAI direct API
✅ OpenAI direct API success
```

### Common Issues
1. **Environment Variables**: Ensure all vars are set in Vercel dashboard
2. **CORS**: The serverless function includes proper CORS headers
3. **API Key**: Make sure `OPENAI_API_KEY` is set in Vercel environment
4. **URL**: Use your actual Vercel deployment URL

## 📁 Files Involved
- `api/ai-gateway.js` - Vercel serverless function
- `src/services/aiService.js` - AI service with gateway integration
- `.env` - Environment configuration
- `vercel.json` - Vercel deployment configuration