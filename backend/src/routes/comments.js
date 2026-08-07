const { Router } = require('express');
const commentService = require('../services/commentService');

const router = Router();

router.post('/issues/:id/comments', (req, res) => {
  const result = commentService.addComment(req.params.id, req.body);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

router.get('/issues/:id/comments', (req, res) => {
  const result = commentService.getComments(req.params.id);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

module.exports = router;
