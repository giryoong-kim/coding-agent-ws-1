const { Router } = require('express');
const issueService = require('../services/issueService');

const router = Router();

router.post('/issues', (req, res) => {
  const result = issueService.createIssue(req.body);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

router.get('/issues', (req, res) => {
  const result = issueService.listIssues(req.query.status);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

router.get('/issues/:id', (req, res) => {
  const result = issueService.getIssue(req.params.id);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

router.patch('/issues/:id/status', (req, res) => {
  const result = issueService.updateStatus(req.params.id, req.body);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

module.exports = router;
