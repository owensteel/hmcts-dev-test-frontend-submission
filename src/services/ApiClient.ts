import axios, { AxiosInstance } from "axios";
import { Case } from "../models/Case";
import { Task } from "../models/Task";

export class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string = process.env.API_URL || "http://localhost:4000/api") {
        this.client = axios.create({
            baseURL,
            timeout: 5000,
        });
    }

    async getCase(caseId: string): Promise<Case> {
        const { data } = await this.client.get<Case>(`/cases/${caseId}`);
        return data;
    }

    async getExampleCase(): Promise<Case> {
        const { data } = await this.client.get<Case>(`/cases/get-example-case`);
        return data;
    }

    async getTasksForCase(caseId: number): Promise<Task[]> {
        const { data } = await this.client.get<Task[]>(`/cases/${caseId}/tasks`);
        return data;
    }
}
