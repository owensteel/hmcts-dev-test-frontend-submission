import { TaskCreate } from './Task';
import { TaskStatus } from './TaskStatus';

export class TaskCreateForm implements TaskCreate {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDateTime: string;
  caseId: number;

  constructor(
    title: string,
    dueDate: string,
    status: TaskStatus = TaskStatus.TODO,
    caseId: number,
    description?: string
  ) {
    this.title = title;
    this.dueDateTime = dueDate;
    this.status = status;
    this.caseId = caseId;
    this.description = description;
  }

  validateAndGetErrors(): { text: string; href: string }[] {
    const errors: { text: string; href: string }[] = [];

    const dueDate = new Date(this.dueDateTime);
    if (isNaN(dueDate.getTime()) || Date.now() > dueDate.getTime()) {
      errors.push({ text: 'Enter a valid due date in the future', href: '#due-date-time' });
    }

    if (!this.title || this.title.trim() === '') {
      errors.push({ text: 'Enter a task title', href: '#title' });
    }

    return errors;
  }
}
