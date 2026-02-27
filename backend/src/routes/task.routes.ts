import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.get('/', taskController.getTasks.bind(taskController));
router.post('/', taskController.createTask.bind(taskController));
router.get('/:id', taskController.getTaskById.bind(taskController));
router.patch('/:id', taskController.updateTask.bind(taskController));
router.delete('/:id', taskController.deleteTask.bind(taskController));
router.patch('/:id/toggle', taskController.toggleTask.bind(taskController));

export default router;
