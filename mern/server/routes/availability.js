import express from 'express';
const router = express.Router();

import availabilityController from '../controllers/availabilityController.js';
import auth from '../middleware/auth.js';
import validateRequest from '../middleware/validate.js';
import { availabilitySchema } from '../utils/validationSchemas.js';

router.get('/',auth, availabilityController.getBedsAvailables);




export default router;