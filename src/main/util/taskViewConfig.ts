import { TaskStatus } from '../../models/TaskStatus';

/*

    Constants mapping for Tasks routes

*/

const TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES: Record<string, string> = {
  [TaskStatus.DONE]: 'Done',
  [TaskStatus.IN_PROGRESS]: 'In progress',
  [TaskStatus.PENDING]: 'To do',
  [TaskStatus.BLOCKED]: 'Blocked',
};

const TASK_EDIT_VALID_HIGHLIGHTED_PROPERTIES: string[] = [
  'delete-description',
  'title',
  'description',
  'due-date',
  'status',
];

const TASK_STATUS_TO_GOVUKTAG_CLASS: Record<string, string> = {
  [TaskStatus.DONE]: 'govuk-tag--green',
  [TaskStatus.IN_PROGRESS]: 'govuk-tag--blue',
  [TaskStatus.PENDING]: 'govuk-tag--grey',
  [TaskStatus.BLOCKED]: 'govuk-tag--red',
};

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
