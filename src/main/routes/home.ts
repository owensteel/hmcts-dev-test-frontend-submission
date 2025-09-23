import { Case } from '../../models/Case';
import { ApiClient } from '../../services/ApiClient';

import { Application, Request, Response } from 'express';

export default function registerHomeRoute(app: Application): void {
  const apiClient = new ApiClient();

  app.get('/', async (req: Request, res: Response) => {
    try {
      // Get case details
      const caseData = await apiClient.getExampleCase();

      // Attach tasks to case object
      const fullCase: Case = { ...caseData };

      res.render('home', {
        case: fullCase,
      });
    } catch (error) {
      // Show an error page instead of rendering empty home
      res.status(500).render('error');
    }
  });
}
