/*

    Common validators for create and edit task forms

*/

export function isValidTaskFormDueDateTime(dueDateTime: string): boolean {
  const dueDate = new Date(dueDateTime);
  return isNaN(dueDate.getTime()) || Date.now() > dueDate.getTime();
}

export function isValidTaskFormTitle(title: string): boolean {
  return typeof title === 'string' && title.trim() === '';
}
