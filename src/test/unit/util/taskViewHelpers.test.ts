import { TaskQuery, buildPaginationItems, parseTaskQuery } from '../../../main/util/taskViewHelpers';
import { Task } from '../../../models/Task';
import { TaskPage } from '../../../models/TaskPage';

describe('taskViewHelpers', () => {
  describe('parseTaskQuery', () => {
    it('should parse query params into a TaskQuery object with defaults', () => {
      const query = {};
      const result = parseTaskQuery(query);

      expect(result).toEqual({
        page: 0,
        size: 5,
        sortBy: 'dueDateTime',
        direction: 'asc',
        statusFilter: 'ANY',
      });
    });

    it('should parse valid query params', () => {
      const query = {
        page: '2',
        size: '10',
        sortBy: 'title',
        direction: 'desc',
        statusFilter: 'DONE',
      };

      const result = parseTaskQuery(query);

      expect(result).toEqual({
        page: 2,
        size: 10,
        sortBy: 'title',
        direction: 'desc',
        statusFilter: 'DONE',
      });
    });
  });

  describe('buildPaginationItems', () => {
    it('should build pagination items correctly', () => {
      const currentPageNum = 2; // 0 index
      const fakeTaskPage: TaskPage<Task> = {
        content: [],
        totalElements: 3,
        totalPages: 3,
        size: 3,
        number: currentPageNum,
        first: true,
        last: true,
        empty: false,
      };
      const fakeQueryParams: TaskQuery = {
        page: currentPageNum,
        size: 5,
        sortBy: '',
        direction: 'asc',
        statusFilter: '',
      };
      const items = buildPaginationItems(fakeTaskPage, fakeQueryParams);

      expect(items).toEqual([
        { number: 1, href: '/tasks/?page=0&sortBy=&direction=asc&statusFilter=', current: false },
        { number: 2, href: '/tasks/?page=1&sortBy=&direction=asc&statusFilter=', current: false },
        { number: 3, href: '/tasks/?page=2&sortBy=&direction=asc&statusFilter=', current: true },
      ]);
    });

    it('should return empty array if totalPages = 0', () => {
      const fakeTaskPage: TaskPage<Task> = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0,
        first: true,
        last: true,
        empty: false,
      };
      const fakeQueryParams: TaskQuery = {
        page: 0,
        size: 5,
        sortBy: '',
        direction: 'asc',
        statusFilter: '',
      };

      expect(buildPaginationItems(fakeTaskPage, fakeQueryParams)).toEqual([]);
    });
  });
});
