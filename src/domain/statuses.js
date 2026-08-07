export const VALID_STATUSES = ['open', 'in_progress', 'done'];

const ALLOWED_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['done'],
  done: [],
};

export function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

export function isValidTransition(from, to) {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
