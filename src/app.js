const express = require('express');
const path = require('path');
const issuesRouter = require('./routes/issues');
const commentsRouter = require('./routes/comments');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/api/v1/issues', issuesRouter);
  app.use('/api/v1/issues', commentsRouter);

  const staticDir = process.env.STATIC_DIR || path.join(process.cwd(), 'public');
  app.use(express.static(staticDir));

  app.get('*', (req, res) => {
    const indexPath = path.join(staticDir, 'index.html');
    const fs = require('fs');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Frontend not built. Place static assets in ./public' });
    }
  });

  return app;
}

module.exports = { createApp };
