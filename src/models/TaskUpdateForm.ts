import { TaskUpdate } from './Task';
import { TaskStatus } from './TaskStatus';

export class TaskUpdateForm implements TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
  dueDateTime?: string;

  constructor(title?: string, dueDate?: string, status?: TaskStatus, caseId?: number, description?: string) {
    this.title = title;
    this.dueDateTime = dueDate;
    this.status = status;
    this.description = description;
  }

  validateAndGetErrors(): { text: string; href: string }[] {
    const errors: { text: string; href: string }[] = [];

    if (this.dueDateTime) {
      const dueDate = new Date(this.dueDateTime);
      if (isNaN(dueDate.getTime()) || Date.now() > dueDate.getTime()) {
        errors.push({ text: 'Enter a valid due date in the future', href: '#due-date-time' });
      }
    }

    if (typeof this.title === 'string' && this.title.trim() === '') {
      errors.push({ text: 'Enter a task title', href: '#title' });
    }

    return errors;
  }
}
