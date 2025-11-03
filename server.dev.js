import express from 'express';
import ViteExpress from 'vite-express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.static('public'));

// Server start time for auto-reload detection
const serverStartTime = Date.now();

app.get('/health', (_, res) => {
  res.json({ startTime: serverStartTime });
});

app.get('/get-random-image', (_, res) => {
  const folder = './public/images';
  const files = fs.readdirSync(folder);

  const randomFile = files[Math.floor(Math.random() * files.length)];

  res.send(
    path
      .join(folder, randomFile)
      .replace(/\\/g, '/'),
  );
});

// Use ViteExpress for development with HMR
ViteExpress.listen(app, 3001, () => console.log('Development server listening on port 3001...'));
