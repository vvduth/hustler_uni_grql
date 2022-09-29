import express from 'express'
const router = express.Router()
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById, 
  updateUser
} from '../controllers/userController.js'
import { protect,admin } from '../middlewares/authMiddleware'

router.route('/').post(registerUser).get(protect,admin, getUsers)
//use for login
router.post('/login', authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect,admin, updateUser)

export default router