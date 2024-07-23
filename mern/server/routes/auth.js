import express from 'express';
const router = express.Router();
import { register, login, me } from '../controllers/authController.js';
// descomentar las lineas siguientes para traerte la verificacion de email
// import { registerWithEmailVerification } from '../controllers/authController.js';
// import { verifyEmail } from '../controllers/authController.js';
import validateRequest from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../utils/validationSchemas.js';


router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me',auth, me);
// descomentar la linea siguiente para enviar email de verificacion
// router.get('/verify-email/:token', verifyEmail);


export default router;