import prisma from '../config/database';
import { TaskCreateInput, TaskUpdateInput, TaskQueryParams } from '../types';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';
import { validateTaskTitle } from '../utils/validators';

export class TaskService {
    async createTask(userId: string, input: TaskCreateInput) {
        const { title, description, status, priority, dueDate } = input;

        // Validate title
        const titleValidation = validateTaskTitle(title);
        if (!titleValidation.valid) {
            throw new BadRequestError(titleValidation.message);
        }

        // Validate status if provided
        if (status && !['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
            throw new BadRequestError('Invalid status. Must be PENDING, IN_PROGRESS, or COMPLETED');
        }

        // Validate priority if provided
        if (priority && !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
            throw new BadRequestError('Invalid priority. Must be LOW, MEDIUM, or HIGH');
        }

        const task = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                status: status || 'PENDING',
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : null,
                userId,
            },
        });

        return task;
    }

    async getTasks(userId: string, query: TaskQueryParams) {
        const page = parseInt(query.page || '1', 10);
        const limit = parseInt(query.limit || '10', 10);
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            userId,
        };

        if (query.status) {
            where.status = query.status;
        }

        if (query.priority) {
            where.priority = query.priority;
        }

        if (query.search) {
            where.title = {
                contains: query.search,
            };
        }

        // Build orderBy
        const sortBy = query.sortBy || 'createdAt';
        const sortOrder = query.sortOrder || 'desc';
        const orderBy: any = {
            [sortBy]: sortOrder,
        };

        // Execute queries
        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            prisma.task.count({ where }),
        ]);

        return {
            tasks,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getTaskById(userId: string, taskId: string) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        if (task.userId !== userId) {
            throw new ForbiddenError('You do not have access to this task');
        }

        return task;
    }

    async updateTask(userId: string, taskId: string, input: TaskUpdateInput) {
        // Check task exists and belongs to user
        const existingTask = await this.getTaskById(userId, taskId);

        if (input.title) {
            const titleValidation = validateTaskTitle(input.title);
            if (!titleValidation.valid) {
                throw new BadRequestError(titleValidation.message);
            }
        }

        if (input.status && !['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(input.status)) {
            throw new BadRequestError('Invalid status. Must be PENDING, IN_PROGRESS, or COMPLETED');
        }

        if (input.priority && !['LOW', 'MEDIUM', 'HIGH'].includes(input.priority)) {
            throw new BadRequestError('Invalid priority. Must be LOW, MEDIUM, or HIGH');
        }

        const updateData: any = {};
        if (input.title !== undefined) updateData.title = input.title.trim();
        if (input.description !== undefined) updateData.description = input.description?.trim() || null;
        if (input.status !== undefined) updateData.status = input.status;
        if (input.priority !== undefined) updateData.priority = input.priority;
        if (input.dueDate !== undefined) updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;

        const task = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });

        return task;
    }

    async deleteTask(userId: string, taskId: string) {
        // Check task exists and belongs to user
        await this.getTaskById(userId, taskId);

        await prisma.task.delete({
            where: { id: taskId },
        });

        return { message: 'Task deleted successfully' };
    }

    async toggleTask(userId: string, taskId: string) {
        const task = await this.getTaskById(userId, taskId);

        // Toggle status: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
        const statusMap: Record<string, string> = {
            PENDING: 'IN_PROGRESS',
            IN_PROGRESS: 'COMPLETED',
            COMPLETED: 'PENDING',
        };

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                status: statusMap[task.status],
            },
        });

        return updatedTask;
    }
}

export const taskService = new TaskService();
