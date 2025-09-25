import { TaskStatus } from '../../models/TaskStatus';

export const TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES: Record<string, string> = {
  [TaskStatus.DONE]: 'Done',
  [TaskStatus.IN_PROGRESS]: 'In progress',
  [TaskStatus.PENDING]: 'To do',
  [TaskStatus.BLOCKED]: 'Blocked',
};

export const TASK_EDIT_VALID_HIGHLIGHTED_PROPERTIES: string[] = [
  'delete-description',
  'title',
  'description',
  'due-date',
  'status',
];

export const TASK_STATUS_TO_GOVUKTAG_CLASS: Record<string, string> = {
  [TaskStatus.DONE]: 'govuk-tag--green',
  [TaskStatus.IN_PROGRESS]: 'govuk-tag--blue',
  [TaskStatus.PENDING]: 'govuk-tag--grey',
  [TaskStatus.BLOCKED]: 'govuk-tag--red',
};
