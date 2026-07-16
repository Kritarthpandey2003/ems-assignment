import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { 
  getAllEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee, 
  getReportees, 
  assignManager 
} from '../controllers/employeeController';

const router = Router();

router.use(authenticate);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.get('/:id/reportees', getReportees);

router.post('/', authorize(['SUPER_ADMIN', 'HR_MANAGER']), createEmployee);
router.put('/:id', updateEmployee); // logic handles self-update or HR/Admin inside controller
router.delete('/:id', authorize(['SUPER_ADMIN']), deleteEmployee);
router.patch('/:id/manager', authorize(['SUPER_ADMIN', 'HR_MANAGER']), assignManager);

export default router;
