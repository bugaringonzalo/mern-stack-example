import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authController.js';
import validateRequest from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../utils/validationSchemas.js';

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;