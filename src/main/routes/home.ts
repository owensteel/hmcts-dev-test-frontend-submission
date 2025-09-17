import { Application } from 'express';
import axios from 'axios';
import { Case } from '../../models/Case';

export default function (app: Application): void {
  app.get('/', async (req: any, res: {
    render: (arg0: string, arg1: {
      case?: Case;
    }) => void;
  }) => {
    try {
      const caseDetailsResponse = await axios.get('http://localhost:4000/api/cases/get-example-case');
      const caseTasksResponse = await axios.get(`http://localhost:4000/api/cases/${caseDetailsResponse.data.id}/tasks`);
      res.render(
        'home',
        {
          case: {
            id: caseDetailsResponse.data.id,
            title: caseDetailsResponse.data.title,
            description: caseDetailsResponse.data.description,
            status: caseDetailsResponse.data.status,
            createdAt: caseDetailsResponse.data.createdAt,
            updatedAt: caseDetailsResponse.data.updatedAt,
            tasks: caseTasksResponse.data
          }
        }
      );
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });
}
