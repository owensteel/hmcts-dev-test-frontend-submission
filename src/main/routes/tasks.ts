import { Application } from 'express';
import { ApiClient } from '../../services/ApiClient';

export default function (app: Application): void {
    const apiClient = new ApiClient();

    // ID of the example case we're working with
    const caseId = 1;

    // Show the form
    app.get('/tasks/new', (req, res) => {
        res.render('../views/tasks/new.njk');
    });

    // Handle form submit
    app.post('/tasks/new', async (req, res) => {
        const { title, description } = req.body;
        try {
            await apiClient.createTask(
                Number(caseId),
                {
                    title,
                    description,
                    dueDateTime: new Date(
                        `${req.body["due-date-time-year"]}-${req.body["due-date-time-month"].padStart(2, '0')}-${req.body["due-date-time-day"].padStart(2, '0')}`
                    ).toISOString(),
                }
            );
            res.redirect(`/`);
        } catch (error) {
            console.error("Error creating task:", error);

            // Show an error page instead of rendering empty home
            res.status(500).render("error");
        }
    });
}
