import express from 'express';
const router = express.Router();

import availabilityController from '../controllers/availabilityController.js';
import { auth } from '../middleware/auth.js';
import validateRequest from '../middleware/validate.js';
import { availabilitySchema } from '../utils/validationSchemas.js';

router.get('/',auth, availabilityController.getBedsAvailables);
router.get('/by-date',auth, availabilityController.getAvailabilityByDate);

router.get('/bed-date',auth, availabilityController.getAvailabilityByBedAndDate);
// router.get('/all',auth, availabilityController.getAvailabilities);





export default router;