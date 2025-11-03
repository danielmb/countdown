# Countdown App

Christmas countdown display application with auto-deploy to self-hosted Windows runner.

## Development

Run the development server with hot module replacement:

```powershell
npm run dev
```

This uses `server.dev.js` with ViteExpress for live reloading.

## Production

Build and run in production mode:

```powershell
npm run build
npm start
```

Production mode serves pre-built static files from `dist/` without file watchers.

## Deployment

The app auto-deploys to a self-hosted Windows machine via GitHub Actions:

1. **Stops all Node processes** to release file locks
2. **Checks out code**
3. **Builds the application** (`npm run build`)
4. **Creates a Windows Scheduled Task** that:
   - Runs `node server.js` (production mode)
   - Starts on boot
   - Runs under SYSTEM account
   - Auto-restarts the app

## Auto-Reload Feature

The browser automatically refreshes when the server restarts:

- Client polls `/health` endpoint every 10 seconds
- Detects server restart via changed start time
- Triggers page reload to show new version

## Scripts

- `npm run dev` - Development server with HMR (port 3001)
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Key Files

- `server.dev.js` - Development server with ViteExpress
- `server.js` - Production server (serves built files)
- `.github/workflows/deploy.yml` - Auto-deployment workflow
- `start-kiosk.ps1` - Launch browser in kiosk mode
- `start-fullscreen.ps1` - Launch browser in fullscreen mode
