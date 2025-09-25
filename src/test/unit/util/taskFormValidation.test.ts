import { validateTaskCreateAndGetErrors } from '../../../main/util/taskFormValidation';
import { TaskCreate } from '../../../models/Task';
import { TaskStatus } from '../../../models/TaskStatus';

describe('taskFormValidation', () => {
  describe('validateTaskCreateAndGetErrors', () => {
    it('should return no errors for a valid task', () => {
      const task: TaskCreate = {
        title: 'My Task',
        description: 'Something to do',
        dueDateTime: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: TaskStatus.PENDING,
        caseId: 1,
      };

      const errors = validateTaskCreateAndGetErrors(task);
      expect(errors).toEqual([]);
    });

    it('should return error if title is missing/empty', () => {
      const task: TaskCreate = {
        title: '',
        description: 'Missing title',
        dueDateTime: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: TaskStatus.PENDING,
        caseId: 1,
      };

      const errors = validateTaskCreateAndGetErrors(task);
      expect(errors).toEqual([{ text: 'Enter a task title', href: '#title' }]);
    });

    it('should return error if due date is invalid', () => {
      const task: TaskCreate = {
        title: 'Bad Date Task',
        description: 'Oops',
        dueDateTime: 'not-a-date',
        status: TaskStatus.PENDING,
        caseId: 1,
      };

      const errors = validateTaskCreateAndGetErrors(task);
      expect(errors).toEqual([{ text: 'Enter a valid due date in the future', href: '#due-date-time' }]);
    });

    it('should return error if due date is in the past', () => {
      const task: TaskCreate = {
        title: 'Past Task',
        description: 'Late',
        dueDateTime: new Date(Date.now() - 3600 * 1000).toISOString(),
        status: TaskStatus.PENDING,
        caseId: 1,
      };

      const errors = validateTaskCreateAndGetErrors(task);
      expect(errors).toEqual([{ text: 'Enter a valid due date in the future', href: '#due-date-time' }]);
    });

    it('should return multiple errors if both title and due date are invalid', () => {
      const task: TaskCreate = {
        title: '',
        description: 'Bad task',
        dueDateTime: 'not-a-date',
        status: TaskStatus.PENDING,
        caseId: 1,
      };

      const errors = validateTaskCreateAndGetErrors(task);
      expect(errors).toEqual(
        expect.arrayContaining([
          { text: 'Enter a task title', href: '#title' },
          { text: 'Enter a valid due date in the future', href: '#due-date-time' },
        ])
      );
    });
  });
});
