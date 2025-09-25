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
