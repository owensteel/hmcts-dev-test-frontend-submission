import { Task } from '../../../models/Task';
import { TaskPage } from '../../../models/TaskPage';
import { ApiClient } from '../../../services/ApiClient';
import {
  generateTaskStatusSelectorOptions,
  htmlGovUK_summaryListActionsList,
  htmlGovUK_tagForStatus,
} from '../../util/commonViewHelpers';
import * as TaskViewHelpers from '../../util/taskViewHelpers';

import { Request, Response } from 'express';

const apiClient = new ApiClient();
const presetCaseId = 1;

export default async function tasksIndex(req: Request, res: Response): Promise<void> {
  // Get query parameters
  const routeQuery = TaskViewHelpers.parseTaskQuery(req.query);

  // Get pre-sorted tasks for this case
  const taskPage: TaskPage<Task> = await apiClient.getTasksForCase(
    presetCaseId,
    routeQuery.page,
    routeQuery.size,
    routeQuery.sortBy,
    routeQuery.direction,
    routeQuery.statusFilter
  );

  // Convert tasks into rows for Nunjucks
  const tasksAsTableRows = [];
  for (const task of taskPage.content) {
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

  res.render('tasks/index.njk', {
    taskPage,
    routeQuery,
    tasksAsTableRows,
    paginationItems: TaskViewHelpers.buildPaginationItems(taskPage, routeQuery),
    statusFilterSelectorOptions: generateTaskStatusSelectorOptions(routeQuery.statusFilter),
  });
}
