import express from 'express';
const router = express.Router();
import { getUsers, createUser, updateUser, deleteUser, getUserById } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;