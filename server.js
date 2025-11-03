import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Server start time for auto-reload detection
const serverStartTime = Date.now();

// Serve static files from the dist directory (production build)
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_, res) => {
  res.json({ startTime: serverStartTime });
});

app.get('/get-random-image', (_, res) => {
  const folder = './public/images';
  const files = fs.readdirSync(folder);

  //   .filter((file) => {
  //   // for now only allow mp4 files
  //   return file.endsWith('.mp4');
  // });
  const randomFile = files[Math.floor(Math.random() * files.length)];
  // res.sendFile(path.resolve(path.join(folder, randomFile)));

  // send path only
  res.send(
    path
      .join(folder, randomFile)
      // .replace('\\', '/'));
      .replace(/\\/g, '/'),
  );
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Production server listening on port ${PORT}...`);
});
