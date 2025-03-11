import { Router } from 'express';
import * as apiController from "../controller/api";
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.put('/update-user-data/:userId?', authMiddleware, apiController.updateUserData);

router.get('/fetch-user-data/:userId?', authMiddleware, apiController.fetchUserData);

router.get('/fetch-all-users', authMiddleware, apiController.fetchAllUsers);

export default router;