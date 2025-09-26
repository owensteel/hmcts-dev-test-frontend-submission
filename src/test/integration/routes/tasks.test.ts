import { app } from '../../../main/app';
import { getStatusUserFriendlyLabel } from '../../../main/util/taskViewHelpers';
import { Task } from '../../../models/Task';
import { TaskPage } from '../../../models/TaskPage';
import { TaskStatus } from '../../../models/TaskStatus';
import { ApiClient } from '../../../services/ApiClient';

import request from 'supertest';

// Mock the whole ApiClient class
jest.mock('../../../services/ApiClient');

const mockedApiClient = ApiClient as jest.MockedClass<typeof ApiClient>;

const fakeTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'desc',
  dueDateTime: new Date('2099-01-01').toISOString(),
  status: TaskStatus.PENDING,
  caseId: 1,
  createdAt: '',
  updatedAt: '',
};

describe('Tasks routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Fake implementation for getTasksForCase
    const fakeTasksForCase: TaskPage<Task> = {
      content: [fakeTask],
      totalPages: 1,
      totalElements: 1,
      size: 1,
      number: 0,
      first: true,
      last: true,
      empty: false,
    };
    mockedApiClient.prototype.getTasksForCase.mockResolvedValue(fakeTasksForCase);
  });

  it('GET /tasks should return 200 and render the index page with tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.text).toContain(fakeTask.title);
  });

  it('View page for task should return 200 and display public task properties', async () => {
    // Mock client returning fakeTask
    mockedApiClient.prototype.getTask.mockResolvedValue(fakeTask);

    const res = await request(app).get('/tasks/1/view');
    expect(res.status).toBe(200);
    expect(res.text).toContain('View a task');
    expect(res.text).toContain('Task ID: ' + fakeTask.id);
    expect(res.text).toContain(fakeTask.title);
    expect(res.text).toContain(fakeTask.description);
    expect(res.text).toContain(getStatusUserFriendlyLabel(fakeTask.status));
    expect(res.text).toContain(fakeTask.dueDateTime);
  });

  it('View page for non-existent task should return 404 and "not found" message', async () => {
    // Mock client throwing 404 error
    mockedApiClient.prototype.getTask.mockRejectedValue({
      isAxiosError: true,
      message: 'Request failed with status code 404',
      response: {
        status: 404,
        data: { error: 'Not found' },
      },
    });

    const res = await request(app).get('/tasks/1/view');
    expect(res.status).toBe(404);
    expect(res.text).toContain('Page Not Found');
  });

  it('GET /tasks/1/edit/title should return 200 and render edit page for task title', async () => {
    // Mock client returning fakeTask
    mockedApiClient.prototype.getTask.mockResolvedValue(fakeTask);

    const res = await request(app).get('/tasks/1/edit/title');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Edit a task');
    expect(res.text).toContain(fakeTask.title);
  });

  it('Edit page for non-existent task should return 404 and "not found" message', async () => {
    // Mock client throwing 404 error
    mockedApiClient.prototype.getTask.mockRejectedValue({
      isAxiosError: true,
      message: 'Request failed with status code 404',
      response: {
        status: 404,
        data: { error: 'Not found' },
      },
    });

    const res = await request(app).get('/tasks/1/edit/title');
    expect(res.status).toBe(404);
    expect(res.text).toContain('Page Not Found');
  });

  it('GET /tasks/1/edit/invalidProperty should return 500 and error message', async () => {
    const res = await request(app).get('/tasks/1/edit/invalidProperty');
    expect(res.status).toBe(500);
    expect(res.text).toContain('Something went wrong');
  });

  it('POST /tasks/new should succeed without CSRF in test env', async () => {
    const res = await request(app)
      .post('/tasks/new')
      .send({
        title: 'New Task',
        ['due-date-time-month']: '01',
        ['due-date-time-day']: '01',
        ['due-date-time-year']: '2099',
        status: TaskStatus.PENDING,
        caseId: 1,
      });

    // Controller should redirect after success
    expect(res.status).toBe(302);
  });
});
