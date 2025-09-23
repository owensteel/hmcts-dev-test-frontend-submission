import { Case } from '../../models/Case';
import { Task } from '../../models/Task';
import { TaskPage } from '../../models/TaskPage';
import { ApiClient } from '../../services/ApiClient';

import { Application, Request, Response } from 'express';

export default function registerHomeRoute(app: Application): void {
  const apiClient = new ApiClient();

  app.get('/', async (req: Request, res: Response) => {
    try {
      // Get case details
      const caseData = await apiClient.getExampleCase();

      // Get query parameters (they come as strings, so cast)
      const page = req.query.page ? Number(req.query.page) : 0;
      const size = req.query.size ? Number(req.query.size) : 5;
      const sortBy = (req.query.sortBy as string) || 'dueDateTime';
      const direction = (req.query.direction as 'asc' | 'desc') || 'asc';

      // Get pre-sorted tasks for this case
      const taskPage: TaskPage<Task> = await apiClient.getTasksForCase(caseData.id, page, size, sortBy, direction);

      // Attach tasks to case object
      const fullCase: Case = { ...caseData };

      // Precompute the list of numbered page links
      const paginationItems = [];
      for (let i = 0; i < taskPage.totalPages; i++) {
        paginationItems.push({
          number: i + 1,
          href: `./?page=${i}&sortBy=${sortBy}&direction=${direction}`,
          current: i === taskPage.number,
        });
      }

      res.render('home', {
        case: fullCase,
        taskPage,
        totalPages: taskPage.totalPages,
        sortBy,
        direction,
        paginationItems,
      });
    } catch (error) {
      // Show an error page instead of rendering empty home
      res.status(500).render('error');
    }
  });
}
