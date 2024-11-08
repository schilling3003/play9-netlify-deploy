# Play9 Backend

## Prerequisites
- Node.js (v16 or later)
- npm

## Setup
1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```

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
The backend is a Node.js Express server that can be deployed to platforms like Render, Heroku, or DigitalOcean.

### Deployment Considerations
- Ensure `PORT` environment variable is set for dynamic port allocation
- Configure database connection (currently using local SQLite)

### Netlify Deployment
For serverless deployment on Netlify, you'll need to:
1. Use Netlify Functions or Netlify Edge Functions
2. Modify the server code to work with serverless architecture
3. Set up appropriate environment variables
