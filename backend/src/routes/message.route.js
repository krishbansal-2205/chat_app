import { Router } from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import {
   getMessages,
   getUsers,
   sendMessage,
} from '../controllers/message.controller.js';

const router = Router();

router.get('/users', protectRoute, getUsers);
router.get('/:id', protectRoute, getMessages);

router.post('/send/:id', protectRoute, sendMessage);

export default router;
