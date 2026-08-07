const VALID_STATUSES = ['open', 'in_progress', 'done'];

const ALLOWED_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['done'],
  done: [],
};

function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

function isValidTransition(currentStatus, newStatus) {
  return ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
}

function validateCreateIssue(body) {
  if (!body || typeof body.title !== 'string' || body.title.trim() === '') {
    return { valid: false, error: 'Title is required and must be a non-empty string' };
  }
  return { valid: true };
}

function validateStatusUpdate(body) {
  if (!body || typeof body.status !== 'string') {
    return { valid: false, error: 'Status is required and must be a string' };
  }
  if (!isValidStatus(body.status)) {
    return { valid: false, error: `Invalid status value: '${body.status}'. Must be one of: ${VALID_STATUSES.join(', ')}` };
  }
  return { valid: true };
}

function validateStatusTransition(currentStatus, newStatus) {
  if (!isValidTransition(currentStatus, newStatus)) {
    return {
      valid: false,
      error: `Transition from '${currentStatus}' to '${newStatus}' is not allowed. Allowed transitions: open -> in_progress -> done`,
    };
  }
  return { valid: true };
}

function validateCreateComment(body) {
  if (!body || typeof body.body !== 'string' || body.body.trim() === '') {
    return { valid: false, error: 'Comment body is required and must be a non-empty string' };
  }
  return { valid: true };
}

function validateStatusFilter(status) {
  if (status && !isValidStatus(status)) {
    return { valid: false, error: `Invalid status filter: '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}` };
  }
  return { valid: true };
}

module.exports = {
  VALID_STATUSES,
  ALLOWED_TRANSITIONS,
  isValidStatus,
  isValidTransition,
  validateCreateIssue,
  validateStatusUpdate,
  validateStatusTransition,
  validateCreateComment,
  validateStatusFilter,
};
