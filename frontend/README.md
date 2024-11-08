# Play9 Frontend

## Prerequisites
- Node.js (v16 or later)
- npm

## Setup
1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```
   npm install
   ```

## Configuration
- Copy `.env.example` to `.env`
- Update `VITE_API_BASE_URL` with your backend server URL if different from default

## Development
Run the development server:
```
npm run dev
```

## Build
Create a production build:
```
npm run build
```

## Deployment
The frontend is built with Vite and can be deployed to static hosting platforms like Netlify, Vercel, or GitHub Pages.

### Netlify Deployment
1. Create a `netlify.toml` file in the root directory:
   ```toml
   [build]
     base = "frontend"
     publish = "dist"
     command = "npm run build"
   ```
2. Set environment variables in Netlify dashboard
3. Connect your GitHub repository
