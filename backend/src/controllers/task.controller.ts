import { Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest, ApiResponse, TaskQueryParams } from '../types';

export class TaskController {
    async createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId!;
            const task = await taskService.createTask(userId, req.body);

            const response: ApiResponse = {
                success: true,
                message: 'Task created successfully',
                data: task,
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId!;
            const query = req.query as unknown as TaskQueryParams;
            const result = await taskService.getTasks(userId, query);

            const response: ApiResponse = {
                success: true,
                message: 'Tasks retrieved successfully',
                data: result.tasks,
                meta: result.meta,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getTaskById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId!;
            const id = req.params.id as string;
            const task = await taskService.getTaskById(userId, id);

            const response: ApiResponse = {
                success: true,
                message: 'Task retrieved successfully',
                data: task,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId!;
            const id = req.params.id as string;
            const task = await taskService.updateTask(userId, id, req.body);

            const response: ApiResponse = {
                success: true,
                message: 'Task updated successfully',
                data: task,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId!;
            const id = req.params.id as string;
            await taskService.deleteTask(userId, id);

            const response: ApiResponse = {
                success: true,
                message: 'Task deleted successfully',
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async toggleTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId!;
            const id = req.params.id as string;
            const task = await taskService.toggleTask(userId, id);

            const response: ApiResponse = {
                success: true,
                message: 'Task status toggled successfully',
                data: task,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export const taskController = new TaskController();
