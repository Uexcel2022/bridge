import express from 'express'
import { signup, getMe,fetchUserByEmail } from '../controller/authController.js'

const authRouter = express.Router()

authRouter.post('/signup',signup);
authRouter.route('/:id').get(getMe);
authRouter.post('/email',fetchUserByEmail)

export {authRouter}