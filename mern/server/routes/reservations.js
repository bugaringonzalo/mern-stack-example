import express from 'express';
const router = express.Router();
import reservationController from '../controllers/reservationController.js';
import { auth } from '../middleware/auth.js';
import validateRequest from '../middleware/validate.js';
import { reservationSchema } from '../utils/validationSchemas.js';

router.post('/', auth, validateRequest(reservationSchema), reservationController.createReservation);
router.get('/', auth, reservationController.getReservations);
router.put('/:id', auth, validateRequest(reservationSchema), reservationController.updateReservation);
router.delete('/:id', auth, reservationController.deleteReservation);
//** Get reservations by userId */
router.get('/user/:userId', auth, reservationController.getReservationsByUserId);

export default router;