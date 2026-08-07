const { createApp } = require('./app');
const { closeDb } = require('./db/connection');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const app = createApp();

const server = app.listen(PORT, HOST, () => {
  console.log(`Issue tracker backend listening on http://${HOST}:${PORT}`);
});

function shutdown() {
  console.log('Shutting down...');
  server.close(() => {
    closeDb();
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
