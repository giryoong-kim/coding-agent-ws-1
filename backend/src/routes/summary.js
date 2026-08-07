const { Router } = require('express');
const issueService = require('../services/issueService');

const router = Router();

router.get('/summary', (req, res) => {
  const result = issueService.getSummary();
  res.status(result.status).json(result.data);
});

module.exports = router;
