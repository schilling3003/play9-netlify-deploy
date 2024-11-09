# Play Nine Netlify Deployment Guide

## Initial Setup

1. Install the Netlify CLI globally if not already installed:
```bash
npm install -g netlify-cli
```

## Backend Deployment

1. Create a new Netlify site for the backend:
```bash
cd backend
netlify sites:create --name your-backend-name
```

2. Link the backend directory to the site:
```bash
netlify link --name your-backend-name
```

3. Deploy the backend:
```bash
netlify deploy --prod --dir=public --functions=netlify/functions
```

## Frontend Deployment

1. Create a new Netlify site for the frontend:
```bash
cd frontend
netlify sites:create --name your-frontend-name
```

2. Link the frontend directory to the site:
```bash
netlify link --name your-frontend-name
```

3. Set the backend API URL environment variable:
```bash
netlify env:set VITE_API_BASE_URL https://your-backend-name.netlify.app/.netlify/functions/api
```

4. Build and deploy the frontend:
```bash
npm run build
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
npm run build
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

4. To check frontend environment variables:
```bash
cd frontend
netlify env:list
```

Remember to replace `your-backend-name` and `your-frontend-name` with your actual Netlify site names.
