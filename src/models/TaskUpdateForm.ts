import { isValidTaskFormDueDateTime, isValidTaskFormTitle } from '../main/util/taskFormValidators';

import { TaskUpdate } from './Task';
import { TaskStatus } from './TaskStatus';

export class TaskUpdateForm implements TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
  dueDateTime?: string;

  constructor(title?: string, dueDate?: string, status?: TaskStatus, description?: string) {
    this.title = title;
    this.dueDateTime = dueDate;
    this.status = status;
    this.description = description;
  }

  validateAndGetErrors(): { text: string; href: string }[] {
    const errors: { text: string; href: string }[] = [];

    if (this.dueDateTime && !isValidTaskFormDueDateTime(this.dueDateTime)) {
      errors.push({ text: 'Enter a valid due date in the future', href: '#due-date-time' });
    }

    if (this.title && !isValidTaskFormTitle(this.title)) {
      errors.push({ text: 'Enter a task title', href: '#title' });
    }

    return errors;
  }
}
