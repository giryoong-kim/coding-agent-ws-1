import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import issueRoutes, { summaryRouter } from './routes/issues.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { getDatabase } from './persistence/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname, '..', 'dist');

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/v1/issues', issueRoutes);
app.use('/api/v1/summary', summaryRouter);

app.use(express.static(STATIC_DIR));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(STATIC_DIR, 'index.html'), (err) => {
    if (err) next();
  });
});

app.use('/api', notFoundHandler);
app.use(errorHandler);

getDatabase();

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Issue tracker backend listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close();
});

process.on('SIGINT', () => {
  server.close();
});
