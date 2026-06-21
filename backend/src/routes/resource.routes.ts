import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { createResource, getResourcesByModule, updateResource, deleteResource } from '../controllers/resource.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', protect, upload.single('file'), createResource);
router.get('/:moduleCode', getResourcesByModule);
router.put('/:id', protect, admin, updateResource);
router.delete('/:id', protect, admin, deleteResource);

export default router;
