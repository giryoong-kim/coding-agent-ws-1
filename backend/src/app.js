const express = require('express');
const cors = require('cors');
const issueRoutes = require('./routes/issues');
const commentRoutes = require('./routes/comments');
const summaryRoutes = require('./routes/summary');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', issueRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', summaryRoutes);

module.exports = app;
