/*

    Common validators for create and edit task forms

*/

import { TaskCreate, TaskUpdate } from '../../models/Task';

const taskFormInvalidTitleError = { text: 'Enter a task title', href: '#title' };
const taskFormInvalidDueDateError = { text: 'Enter a valid due date in the future', href: '#due-date-time' };

function isValidTaskFormDueDateTime(dueDateTime: string): boolean {
  const dueDate = new Date(dueDateTime);
  return !(isNaN(dueDate.getTime()) || Date.now() > dueDate.getTime());
}

function isValidTaskFormTitle(title: string): boolean {
  return !(typeof title === 'string' && title.trim() === '');
}

export interface validationError {
  text: string;
  href: string;
}

export function validateTaskCreateAndGetErrors(taskCreate: TaskCreate): validationError[] {
  const errors: validationError[] = [];

  if (!isValidTaskFormDueDateTime(taskCreate.dueDateTime)) {
    errors.push(taskFormInvalidDueDateError);
  }

  if (!isValidTaskFormTitle(taskCreate.title)) {
    errors.push(taskFormInvalidTitleError);
  }

  return errors;
}

export function validateTaskUpdateAndGetErrors(taskUpdate: TaskUpdate): validationError[] {
  const errors: validationError[] = [];

  if (taskUpdate.dueDateTime && !isValidTaskFormDueDateTime(taskUpdate.dueDateTime)) {
    errors.push(taskFormInvalidDueDateError);
  }

  if (typeof taskUpdate.title === 'string' && !isValidTaskFormTitle(taskUpdate.title)) {
    errors.push(taskFormInvalidTitleError);
  }

  return errors;
}
