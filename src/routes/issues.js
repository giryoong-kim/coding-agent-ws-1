import { Router } from 'express';
import * as issueService from '../domain/issueService.js';

const router = Router();

router.post('/', (req, res) => {
  const { title, description } = req.body;
  const result = issueService.createIssue(title, description);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

router.get('/', (req, res) => {
  const { status } = req.query;
  const result = issueService.getIssues(status);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

router.get('/:id', (req, res) => {
  const result = issueService.getIssueById(req.params.id);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const result = issueService.transitionStatus(req.params.id, status);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

router.post('/:id/comments', (req, res) => {
  const { body } = req.body;
  const result = issueService.addComment(req.params.id, body);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

router.get('/:id/comments', (req, res) => {
  const result = issueService.getComments(req.params.id);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  res.status(result.status).json(result.data);
});

export default router;

export const summaryRouter = Router();

summaryRouter.get('/', (req, res) => {
  const result = issueService.getSummary();
  res.status(result.status).json(result.data);
});
