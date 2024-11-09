# Play Nine Netlify Deployment Guide

## Initial Setup

1. Install the Netlify CLI globally if not already installed:
```bash
npm install -g netlify-cli
```

## Important Note About Site Linking

Before deploying to any site, it's crucial to ensure you're linked to the correct site. Each directory (frontend/backend) should be linked to its respective site. If you're unsure or need to change the linked site:

1. Check current linked site:
```bash
netlify status
```

2. If linked to the wrong site, unlink first:
```bash
netlify unlink
```

3. Then link to the correct site:
```bash
netlify link --name your-site-name
```

**WARNING**: Deploying without checking the linked site can result in deploying to the wrong site and overwriting another deployment. Always verify the linked site before deploying.

## Backend Deployment

1. Create and link a new Netlify site for the backend:
```bash
cd backend
netlify unlink  # If already linked to another site
netlify link --name play9-backend
```

2. Configure the backend for edge functions by ensuring your `netlify.toml` contains:
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
netlify deploy --prod --build
```

## Frontend Deployment

1. Create and link a new Netlify site for the frontend:
```bash
cd frontend
netlify unlink  # If already linked to another site
netlify link --name play9-golf-frontend-app
```

2. Set the required environment variables:

   a. Set the backend API URL:
   ```bash
   netlify env:set VITE_API_BASE_URL "https://play9-backend.netlify.app/.netlify/edge-functions/api"
   ```

   b. Set the OpenRouter API key (required for AI features):
   ```bash
   netlify env:set VITE_OPENROUTER_API_KEY "your-openrouter-api-key"
   ```
   You can obtain an OpenRouter API key from [OpenRouter.ai](https://openrouter.ai/).

3. Build and deploy the frontend:
```bash
netlify deploy --prod --build
```

## Redeploying After Changes

### Backend Changes
1. Make sure you're in the backend directory and linked to the correct site:
```bash
cd backend
netlify unlink  # If already linked to another site
netlify link --name play9-backend
netlify deploy --prod --build
```

### Frontend Changes
1. Make sure you're in the frontend directory and linked to the correct site:
```bash
cd frontend
netlify unlink  # If already linked to another site
netlify link --name play9-golf-frontend-app
netlify deploy --prod --build
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
   - `VITE_API_BASE_URL`: URL of your backend API (using edge functions)
   - `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key for AI features

## Troubleshooting

1. If you're deploying to the wrong site:
   - Always run `netlify status` to check the current linked site
   - Run `netlify unlink` before linking to the correct site
   - Use `netlify link --name site-name` to link to the correct site

2. To verify backend API is accessible:
   - Visit: https://play9-backend.netlify.app/.netlify/edge-functions/api/test
   - Should see: {"message":"Edge function is working!"}

3. If you encounter CORS issues:
   - Verify the backend's `netlify.toml` has the correct CORS headers
   - Check that the frontend's API URL environment variable is set correctly
   - Ensure you rebuild the frontend after updating environment variables

4. If the frontend can't connect to the backend:
   - Verify the backend is deployed successfully
   - Check the API URL in the frontend's environment variables
   - Ensure you're using the correct path to the edge function (/.netlify/edge-functions/api)

5. If AI features aren't working:
   - Verify your OpenRouter API key is set correctly
   - Check the browser console for any API-related errors
   - Ensure you rebuild and redeploy the frontend after updating the API key

Remember: Always verify which site you're linked to before deploying. Running `netlify status` before deployment can save you from accidentally deploying to the wrong site.
