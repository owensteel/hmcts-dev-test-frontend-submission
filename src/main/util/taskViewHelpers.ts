import {
  TASK_EDIT_VALID_HIGHLIGHTED_PROPERTIES,
  TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES,
  TASK_STATUS_TO_GOVUKTAG_CLASS,
} from './taskViewConfig';

export function isValidEditTaskHighlightedProperty(highlightedProperty: string): boolean {
  return TASK_EDIT_VALID_HIGHLIGHTED_PROPERTIES.includes(highlightedProperty);
}
export function getStatusUserFriendlyLabel(status: string): string {
  if (!(status in TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES)) {
    throw new Error('Not a recognised Task Status');
  }
  return TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES[status];
}
export function getStatusTagClass(status: string): string {
  if (!(status in TASK_STATUS_TO_GOVUKTAG_CLASS)) {
    throw new Error('Not a recognised Task Status');
  }
  return TASK_STATUS_TO_GOVUKTAG_CLASS[status];
}

export interface TaskQuery {
  page: number;
  size: number;
  sortBy: string;
  direction: 'asc' | 'desc';
  statusFilter: string;
}

export function parseTaskQuery(q: Record<string, unknown>): TaskQuery {
  return {
    page: q.page ? Number(q.page) : 0,
    size: q.size ? Number(q.size) : 5,
    sortBy: (q.sortBy as string) || 'dueDateTime',
    direction: (q.direction as 'asc' | 'desc') || 'asc',
    statusFilter: q.statusFilter ? (q.statusFilter as string) : 'ANY',
  };
}
