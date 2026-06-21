import { Router } from 'express';
import { getDepartments, getModules, getModuleByCode } from '../controllers/module.controller';

const router = Router();

router.get('/departments', getDepartments);
router.get('/', getModules);
router.get('/:code', getModuleByCode);

export default router;
