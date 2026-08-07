const { Router } = require('express');
const { createComment, listComments } = require('../db/comments');
const { validateCreateComment } = require('../middleware/validation');

const router = Router();

router.post('/:id/comments', validateCreateComment, (req, res) => {
  const { body } = req.body;
  const result = createComment(req.params.id, body);

  if (result.error === 'not_found') {
    return res.status(404).json({ error: 'Issue not found' });
  }

  res.status(201).json(result.comment);
});

router.get('/:id/comments', (req, res) => {
  const result = listComments(req.params.id);

  if (result.error === 'not_found') {
    return res.status(404).json({ error: 'Issue not found' });
  }

  res.json({ comments: result.comments });
});

module.exports = router;
