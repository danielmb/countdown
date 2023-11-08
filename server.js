import express from 'express';
import ViteExpress from 'vite-express';
import fs from 'fs';
import path from 'path';
const app = express();
app.use(express.static('public'));

app.get('/get-random-image', (_, res) => {
  const folder = './public/images';
  const files = fs.readdirSync(folder);
  const randomFile = files[Math.floor(Math.random() * files.length)];
  res.sendFile(path.resolve(path.join(folder, randomFile)));
});

ViteExpress.listen(app, 3001, () => console.log('Server is listening...'));
