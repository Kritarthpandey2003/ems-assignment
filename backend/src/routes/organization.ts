import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { getOrgTree } from '../controllers/orgController';

const router = Router();

router.use(authenticate);

router.get('/tree', getOrgTree);

export default router;
