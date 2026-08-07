const { Router } = require('express');
const { createIssue, listIssues, getIssueById, updateIssueStatus, VALID_STATUSES } = require('../db/issues');
const { validateCreateIssue, validateUpdateStatus } = require('../middleware/validation');

const router = Router();

router.post('/', validateCreateIssue, (req, res) => {
  const { title, description } = req.body;
  const issue = createIssue(title, description);
  res.status(201).json(issue);
});

router.get('/', (req, res) => {
  const { status } = req.query;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(422).json({ error: `Invalid status filter. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const result = listIssues(status || null);
  res.json(result);
});

router.get('/:id', (req, res) => {
  const issue = getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  res.json(issue);
});

router.patch('/:id', validateUpdateStatus, (req, res) => {
  const { status } = req.body;
  const result = updateIssueStatus(req.params.id, status);

  if (result.error === 'not_found') {
    return res.status(404).json({ error: 'Issue not found' });
  }
  if (result.error === 'invalid_status') {
    return res.status(422).json({ error: result.message });
  }
  if (result.error === 'illegal_transition') {
    return res.status(409).json({ error: result.message });
  }

  res.json(result.issue);
});

module.exports = router;
