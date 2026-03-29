# Production Deployment Guide

## Overview
This guide explains how to deploy the Cubelelo Support Insights Tool to production with proper API key management.

## API Key Security

### ⚠️ Security Considerations
- **Never commit `.env.local` to git** - It's already in `.gitignore`
- **Never expose API keys in source code** - They should only be in environment variables
- **Never share your OpenRouter API key** - It grants access to use your account's credits
- **Use environment variables in production** - Not localStorage or local files

### Current Implementation
The application supports two ways to provide your OpenRouter API key:

1. **Environment Variable (Recommended for Production)**
   ```
   VITE_OPENROUTER_API_KEY=sk-xxx...
   ```
   - Set on your hosting platform's dashboard
   - Not visible in source code
   - Takes precedence over localStorage

2. **User Input (Development/Testing)**
   - Users enter their own API key in the Settings modal
   - Stored in browser localStorage
   - Only use for development or if you want users to bring their own keys

## Deployment Instructions

### Prerequisites
- OpenRouter account: https://openrouter.ai/
- API key from: https://openrouter.ai/keys
- Hosting platform account (Vercel, Netlify, GitHub Pages, etc.)

### Step 1: Building for Production
```bash
npm run build
```
This creates an optimized `dist/` folder with your application.

### Step 2: Deploy to Hosting Platforms

#### **Vercel (Recommended for Vite apps)**

1. Push your code to GitHub
2. Go to https://vercel.com and connect your repository
3. In project settings, add environment variables:
   ```
   VITE_OPENROUTER_API_KEY = sk-xxx...
   ```
4. Deploy! Vercel will automatically run `npm run build`

**Important:** Don't include the actual API key in your repository - only set it in the Vercel dashboard.

#### **Netlify**

1. Push your code to GitHub
2. Go to https://netlify.com and connect your repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard:
   ```
   VITE_OPENROUTER_API_KEY = sk-xxx...
   ```
6. Deploy!

#### **GitHub Pages**

1. Build locally: `npm run build`
2. Push the `dist/` folder to your GitHub Pages branch
3. **Note:** GitHub Pages is static hosting - environment variables won't be set automatically
   - You'll need to either:
     - Have users provide their own API keys in the app
     - Use a backend proxy to handle API keys (advanced)

#### **Docker / Self-Hosted**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN VITE_OPENROUTER_API_KEY=${VITE_OPENROUTER_API_KEY} npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Set environment variable when running the container:
```bash
docker run -e VITE_OPENROUTER_API_KEY=sk-xxx... your-image
```

### Step 3: Verify Deployment

After deployment:
1. Visit your live URL
2. Open Settings modal → Setup API tab
3. You should see the hint about production deployment
4. The API key should be loaded from the environment variable
5. Users don't need to enter an API key (unless you configured that)

## Alternative: Backend Proxy (Advanced)

For maximum security, you can create a backend service that:
1. Receives CSV data from the frontend (no API key)
2. Calls OpenRouter with the backend's own API key
3. Returns analysis results to the frontend

This way, your API key never touches the client-side code. Example architecture:

```
Frontend (React/Vite)
    ↓
Backend API (Node.js/Python/etc)
    ↓
OpenRouter API
```

This requires creating your own backend service - refer to your backend framework's documentation.

## Environment Variables Reference

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `VITE_OPENROUTER_API_KEY` | No* | Empty string | OpenRouter API key for production. *If not set, users must enter it in the app |

*Note: At least one API key source (environment variable OR user input) must be configured for the app to work.

## Troubleshooting

### "API key is invalid" error
- The API key format is wrong (should start with `sk-`)
- The API key has been revoked or disabled on OpenRouter
- The API key has exceeded credit limits

### App works locally but not in production
- Environment variable not set on hosting platform
- Environment variable name is wrong (should be `VITE_OPENROUTER_API_KEY`)
- Forgot to rebuild: `npm run build`
- Browser is using cached version: Clear cache (Ctrl+Shift+Delete)

### Users can see the API key in DevTools
- This shouldn't happen if you've set the environment variable
- If you see a key in `import.meta.env`, your hosting platform isn't picking up the environment variable
- Check your platform's environment variable settings

## Security Best Practices

1. ✅ Use environment variable in production
2. ✅ Rotate API keys periodically
3. ✅ Monitor API usage on OpenRouter dashboard
4. ✅ Use minimal permissions if OpenRouter offers them
5. ✅ Keep your API key private - don't share with others
6. ✅ Use a separate API key for different environments (dev, staging, prod)

## Monitoring & Maintenance

1. **Check API Usage:**
   - Log in to https://openrouter.ai/dashboard
   - Monitor your API credits and usage

2. **View Logs:**
   - Vercel: Dashboard → Deployments → Logs
   - Netlify: Dashboard → Deploys → Deploy log
   - Check browser console (F12) for client-side errors

3. **Update Dependencies:**
   ```bash
   npm upgrade
   npm run build
   npm run dev  # Test locally
   # Then redeploy
   ```

## Support

- OpenRouter Docs: https://openrouter.ai/docs
- Vite Docs: https://vitejs.dev/guide/env-and-mode.html
- Your hosting platform documentation

---

**Last Updated:** 2024  
**For Issues:** Check the documentation files in the project root
