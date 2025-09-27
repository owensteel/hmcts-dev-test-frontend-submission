import { Task } from '../../../models/Task';
import { TaskPage } from '../../../models/TaskPage';
import { NunjucksSelectorOption } from '../../util/commonViewHelpers';
import { PaginationItem, TaskAsTableRow, TaskQuery } from '../../util/taskViewHelpers';

export interface TasksIndexViewModel {
  taskPage: TaskPage<Task>;
  routeQuery: TaskQuery;
  tasksAsTableRows: TaskAsTableRow[];
  paginationItems: PaginationItem[];
  statusFilterSelectorOptions: NunjucksSelectorOption[];
}
