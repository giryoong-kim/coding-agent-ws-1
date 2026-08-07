function validateCreateIssue(req, res, next) {
  const { title } = req.body;

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(422).json({ error: 'Title is required and must be a non-empty string' });
  }

  req.body.title = title.trim();
  if (req.body.description === undefined || req.body.description === null) {
    req.body.description = '';
  }

  next();
}

function validateUpdateStatus(req, res, next) {
  const { status } = req.body;

  if (status === undefined || status === null) {
    return res.status(422).json({ error: 'Status field is required' });
  }

  if (typeof status !== 'string') {
    return res.status(422).json({ error: 'Status must be a string' });
  }

  next();
}

function validateCreateComment(req, res, next) {
  const { body } = req.body;

  if (typeof body !== 'string' || body.trim().length === 0) {
    return res.status(422).json({ error: 'Comment body is required and must be a non-empty string' });
  }

  req.body.body = body.trim();
  next();
}

module.exports = {
  validateCreateIssue,
  validateUpdateStatus,
  validateCreateComment,
};
