# Play Nine Netlify Deployment Guide

## Initial Setup

1. Install the Netlify CLI globally if not already installed:
```bash
npm install -g netlify-cli
```

## Backend Deployment

1. Create and link a new Netlify site for the backend:
```bash
cd backend
netlify sites:create --name your-backend-name
netlify link --name your-backend-name
```

2. Configure the backend for serverless functions by ensuring your `netlify.toml` contains:
```toml
[build]
  publish = "public"
  command = "echo 'No build needed'"
  functions = "netlify/functions"

[functions]
  directory = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type"
```

3. Deploy the backend:
```bash
netlify deploy --prod --dir=public --functions=netlify/functions
```

## Frontend Deployment

1. Create and link a new Netlify site for the frontend:
```bash
cd frontend
netlify sites:create --name your-frontend-name
netlify link --name your-frontend-name
```

2. Set the required environment variables:

   a. Set the backend API URL:
   ```bash
   netlify env:set VITE_API_BASE_URL "https://your-backend-name.netlify.app/.netlify/functions/api"
   ```

   b. Set the OpenRouter API key (required for AI features):
   ```bash
   netlify env:set VITE_OPENROUTER_API_KEY "your-openrouter-api-key"
   ```
   You can obtain an OpenRouter API key from [OpenRouter.ai](https://openrouter.ai/).

3. Build and deploy the frontend:
```bash
# For Windows PowerShell:
$env:VITE_API_BASE_URL="https://your-backend-name.netlify.app/.netlify/functions/api"
npm run build
netlify deploy --prod --dir=dist

# For Unix-like shells:
VITE_API_BASE_URL="https://your-backend-name.netlify.app/.netlify/functions/api" npm run build
netlify deploy --prod --dir=dist
```

## Redeploying After Changes

### Backend Changes
1. Make sure you're in the backend directory and linked to the correct site:
```bash
cd backend
netlify link --name your-backend-name
```

2. Deploy changes:
```bash
netlify deploy --prod --dir=public --functions=netlify/functions
```

### Frontend Changes
1. Make sure you're in the frontend directory and linked to the correct site:
```bash
cd frontend
netlify link --name your-frontend-name
```

2. Build and deploy:
```bash
# For Windows PowerShell:
$env:VITE_API_BASE_URL="https://your-backend-name.netlify.app/.netlify/functions/api"
npm run build
netlify deploy --prod --dir=dist

# For Unix-like shells:
VITE_API_BASE_URL="https://your-backend-name.netlify.app/.netlify/functions/api" npm run build
netlify deploy --prod --dir=dist
```

## Managing Environment Variables

### View Current Variables
```bash
netlify env:list
```

### Set New Variables
```bash
netlify env:set VARIABLE_NAME value
```

### Update Existing Variables
```bash
netlify env:unset VARIABLE_NAME
netlify env:set VARIABLE_NAME new-value
```

## Required Environment Variables

1. Frontend Environment Variables:
   - `VITE_API_BASE_URL`: URL of your backend API
   - `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key for AI features

## Troubleshooting

1. If you're unsure which site you're linked to:
```bash
netlify status
```

2. To unlink from current site:
```bash
netlify unlink
```

3. To verify backend API is accessible:
- Visit: https://your-backend-name.netlify.app/.netlify/functions/api/test
- Should see: {"message":"API is working!"}

4. If you encounter CORS issues:
- Verify the backend's `netlify.toml` has the correct CORS headers
- Check that the frontend's API URL environment variable is set correctly
- Ensure you rebuild the frontend after updating environment variables

5. If the frontend can't connect to the backend:
- Verify the backend is deployed successfully
- Check the API URL in the frontend's environment variables
- Ensure you're using the correct path to the serverless function /.netlify/functions/api

6. If AI features aren't working:
- Verify your OpenRouter API key is set correctly
- Check the browser console for any API-related errors
- Ensure you rebuild and redeploy the frontend after updating the API key

Remember to replace `your-backend-name`, `your-frontend-name`, and `your-openrouter-api-key` with your actual values.
