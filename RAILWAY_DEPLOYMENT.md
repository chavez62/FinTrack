# Deploying FinTrack to Railway

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Git installed on your machine
3. Node.js and npm installed

## Deployment Steps

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Initialize Railway Project

```bash
railway init
```

### 4. Deploy to Railway

```bash
railway up
```

### 5. Set Custom Domain (Optional)

```bash
railway domain
```

## Environment Variables

Railway will automatically set the `PORT` environment variable. No additional configuration is needed.

## Build Process

1. Railway will run `npm install` to install dependencies
2. Railway will run `npm run build` to build the React app
3. Railway will run `npm start` to serve the built app using Express

## Troubleshooting

- If the build fails, check the Railway logs: `railway logs`
- Ensure all dependencies are in `package.json`
- The app will be available at the URL provided by Railway

## Local Development

For local development, use:

```bash
npm run dev
```

For production testing locally:

```bash
npm run build
npm start
```
