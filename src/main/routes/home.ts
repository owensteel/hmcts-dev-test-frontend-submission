import { Application, Request, Response } from "express";
import axios from "axios";
import { Case } from "../../models/Case";
import { Task } from "../../models/Task";

const API_BASE = "http://localhost:4000/api";

export default function registerHomeRoute(app: Application): void {
  app.get("/", async (req: Request, res: Response) => {
    try {
      // Get case details
      const { data: caseData } = await axios.get<Case>(
        `${API_BASE}/cases/get-example-case`
      );

      // Get tasks for this case
      const { data: tasksData } = await axios.get<Task[]>(
        `${API_BASE}/cases/${caseData.id}/tasks`
      );

      // Attach tasks to case object
      const fullCase: Case = { ...caseData, tasks: tasksData };

      res.render("home", { case: fullCase });
    } catch (error) {
      console.error("Error fetching case data:", error);

      // Show an error page instead of rendering empty home
      res.status(500).render("home", {
        case: undefined,
      });
    }
  });
}
