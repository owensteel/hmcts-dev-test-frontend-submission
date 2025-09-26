import { Task } from '../../../models/Task';
import { TaskPage } from '../../../models/TaskPage';
import { NunjucksSelectorOption } from '../../util/commonViewHelpers';
import { PaginationItem, TaskQuery } from '../../util/taskViewHelpers';

export interface TasksIndexViewModel {
  taskPage: TaskPage<Task>;
  routeQuery: TaskQuery;
  tasksAsTableRows: ({ text: string } | { html: string })[][];
  paginationItems: PaginationItem[];
  statusFilterSelectorOptions: NunjucksSelectorOption[];
}
