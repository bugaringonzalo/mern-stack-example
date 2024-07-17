import express from 'express';
const router = express.Router();
import bedController from '../controllers/bedController.js';
import auth from '../middleware/auth.js';
import validateRequest from '../middleware/validate.js';
import { bedSchema } from '../utils/validationSchemas.js';

router.post('/', auth, validateRequest(bedSchema), bedController.createBed);
router.get('/', bedController.getBeds);
router.put('/:id', auth, validateRequest(bedSchema), bedController.updateBed);
router.delete('/:id', auth, bedController.deleteBed);

export default router;