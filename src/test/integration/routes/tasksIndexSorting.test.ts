import { app } from '../../../main/app';
import { Task } from '../../../models/Task';
import { TaskPage } from '../../../models/TaskPage';
import { TaskStatus } from '../../../models/TaskStatus';
import { ApiClient } from '../../../services/ApiClient';

import request from 'supertest';

/*

    Does NOT test sorting and filtering logic, as that is on the backend.
    These are simple contract tests that make sure the correct parameters
    are sent and that content is displayed properly.

*/

jest.mock('../../../services/ApiClient');
const mockedApiClient = ApiClient as jest.MockedClass<typeof ApiClient>;

// Varied tasks to prove sorting and filtering
const fakeTasks: Task[] = [];

const task1WithDoneStatus: Task = {
  id: 1,
  caseId: 1,
  title: 'Example task 1',
  status: TaskStatus.DONE,
  dueDateTime: new Date('01/02/2026').toISOString(),
  createdAt: '',
  updatedAt: '',
};
fakeTasks.push(task1WithDoneStatus);

const task2WithInProgressStatus: Task = {
  id: 2,
  caseId: 1,
  title: 'Example task 2',
  status: TaskStatus.IN_PROGRESS,
  dueDateTime: new Date('01/01/2026').toISOString(),
  createdAt: '',
  updatedAt: '',
};
fakeTasks.push(task2WithInProgressStatus);

describe('Tasks index sorting', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    const fakeTasksForCase: TaskPage<Task> = {
      content: fakeTasks,
      totalPages: 1,
      totalElements: fakeTasks.length,
      size: 5,
      number: 0,
      first: true,
      last: true,
      empty: false,
    };
    mockedApiClient.prototype.getTasksForCase.mockResolvedValue(fakeTasksForCase);
  });

  it('should sort tasks by due date, by default', async () => {
    await request(app).get('/tasks');

    expect(mockedApiClient.prototype.getTasksForCase).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      'dueDateTime',
      'asc',
      expect.any(String)
    );
  });

  it('should request tasks sorted by title asc and render them in that order', async () => {
    const res = await request(app).get('/tasks?sortBy=title&direction=asc');

    expect(mockedApiClient.prototype.getTasksForCase).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      'title',
      'asc',
      expect.any(String)
    );

    // Assert rendered order
    expect(res.text.indexOf(task1WithDoneStatus.title)).toBeLessThan(res.text.indexOf(task2WithInProgressStatus.title));
  });
});
