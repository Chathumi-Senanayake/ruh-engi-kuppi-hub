import { Router } from 'express';
import { generateStudyGuide, chat } from '../controllers/ai.controller';

const router = Router();

router.post('/study-guide', generateStudyGuide);
router.post('/chat', chat);

export default router;
