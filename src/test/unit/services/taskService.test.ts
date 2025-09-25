import { Task } from '../../../models/Task';
import { TaskCreateForm } from '../../../models/TaskCreateForm';
import { TaskStatus } from '../../../models/TaskStatus';
import { TaskUpdateForm } from '../../../models/TaskUpdateForm';
import { ApiClient } from '../../../services/ApiClient';
import { TaskService } from '../../../services/TaskService';

jest.mock('../../../services/ApiClient');

describe('TaskService', () => {
  let service: TaskService;
  let mockApiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    mockApiClient = new ApiClient() as jest.Mocked<ApiClient>;
    service = new TaskService(mockApiClient);
  });

  describe('createTask', () => {
    it('should call ApiClient.createTask with correct payload', async () => {
      const caseId = 123;

      const form: TaskCreateForm = new TaskCreateForm(
        'Test Task',
        '2025-09-30T00:00:00.000Z',
        TaskStatus.PENDING,
        caseId,
        'Something to do'
      );

      const expectedTask: Task = {
        id: 1,
        ...form,
        createdAt: Date.now().toLocaleString(),
        updatedAt: Date.now().toLocaleString(),
      };
      mockApiClient.createTask.mockResolvedValue(expectedTask);

      const result = await service.create(caseId, form);

      expect(mockApiClient.createTask).toHaveBeenCalledWith(caseId, form);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('updateTask', () => {
    it('should call ApiClient.updateTask with correct payload', async () => {
      const caseId = 123;

      const form: TaskUpdateForm = new TaskUpdateForm(
        'Updated task',
        '2025-10-30T00:00:00.000Z',
        TaskStatus.DONE,
        caseId,
        'New description'
      );

      const expectedTask: Task = {
        id: 1,
        title: form.title!,
        status: form.status!,
        dueDateTime: form.dueDateTime!,
        caseId,
        createdAt: Date.now().toLocaleString(),
        updatedAt: Date.now().toLocaleString(),
      };
      mockApiClient.updateTask.mockResolvedValue(expectedTask);

      const result = await service.update(caseId, form);

      expect(mockApiClient.updateTask).toHaveBeenCalledWith(caseId, form);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('deleteTask', () => {
    it('should call ApiClient.deleteTask with correct args', async () => {
      mockApiClient.deleteTask.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockApiClient.deleteTask).toHaveBeenCalledWith(1);
    });
  });
});
