import { Task } from '../../models/Task';
import { TaskPage } from '../../models/TaskPage';
import { TaskStatus } from '../../models/TaskStatus';

import { htmlGovUK_summaryListActionsList, htmlGovUK_tagForStatus } from './commonViewHelpers';
import {
  TASK_EDIT_VALID_HIGHLIGHTED_PROPERTIES,
  TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES,
  TASK_STATUS_TO_GOVUKTAG_CLASS,
} from './taskViewConfig';

export function isValidEditTaskHighlightedProperty(highlightedProperty: string): boolean {
  return TASK_EDIT_VALID_HIGHLIGHTED_PROPERTIES.includes(highlightedProperty);
}
export function getStatusUserFriendlyLabel(status: string): string {
  if (!(status in TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES)) {
    // fallback
    return TaskStatus.UNKNOWN;
  } else {
    return TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES[status];
  }
}
export function getStatusTagClass(status: string): string {
  if (!(status in TASK_STATUS_TO_GOVUKTAG_CLASS)) {
    // fallback
    return TASK_STATUS_TO_GOVUKTAG_CLASS[TaskStatus.PENDING]; // neutral grey
  } else {
    return TASK_STATUS_TO_GOVUKTAG_CLASS[status];
  }
}

export function getAllTaskStatusesWithUserFriendlyLabel(): string[] {
  return Object.keys(TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES);
}

export interface TaskQuery {
  page: number;
  size: number;
  sortBy: string;
  direction: 'asc' | 'desc';
  statusFilter: string;
}

export function parseTaskQuery(q: Record<string, unknown>): TaskQuery {
  return {
    page: q.page ? Number(q.page) : 0,
    size: q.size ? Number(q.size) : 5,
    sortBy: (q.sortBy as string) || 'dueDateTime',
    direction: (q.direction as 'asc' | 'desc') || 'asc',
    statusFilter: q.statusFilter ? (q.statusFilter as string) : 'ANY',
  };
}

export interface PaginationItem {
  number: number;
  href: string;
  current: boolean;
}

export function buildPaginationItems(taskPage: TaskPage<Task>, routeQuery: TaskQuery): PaginationItem[] {
  const paginationItems = [];
  for (let i = 0; i < taskPage.totalPages; i++) {
    paginationItems.push({
      number: i + 1,
      href: `/tasks/?page=${i}&sortBy=${routeQuery.sortBy}&direction=${routeQuery.direction}&statusFilter=${routeQuery.statusFilter}`,
      current: i === taskPage.number,
    });
  }
  return paginationItems;
}

export type TaskAsTableRow = { text?: string; html?: string }[];

export function renderTasksAsTableRows(tasks: Task[]): TaskAsTableRow[] {
  const tasksAsTableRows: TaskAsTableRow[] = [];
  for (const task of tasks) {
    tasksAsTableRows.push([
      { text: task.title },
      { text: task.dueDateTime },
      {
        html: htmlGovUK_tagForStatus(task.status),
      },
      {
        html: htmlGovUK_summaryListActionsList([
          {
            text: 'View or Edit',
            href: `/tasks/${task.id}/view`,
            visuallyHidden: 'View or edit this Task.',
          },
          {
            text: 'Delete',
            href: `/tasks/${task.id}/delete`,
            visuallyHidden: 'Delete this Task.',
          },
        ]),
      },
    ]);
  }
  return tasksAsTableRows;
}
